// backend/services/localLogic.js
import fs from "fs";
import path from "path";
import { getSession, updateSession } from "./sessionStore.js";
import { notifyLiveLead } from "./notifyLead.js";
import { handlePricingIntent } from "./flows/pricingFlow.js";
import { handleLeadCapture } from "./flows/leadFlow.js";


// ---------------- PATHS ----------------
const baseKnowledgeDir = path.resolve("./data/knowledge");
const companyTopicsDir = path.resolve("./data/knowledge/companyTopics");
const leadsPath = path.resolve("./data/leads/rivon_leads.json");

const DEBUG = true;

// ---------------- SESSION DEFAULT ----------------
function makeDefaultSession() {
    return {
        mode: "default", // default | site_planning | drafting
        lastQuestion: "",

        leadId: "",
        businessType: "",
        offering: "",
        goals: "",

        siteType: "", // landing_page | full_website | ecommerce | blog | forum | booking | portfolio | custom
        ecommerceMode: "", // ecommerce | showroom
        productCount: "",

        premiumChatbot: "", // yes | no
        personalization: "", // yes | no

        timeline: "", // asap | 1-2 weeks | 1 month | flexible
        budget: "", // low | medium | high or $...
        email: "",
        emailConfirmed: false,

        leadName: "",
        phone: "",
        requestSummary: "",

        topOffer: "",
        idealCustomer: "",

        // live lead flags
        leadNotified: false,

        locks: {
            businessType: false,
            goals: false,
            siteType: false,
            ecommerceMode: false,
            productCount: false,
            premiumChatbot: false,
            personalization: false,
            timeline: false,
            budget: false,
            email: false,
            topOffer: false,
            idealCustomer: false,
        },

        lastTouchedAt: Date.now(),
    };
}

// ---------------- LEAD SAVE / UPDATE ----------------
function ensureLeadId(session) {
    if (session.leadId) return;
    session.leadId = `lead_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

function readLeadsFile() {
    try {
        if (!fs.existsSync(leadsPath)) return [];
        const raw = JSON.parse(fs.readFileSync(leadsPath, "utf8"));
        return Array.isArray(raw) ? raw : [];
    } catch {
        return [];
    }
}

function writeLeadsFile(arr) {
    const dir = path.dirname(leadsPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(leadsPath, JSON.stringify(arr, null, 2), "utf8");
}

function saveLeadProgress(session, userRole = "guest") {
    const hasProgress =
        !!session.businessType ||
        !!session.goals ||
        !!session.siteType ||
        !!session.ecommerceMode ||
        !!session.productCount ||
        !!session.premiumChatbot ||
        !!session.personalization ||
        !!session.timeline ||
        !!session.budget ||
        !!session.email ||
        !!session.topOffer ||
        !!session.idealCustomer;

    if (!hasProgress) return;

    ensureLeadId(session);

    const record = {
        leadId: session.leadId,
        updatedAt: new Date().toISOString(),
        role: userRole,

        businessType: session.businessType,
        offering: session.offering,
        goals: session.goals,

        siteType: session.siteType,
        ecommerceMode: session.ecommerceMode,
        productCount: session.productCount,

        premiumChatbot: session.premiumChatbot,
        personalization: session.personalization,

        timeline: session.timeline,
        budget: session.budget,

        email: session.email,
        emailConfirmed: session.emailConfirmed,

        topOffer: session.topOffer,
        idealCustomer: session.idealCustomer,
    };

    try {
        const leads = readLeadsFile();
        const idx = leads.findIndex((l) => l.leadId === record.leadId);
        if (idx >= 0) leads[idx] = { ...leads[idx], ...record };
        else leads.push(record);
        writeLeadsFile(leads);
        if (DEBUG) console.log("💾 Saved lead progress:", record);
    } catch (err) {
        console.error("❌ Failed to save lead progress:", err);
    }
}

// ---------------- HELPERS ----------------
function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function tokenize(s) {
    return (s || "").toLowerCase().match(/[a-z0-9']+/g) || [];
}

function cleanPhrase(s) {
    return (s || "")
        .replace(/[.?!,;:]+/g, "")
        .replace(/\s{2,}/g, " ")
        .trim();
}

function buildUI(choices) {
    return {
        kind: "choices",
        choices: (choices || []).map((c, idx) => ({
            id: c.id || `c_${idx}_${Date.now()}`,
            label: c.label,
            value: c.value,
        })),
    };
}

function withGlobalChoices(uiChoices = []) {
    // Utility options
    const base = [
        { label: "Talk to someone", value: "talk to a person" },
        { label: "Start over", value: "__RESET__" },
    ];

    const seen = new Set();
    const merged = [...uiChoices, ...base].filter((c) => {
        const key = String(c.label || "").toLowerCase();
        if (!key) return false;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    return buildUI(merged);
}

// ---------------- LOAD KNOWLEDGE ----------------
function loadFolderOfJson(dirPath, label) {
    const data = [];
    try {
        if (!fs.existsSync(dirPath)) {
            if (DEBUG) console.warn(`⚠️ Folder not found: ${label} at ${dirPath}`);
            return data;
        }
        const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".json"));
        for (const f of files) {
            const raw = JSON.parse(fs.readFileSync(path.join(dirPath, f), "utf8"));
            if (Array.isArray(raw)) data.push(...raw);
            else data.push(...Object.values(raw).flat());
        }
        if (DEBUG) console.log(`📚 Loaded ${data.length} entries from ${label}`);
    } catch (err) {
        console.error(`❌ Failed to load ${label}:`, err);
    }
    return data;
}

function loadAllKnowledge(rootDir) {
    const all = [];
    let scanned = 0;

    function walk(dir) {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const ent of entries) {
            const full = path.join(dir, ent.name);
            if (ent.isDirectory()) {
                walk(full);
            } else if (ent.isFile() && ent.name.endsWith(".json")) {
                try {
                    const raw = JSON.parse(fs.readFileSync(full, "utf8"));
                    if (Array.isArray(raw)) all.push(...raw);
                    else all.push(...Object.values(raw).flat());
                    scanned++;
                } catch (e) {
                    console.error("❌ Failed parsing:", full, e);
                }
            }
        }
    }

    walk(rootDir);

    const normalized = all
        .map((x) => {
            if (!x || typeof x !== "object") return null;
            const keywords = Array.isArray(x.keywords) ? x.keywords : [];
            const response = typeof x.response === "string" ? x.response : "";
            const connected = Array.isArray(x.connected_responses)
                ? x.connected_responses
                : [];
            const topic = typeof x.topic === "string" ? x.topic : "";
            return {
                ...x,
                keywords,
                response,
                topic,
                connected_responses: connected,
            };
        })
        .filter((x) => x && x.keywords.length && x.response);

    if (DEBUG) {
        console.log(`📚 Loaded ${normalized.length} total knowledge entries from: ${rootDir}`);
        console.log(`🗂️ JSON files scanned: ${scanned}`);
    }

    return normalized;
}

const companyKnowledge = loadFolderOfJson(companyTopicsDir, "companyTopics")
    .map((x) => ({
        ...x,
        keywords: Array.isArray(x?.keywords) ? x.keywords : [],
        response: typeof x?.response === "string" ? x.response : "",
        connected_responses: Array.isArray(x?.connected_responses)
            ? x.connected_responses
            : [],
    }))
    .filter((x) => x.keywords.length && x.response);

const generalKnowledge = loadAllKnowledge(baseKnowledgeDir);

// ---------------- MATCHING ----------------
function normalizeKeyword(k) {
    return (k || "").toLowerCase().trim();
}

function scoreEntry(entry, text) {
    if (!entry || !Array.isArray(entry.keywords)) return 0;

    const t = (text || "").toLowerCase();
    const tokens = new Set(tokenize(t));
    let score = 0;
    let hits = 0;

    for (const kwRaw of entry.keywords) {
        const kw = normalizeKeyword(kwRaw);
        if (!kw) continue;

        if (kw.includes(" ") && t.includes(kw)) {
            score += 12;
            hits++;
            continue;
        }
        if (!kw.includes(" ") && tokens.has(kw)) {
            score += 7;
            hits++;
            continue;
        }
        if (!kw.includes(" ") && t.includes(kw)) {
            score += 3;
            hits++;
        }
    }

    if (hits >= 2) score += 6;
    if (hits >= 3) score += 10;

    return score;
}

function bestMatch(entries, text) {
    let best = null;
    let bestScore = 0;
    for (const e of entries) {
        const s = scoreEntry(e, text);
        if (s > bestScore) {
            best = e;
            bestScore = s;
        }
    }
    return { best, bestScore };
}

// ---------------- INTENT CHECKS ----------------
function wantsToExitPlanning(raw) {
    const t = (raw || "").toLowerCase();
    return /(stop|exit|nevermind|never mind|forget that|different question|unrelated)/i.test(t);
}

function wantsTalkToHuman(raw) {
    const t = (raw || "").toLowerCase();
    return /(talk to a person|talk to human|call me|call|text me|live|agent|representative|someone call|contact me now)/i.test(
        t
    );
}

function wantsPlanning(raw) {
    const t = (raw || "").toLowerCase();
    return /(build|make|create|need|want|start).*(website|site|landing page|online store|ecommerce|blog|forum|portal|app)/i.test(
        t
    );
}

// ✅ NEW: reset can be button OR typed
function wantsReset(raw) {
    const t = (raw || "").toLowerCase().trim();
    return t === "__reset__" || /(start over|restart|reset|fresh start)/i.test(t);
}

function isCompanyQuestion(raw) {
    const t = (raw || "").toLowerCase();
    return /(rivon|pricing|plans|packages|tiers|cost|what do you do|what is rivon|chatbot|automation|personalization|website)/i.test(
        t
    );
}

// ---------------- PARSERS ----------------
const BUSINESS_SYNONYMS = [
    { key: "toy store", variants: ["toy store", "toy shop", "toystore", "toy business"] },
    { key: "pet store", variants: ["pet store", "pet shop", "pet business"] },
    { key: "restaurant", variants: ["restaurant", "diner", "cafe", "coffee shop", "pizzeria", "pizza place"] },
    { key: "personal brand", variants: ["personal brand", "influencer", "creator", "portfolio"] },
    { key: "service business", variants: ["service business", "local service", "contractor", "home services"] },
    { key: "ecommerce", variants: ["ecommerce", "e-commerce", "online store", "web store", "shop online"] },
];

function extractOffering(raw) {
    const m = raw.match(/\b(we|i|it)\s+(sell|sells|selling|offer|offers|offering)\s+([^.,;!?]+)/i);
    if (!m) return "";
    const phrase = cleanPhrase(m[3]);
    return phrase.length >= 3 ? phrase : "";
}

function extractBusinessInfo(raw) {
    const t = (raw || "").toLowerCase();

    for (const entry of BUSINESS_SYNONYMS) {
        for (const v of entry.variants) {
            if (t.includes(v)) return { businessType: entry.key, offering: extractOffering(raw) };
        }
    }

    let m = raw.match(/\bfor\s+(a|an|my)\s+([^.,;!?]+)/i);
    if (m) {
        const phrase = cleanPhrase(m[2]);
        if (phrase && phrase.length >= 3) return { businessType: phrase, offering: extractOffering(raw) };
    }

    m = raw.match(
        /\b(i run|we run|i own|we own|we have|i have|it is|it's|its|im|i'm|we're|we are)\s+(a|an)\s+([^.,;!?]+)/i
    );
    if (m) {
        const phrase = cleanPhrase(m[3]);
        if (phrase && phrase.length >= 3) return { businessType: phrase, offering: extractOffering(raw) };
    }

    m = raw.match(/\b([a-zA-Z ]{3,40})\s+(website|site|landing page|online store|ecommerce)\b/i);
    if (m) {
        const phrase = cleanPhrase(m[1]);
        if (phrase && phrase.length >= 3) return { businessType: phrase, offering: extractOffering(raw) };
    }

    return { businessType: "", offering: extractOffering(raw) };
}

function parseGoals(raw) {
    const t = (raw || "").toLowerCase();

    if (/(all of it|all of that|all of the above|everything|the whole thing|all in)/i.test(t))
        return "leads + sales + bookings";

    const sales = /(sales|sell|orders|revenue|buy|checkout)/i.test(t);
    const leads = /(leads|calls|contact|quote|inquiries|dm|message)/i.test(t);
    const bookings = /(book|booking|appointment|reserve|reservation|schedule)/i.test(t);

    if (sales && leads && bookings) return "leads + sales + bookings";
    if (sales && leads) return "sales + leads";
    if (sales && bookings) return "sales + bookings";
    if (leads && bookings) return "leads + bookings";
    if (sales) return "sales";
    if (leads) return "leads";
    if (bookings) return "bookings";

    return "";
}

function parseSiteType(raw) {
    const t = (raw || "").toLowerCase();

    if (/(landing page|sales page|one page)/i.test(t)) return "landing_page";
    if (/(ecommerce|online store|shop|checkout)/i.test(t)) return "ecommerce";
    if (/(blog|articles|content)/i.test(t)) return "blog";
    if (/(forum|community|members|membership)/i.test(t)) return "forum";
    if (/(booking|appointments|schedule)/i.test(t)) return "booking";
    if (/(portfolio|personal site)/i.test(t)) return "portfolio";
    if (/(portal|dashboard|saas|app|custom)/i.test(t)) return "custom";
    if (/(website|site|full site|full website)/i.test(t)) return "full_website";

    return "";
}

function parseEcomMode(raw) {
    const t = (raw || "").toLowerCase();
    if (/(checkout|cart|buy online|ship|shipping|delivery|online orders|ecommerce)/i.test(t)) return "ecommerce";
    if (/(browse|no checkout|showroom|in store|visit|call us)/i.test(t)) return "showroom";
    return "";
}

function parseProductCount(raw) {
    const t = (raw || "").toLowerCase();

    const n = (raw || "").match(/\b(\d{1,6})\b/);
    if (n) {
        const val = Number(n[1]);
        if (Number.isFinite(val)) {
            if (val < 25) return "under 25";
            if (val <= 200) return "25-200";
            return "200+";
        }
    }

    if (/(few|a few|small|not many|under 25|less than 25)/i.test(t)) return "under 25";
    if (/(dozens|some|25|50|100|150|200|hundred|hundreds)/i.test(t)) return "25-200";
    if (/(200\+|1000|thousands|tons|a lot|many|over 200)/i.test(t)) return "200+";

    return "";
}

function parseYesNo(raw) {
    const t = (raw || "").toLowerCase();
    if (/\b(yes|yep|yeah|yup|sure|def|definitely|for sure)\b/i.test(t)) return "yes";
    if (/\b(no|nope|nah)\b/i.test(t)) return "no";
    return "";
}

function parseTimeline(raw) {
    const t = (raw || "").toLowerCase();
    if (/(asap|right away|now|immediately)/i.test(t)) return "asap";
    if (/(1-2 weeks|two weeks|couple weeks|2 weeks)/i.test(t)) return "1-2 weeks";
    if (/(month|4 weeks|few weeks)/i.test(t)) return "1 month";
    if (/(flexible|no rush|whenever)/i.test(t)) return "flexible";
    return "";
}

function parseBudget(raw) {
    const t = (raw || "").toLowerCase();
    const m1 = raw.match(/\$\s*(\d{2,6})/);
    if (m1) return `$${m1[1]}`;

    const m2 = raw.match(/\b(\d{3,6})\b/);
    if (m2) return `$${m2[1]}`;

    const m3 = raw.match(/\b(\d+)\s*k\b/i);
    if (m3) return `$${Number(m3[1]) * 1000}`;

    if (/(low|small budget|cheap)/i.test(t)) return "low";
    if (/(medium|mid|average)/i.test(t)) return "medium";
    if (/(high|premium|big budget)/i.test(t)) return "high";

    return "";
}

function parseEmail(raw) {
    const m = raw.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    return m ? m[0] : "";
}

function parseTopOffer(raw) {
    const t = (raw || "").toLowerCase();
    if (/(skip|no|none|not sure|later)/i.test(t)) return "__SKIP__";
    if (/\b\d{3,6}\b/.test(raw) && !/(%|\boff\b|discount|free shipping|deal|promo)/i.test(t)) return "";
    return cleanPhrase(raw);
}

function parseIdealCustomer(raw) {
    const t = (raw || "").toLowerCase();
    if (/(skip|no|none|not sure|later)/i.test(t)) return "__SKIP__";
    if (/(family|families|kids|children|parents|moms|dads)/i.test(t)) return "families with kids";
    if (/(collectors|hobbyists)/i.test(t)) return "collectors/hobbyists";
    if (/(teachers|schools|education)/i.test(t)) return "teachers/schools";
    return cleanPhrase(raw);
}

// ---------------- APPLY ANSWER ----------------
function applyAnswerToLastQuestion(session, raw) {
    const q = session.lastQuestion;
    if (!q) return false;

    if (q === "ask_business") {
        const info = extractBusinessInfo(raw);
        const biz = cleanPhrase(info.businessType || "");
        if (biz) {
            session.businessType = session.businessType || biz;
            if (info.offering && !session.offering) session.offering = info.offering;
            session.locks.businessType = true;
            session.lastQuestion = "";
            return true;
        }
        return false;
    }

    if (q === "ask_goal") {
        const g = parseGoals(raw);
        if (g) {
            session.goals = session.goals || g;
            session.locks.goals = true;
            session.lastQuestion = "";
            return true;
        }
        return false;
    }

    if (q === "ask_site_type") {
        const st = parseSiteType(raw);
        if (st) {
            session.siteType = session.siteType || st;
            session.locks.siteType = true;
            session.lastQuestion = "";
            return true;
        }
        return false;
    }

    if (q === "ask_ecom_mode") {
        const m = parseEcomMode(raw);
        if (m) {
            session.ecommerceMode = session.ecommerceMode || m;
            session.locks.ecommerceMode = true;
            session.lastQuestion = "";
            return true;
        }
        return false;
    }

    if (q === "ask_product_count") {
        const pc = parseProductCount(raw);
        if (pc) {
            session.productCount = session.productCount || pc;
            session.locks.productCount = true;
            session.lastQuestion = "";
            return true;
        }
        return false;
    }

    if (q === "ask_premium_chatbot") {
        const yn = parseYesNo(raw);
        if (yn) {
            session.premiumChatbot = session.premiumChatbot || yn;
            session.locks.premiumChatbot = true;
            session.lastQuestion = "";
            return true;
        }
        return false;
    }

    if (q === "ask_personalization") {
        const yn = parseYesNo(raw);
        if (yn) {
            session.personalization = session.personalization || yn;
            session.locks.personalization = true;
            session.lastQuestion = "";
            return true;
        }
        return false;
    }

    if (q === "ask_timeline") {
        const tl = parseTimeline(raw);
        if (tl) {
            session.timeline = session.timeline || tl;
            session.locks.timeline = true;
            session.lastQuestion = "";
            return true;
        }
        if (/(skip|later|not sure)/i.test(raw)) {
            session.locks.timeline = true;
            session.lastQuestion = "";
            return true;
        }
        return false;
    }

    if (q === "ask_budget") {
        const b = parseBudget(raw);
        if (b) {
            session.budget = session.budget || b;
            session.locks.budget = true;
            session.lastQuestion = "";
            return true;
        }
        if (/(skip|later|not sure)/i.test(raw)) {
            session.locks.budget = true;
            session.lastQuestion = "";
            return true;
        }
        return false;
    }

    if (q === "ask_email") {
        const email = parseEmail(raw);
        if (email) {
            session.email = session.email || email;
            session.emailConfirmed = false;
            session.locks.email = true;
            session.lastQuestion = "confirm_email";
            return true;
        }
        if (/(skip|later|not now|no thanks|dont want|don't want|move on)/i.test(raw)) {
            session.locks.email = true;
            session.emailConfirmed = false;
            session.lastQuestion = "";
            return true;
        }
        return false;
    }

    if (q === "confirm_email") {
        const t = (raw || "").toLowerCase();
        if (/\b(yes|yep|yeah|correct|right|thats right|that's right)\b/i.test(t)) {
            session.emailConfirmed = true;
            session.lastQuestion = "";
            return true;
        }
        if (/\b(no|nope|nah|wrong)\b/i.test(t)) {
            session.email = "";
            session.emailConfirmed = false;
            session.locks.email = false;
            session.lastQuestion = "ask_email";
            return true;
        }
        const email2 = parseEmail(raw);
        if (email2) {
            session.email = email2;
            session.emailConfirmed = false;
            session.locks.email = true;
            session.lastQuestion = "confirm_email";
            return true;
        }
        return false;
    }

    if (q === "ask_offer") {
        const offer = parseTopOffer(raw);
        if (offer === "__SKIP__") {
            session.locks.topOffer = true;
            session.lastQuestion = "";
            return true;
        }
        if (offer) {
            session.topOffer = session.topOffer || offer;
            session.locks.topOffer = true;
            session.lastQuestion = "";
            return true;
        }
        return false;
    }

    if (q === "ask_customer") {
        const cust = parseIdealCustomer(raw);
        if (cust === "__SKIP__") {
            session.locks.idealCustomer = true;
            session.lastQuestion = "";
            return true;
        }
        if (cust) {
            session.idealCustomer = session.idealCustomer || cust;
            session.locks.idealCustomer = true;
            session.lastQuestion = "";
            return true;
        }
        return false;
    }

    return false;
}

// ---------------- PASSIVE LEARNING ----------------
function learnFromUser(session, raw, userRole) {
    session.lastTouchedAt = Date.now();

    // apply answer first
    applyAnswerToLastQuestion(session, raw);

    // ✅ KEY FIX: if we're currently asking a specific question, do NOT passive-learn other fields.
    // Otherwise the flow “jumps around” and feels like it’s going backwards.
    const blocking = !!session.lastQuestion;
    if (blocking) {
        saveLeadProgress(session, userRole);
        return;
    }

    // business/offering
    if (!session.locks.businessType && !session.businessType) {
        const info = extractBusinessInfo(raw);
        if (info.businessType) {
            session.businessType = info.businessType;
            session.locks.businessType = true;
        }
        if (info.offering && !session.offering) session.offering = info.offering;
    }

    // goals
    if (!session.locks.goals && !session.goals) {
        const g = parseGoals(raw);
        if (g) {
            session.goals = g;
            session.locks.goals = true;
        }
    }

    // site type
    if (!session.locks.siteType && !session.siteType) {
        const st = parseSiteType(raw);
        if (st) {
            session.siteType = st;
            session.locks.siteType = true;
        }
    }

    // ecommerce mode
    if (!session.locks.ecommerceMode && !session.ecommerceMode) {
        const m = parseEcomMode(raw);
        if (m) {
            session.ecommerceMode = m;
            session.locks.ecommerceMode = true;
        }
    }

    // product count
    if (!session.locks.productCount && !session.productCount) {
        const pc = parseProductCount(raw);
        if (pc) {
            session.productCount = pc;
            session.locks.productCount = true;
        }
    }

    // premium chatbot / personalization
    if (!session.locks.premiumChatbot && !session.premiumChatbot) {
        const yn = parseYesNo(raw);
        if (/(chatbot|bot|ai assistant)/i.test(raw) && yn) {
            session.premiumChatbot = yn;
            session.locks.premiumChatbot = true;
        }
    }

    if (!session.locks.personalization && !session.personalization) {
        const yn = parseYesNo(raw);
        if (/(personalization|recommendations|tailored|smart offers)/i.test(raw) && yn) {
            session.personalization = yn;
            session.locks.personalization = true;
        }
    }

    // email
    if (!session.locks.email && !session.email) {
        const email = parseEmail(raw);
        if (email) {
            session.email = email;
            session.emailConfirmed = false;
            session.locks.email = true;
            session.lastQuestion = "confirm_email";
        }
    }

    // offer/customer/budget
    if (!session.locks.topOffer && !session.topOffer && /(% off|discount|free shipping|deal|promo)/i.test(raw)) {
        const offer = parseTopOffer(raw);
        if (offer && offer !== "__SKIP__") {
            session.topOffer = offer;
            session.locks.topOffer = true;
        }
    }

    if (!session.locks.idealCustomer && !session.idealCustomer && /(families|kids|parents|collectors|teachers)/i.test(raw)) {
        const cust = parseIdealCustomer(raw);
        if (cust && cust !== "__SKIP__") {
            session.idealCustomer = cust;
            session.locks.idealCustomer = true;
        }
    }

    if (!session.locks.budget && !session.budget) {
        const b = parseBudget(raw);
        if (b) {
            session.budget = b;
            session.locks.budget = true;
        }
    }

    saveLeadProgress(session, userRole);
}

// ---------------- COPY ----------------
function rivonCapabilities() {
    return (
        "Rivon builds modern websites end-to-end — landing pages, full sites, ecommerce, blogs, forums/memberships, booking systems, and custom portals. " +
        "Our premium feature is the AI chatbot layer that captures leads and guides visitors to take action."
    );
}

function buildSummary(session) {
    const bits = [];
    if (session.businessType) bits.push(session.businessType);
    if (session.siteType) bits.push(`site: ${session.siteType}`);
    if (session.goals) bits.push(`goal: ${session.goals}`);
    if (session.ecommerceMode) bits.push(session.ecommerceMode === "ecommerce" ? "online checkout" : "showroom");
    if (session.productCount) bits.push(`products: ${session.productCount}`);
    if (session.premiumChatbot) bits.push(`chatbot: ${session.premiumChatbot}`);
    if (session.personalization) bits.push(`personalization: ${session.personalization}`);
    if (session.timeline) bits.push(`timeline: ${session.timeline}`);
    if (session.budget) bits.push(`budget: ${session.budget}`);
    return bits.join(", ");
}

// ---------------- DRAFTS ----------------
function draftLandingPage(session) {
    const biz = session.businessType || "your business";
    const customer = session.idealCustomer || "your ideal customer";
    const offer = session.topOffer || "a strong first-time offer (ex: 10% off or free shipping over $50)";
    const isEcom = session.siteType === "ecommerce" || session.ecommerceMode === "ecommerce";
    const products = session.productCount ? `(${session.productCount})` : "";

    const heroHeadline = `A better ${biz} website — built to convert.`;
    const heroSub = isEcom
        ? `Shop fast, find the right products, and checkout smoothly — built for ${customer}.`
        : `A modern site that turns visitors into customers — built for ${customer}.`;

    const ctas = isEcom
        ? ["Shop Best Sellers", "Browse Categories", "Chat for Recommendations"]
        : ["Get a Quote", "Contact Us", "Chat for Help"];

    const sections = [
        "Hero (headline, subheadline, primary CTA)",
        isEcom ? "Featured Categories / Collections" : "What You Do + Key Services",
        isEcom ? "Best Sellers / Featured Products" : "Proof / Results / Case studies",
        `Offer strip: ${offer}`,
        "Why Choose You (trust, guarantees, FAQs)",
        "Social Proof (reviews, photos, logos)",
        "FAQ (shipping/returns or service questions)",
        "Final CTA + Contact",
    ];

    return {
        message:
            `✅ Draft: Landing Page Outline for ${biz} ${products}\n\n` +
            `**Hero**\n- Headline: ${heroHeadline}\n- Sub: ${heroSub}\n- CTAs: ${ctas.join(" / ")}\n\n` +
            `**Sections**\n- ${sections.join("\n- ")}\n\n` +
            `Want this written in a **clean/minimal** style or **playful/bright** style?`,
        ui: withGlobalChoices([
            { label: "Clean / minimal", value: "clean minimal" },
            { label: "Playful / bright", value: "playful bright" },
            { label: "Refine the offer", value: "refine offer" },
        ]),
    };
}

function draftWebsitePlan(session) {
    const biz = session.businessType || "your business";
    const siteType = session.siteType || "full_website";
    const isEcom = siteType === "ecommerce";

    const pages = isEcom
        ? ["Home", "Shop (collections)", "Product page", "Cart/Checkout", "About", "Contact", "FAQ", "Policies"]
        : ["Home", "Services", "About", "Blog", "Contact", "FAQ"];

    const premium =
        session.premiumChatbot === "yes"
            ? "✅ Premium Chatbot: lead capture + smart routing + FAQs + recommendations"
            : "Chatbot: optional upgrade (premium feature)";

    return {
        message:
            `✅ Draft: Website Plan for ${biz}\n\n` +
            `**Site type:** ${siteType}\n` +
            `**Core pages:**\n- ${pages.join("\n- ")}\n\n` +
            `**Premium feature:** ${premium}\n\n` +
            `Want me to draft the **chatbot flow**, the **home page copy**, or the **full sitemap** next?`,
        ui: withGlobalChoices([
            { label: "Chatbot flow", value: "draft chatbot flow" },
            { label: "Home page copy", value: "draft home page copy" },
            { label: "Full sitemap", value: "draft sitemap" },
        ]),
    };
}

function draftChatbotFlow(session) {
    const biz = session.businessType || "your business";
    const isEcom = session.siteType === "ecommerce" || session.ecommerceMode === "ecommerce";

    const flow = isEcom
        ? [
            "1) Greet: what are you shopping for?",
            "2) Quick buttons: age / budget / category",
            "3) Show 3 recommendations + ‘see more’",
            "4) Handle objections: shipping/returns/support",
            "5) Capture: email for deals/restocks + optional phone for live help",
        ]
        : [
            "1) Greet + ask what they need",
            "2) Qualify: timeline + budget + what success looks like",
            "3) Recommend: the right site package + next steps",
            "4) Capture: name + email/phone",
        ];

    return {
        message:
            `✅ Premium Chatbot Flow Draft for ${biz}\n\n` +
            `**Flow**\n- ${flow.join("\n- ")}\n\n` +
            `Do you want the chatbot tone to be **salesy** or **helpful/low-pressure**?`,
        ui: withGlobalChoices([
            { label: "Salesy", value: "salesy" },
            { label: "Helpful / low-pressure", value: "helpful low pressure" },
            { label: "Add live handoff", value: "talk to a person" },
        ]),
    };
}

// ---------------- LIVE LEAD NOTIFY RULES ----------------
async function maybeNotifyLead(session, visitorId) {
    if (session.leadNotified) return;

    const highIntent =
        session.mode === "drafting" ||
        (session.goals && session.siteType) ||
        (session.email && session.emailConfirmed);

    if (highIntent && session.email && session.emailConfirmed) {
        session.leadNotified = true;

        await notifyLiveLead({
            visitorId,
            leadId: session.leadId,
            businessType: session.businessType,
            offering: session.offering,
            goals: session.goals,
            siteType: session.siteType,
            ecommerceMode: session.ecommerceMode,
            productCount: session.productCount,
            premiumChatbot: session.premiumChatbot,
            personalization: session.personalization,
            timeline: session.timeline,
            budget: session.budget,
            email: session.email,
            topOffer: session.topOffer,
            idealCustomer: session.idealCustomer,
        });
    }
}

// ---------------- PLANNING FLOW ----------------
function nextQuestion(session) {
    if (session.lastQuestion === "confirm_email") {
        return {
            message: `Just to confirm — should I use **${session.email}**?`,
            ui: withGlobalChoices([
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
            ]),
        };
    }

    if (!session.businessType) {
        session.lastQuestion = "ask_business";
        return {
            message: "What kind of business is this website for?",
            ui: withGlobalChoices([
                { label: "Toy store", value: "toy store" },
                { label: "Pet store", value: "pet store" },
                { label: "Restaurant", value: "restaurant" },
                { label: "Service business", value: "service business" },
                { label: "Other", value: "my business is" },
            ]),
        };
    }

    if (!session.goals) {
        session.lastQuestion = "ask_goal";
        return {
            message: `Got it — ${session.businessType}. What’s the main goal?`,
            ui: withGlobalChoices([
                { label: "Sales", value: "sales" },
                { label: "Leads", value: "leads" },
                { label: "Bookings", value: "bookings" },
                { label: "All of it", value: "all of the above" },
            ]),
        };
    }

    if (!session.siteType) {
        session.lastQuestion = "ask_site_type";
        return {
            message: "What are you trying to build?",
            ui: withGlobalChoices([
                { label: "Full website", value: "full website" },
                { label: "Ecommerce store", value: "ecommerce" },
                { label: "Landing page", value: "landing page" },
                { label: "Blog/content site", value: "blog" },
                { label: "Forum/membership", value: "forum" },
                { label: "Booking site", value: "booking" },
                { label: "Custom portal/app", value: "custom portal" },
            ]),
        };
    }

    const isEcom = session.siteType === "ecommerce";
    if (isEcom && !session.ecommerceMode) {
        session.lastQuestion = "ask_ecom_mode";
        return {
            message: "Do you want online checkout, or just a showroom (no checkout)?",
            ui: withGlobalChoices([
                { label: "Online checkout", value: "online checkout" },
                { label: "Showroom only", value: "showroom" },
            ]),
        };
    }

    if (isEcom && session.ecommerceMode === "ecommerce" && !session.productCount) {
        session.lastQuestion = "ask_product_count";
        return {
            message: "Roughly how many products?",
            ui: withGlobalChoices([
                { label: "Under 25", value: "under 25" },
                { label: "25–200", value: "100" },
                { label: "200+", value: "200+" },
            ]),
        };
    }

    if (!session.premiumChatbot) {
        session.lastQuestion = "ask_premium_chatbot";
        return {
            message: "Our premium add-on is the AI chatbot (lead capture + FAQs + smart routing). Do you want that included?",
            ui: withGlobalChoices([
                { label: "Yes (premium)", value: "yes" },
                { label: "Not right now", value: "no" },
            ]),
        };
    }

    const shouldAskPersonalization =
        !session.personalization && (session.premiumChatbot === "yes" || /sales/i.test(session.goals));
    if (shouldAskPersonalization) {
        session.lastQuestion = "ask_personalization";
        return {
            message: "Do you want personalization (recommendations, smart offers, tailored messaging)?",
            ui: withGlobalChoices([
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
            ]),
        };
    }

    if (!session.timeline) {
        session.lastQuestion = "ask_timeline";
        return {
            message: "Timeline-wise, what are you aiming for?",
            ui: withGlobalChoices([
                { label: "ASAP", value: "asap" },
                { label: "1–2 weeks", value: "1-2 weeks" },
                { label: "About a month", value: "1 month" },
                { label: "Flexible", value: "flexible" },
                { label: "Skip", value: "skip" },
            ]),
        };
    }

    if (!session.budget) {
        session.lastQuestion = "ask_budget";
        return {
            message: "Budget range? (optional — helps me recommend the best build path)",
            ui: withGlobalChoices([
                { label: "Low", value: "low" },
                { label: "Medium", value: "medium" },
                { label: "High", value: "high" },
                { label: "Skip", value: "skip" },
            ]),
        };
    }

    if (!session.email) {
        session.lastQuestion = "ask_email";
        return {
            message: "Want to leave an email so we can send you this plan and options? (or skip)",
            ui: withGlobalChoices([
                { label: "I’ll type it", value: "my email is" },
                { label: "Skip", value: "skip" },
            ]),
        };
    }

    if (session.email && !session.emailConfirmed) {
        session.lastQuestion = "confirm_email";
        return {
            message: `Just to confirm — should I use **${session.email}**?`,
            ui: withGlobalChoices([
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
            ]),
        };
    }

    if (!session.topOffer && !session.locks.topOffer) {
        session.lastQuestion = "ask_offer";
        return {
            message:
                "What’s your best offer or hook? (ex: ‘10% off’, ‘free shipping over $50’, ‘free consult’). If you don’t have one yet, say ‘skip’.",
            ui: withGlobalChoices([
                { label: "10% off", value: "10% off" },
                { label: "Free shipping", value: "free shipping over $50" },
                { label: "Free consult", value: "free consult" },
                { label: "Skip", value: "skip" },
            ]),
        };
    }

    if (!session.idealCustomer && !session.locks.idealCustomer) {
        session.lastQuestion = "ask_customer";
        return {
            message: "Who is your ideal customer? (ex: families, local homeowners, collectors, etc.)",
            ui: withGlobalChoices([
                { label: "Families", value: "families with kids" },
                { label: "Collectors", value: "collectors/hobbyists" },
                { label: "Businesses", value: "business customers" },
                { label: "Skip", value: "skip" },
            ]),
        };
    }

    session.mode = "drafting";
    session.lastQuestion = "";
    return {
        message: `✅ Perfect — I’ve got what I need.\n\n**Summary:** ${buildSummary(session)}\n\nWhat do you want me to draft first?`,
        ui: withGlobalChoices([
            { label: "Website plan", value: "draft website plan" },
            { label: "Landing page", value: "draft landing page" },
            { label: "Premium chatbot flow", value: "draft chatbot flow" },
            { label: "Full sitemap", value: "draft sitemap" },
        ]),
    };
}

// ---------------- WELCOME BACK / RESET ----------------
function hasAnyProgress(session) {
    return (
        !!session.businessType ||
        !!session.goals ||
        !!session.siteType ||
        !!session.ecommerceMode ||
        !!session.productCount ||
        !!session.premiumChatbot ||
        !!session.personalization ||
        !!session.timeline ||
        !!session.budget ||
        !!session.email ||
        !!session.topOffer ||
        !!session.idealCustomer
    );
}

function welcomeBack(session) {
    const summary = buildSummary(session) || "your project";
    return {
        message: `👋 Welcome back — want to pick up where we left off with **${summary}**?`,
        ui: buildUI([
            { label: "Continue", value: "__CONTINUE__" },
            { label: "Start over", value: "__RESET__" },
            { label: "Talk to someone", value: "talk to a person" },
        ]),
    };
}

// ---------------- GENERAL RESPONSE HELPERS ----------------
function handleTalkToHuman(session, visitorId) {
    ensureLeadId(session);
    saveLeadProgress(session);

    return {
        message:
            "✅ Got it — I can connect you to a person. What’s the best **phone number** to call/text you right now? (or say **email only**)",
        ui: withGlobalChoices([
            { label: "Email only", value: "email only" },
            { label: "I’ll type my number", value: "my number is" },
        ]),
    };
}

function wittyPivot(raw) {
    const tokens = tokenize(raw);
    const focus = tokens.find((w) => w.length >= 4) || "that";
    const openers = [
        `Fair question about ${focus}. ${rivonCapabilities()}`,
        `I can help with ${focus} — ${rivonCapabilities()}`,
        `Yep. ${rivonCapabilities()}`,
    ];
    return {
        message: pickRandom(openers),
        ui: withGlobalChoices([
            { label: "Build a website", value: "i need a website" },
            { label: "Pricing", value: "pricing" },
            { label: "Premium chatbot", value: "chatbot" },
        ]),
    };
}

// ---------------- DRAFT EXTRA: SITEMAP ----------------
function draftSitemap(session) {
    const biz = session.businessType || "your business";
    const type = session.siteType || "full_website";
    const isEcom = type === "ecommerce";
    const isForum = type === "forum";

    const pages = [];
    pages.push("Home");
    pages.push("About");
    pages.push("Contact");

    if (isEcom) {
        pages.push("Shop (Collections)");
        pages.push("Product Page");
        pages.push("Cart");
        pages.push("Checkout");
        pages.push("FAQ");
        pages.push("Shipping & Returns");
        pages.push("Privacy/Terms");
    } else {
        pages.push("Services / What We Do");
        pages.push("Portfolio / Examples");
        pages.push("FAQ");
        pages.push("Blog");
    }

    if (isForum) {
        pages.push("Community Home");
        pages.push("Topics");
        pages.push("Member Profile");
        pages.push("Rules");
    }

    return {
        message: `✅ Draft: Sitemap for ${biz}\n\n- ${pages.join("\n- ")}`,
        ui: withGlobalChoices([
            { label: "Website plan", value: "draft website plan" },
            { label: "Landing page", value: "draft landing page" },
            { label: "Chatbot flow", value: "draft chatbot flow" },
        ]),
    };
}

// ---------------- MAIN ----------------
export async function handleMessage(message, userRole = "guest", visitorId = "anon") {
    const raw = (message || "").trim();
    const text = raw.toLowerCase();

    // ✅ Reset tokens (button OR typed)
    if (wantsReset(raw)) {
        const fresh = makeDefaultSession();
        updateSession(visitorId, fresh);
        return {
            message: "✅ Started fresh. What kind of business is this website for?",
            ui: withGlobalChoices([
                { label: "Toy store", value: "toy store" },
                { label: "Pet store", value: "pet store" },
                { label: "Restaurant", value: "restaurant" },
                { label: "Service business", value: "service business" },
                { label: "Other", value: "my business is" },
            ]),
        };
    }

    // get session
    const { session } = getSession(visitorId, makeDefaultSession);

    // “Welcome back” logic
    const isHello = /^(hi|hello|hey|howdy)$/i.test(raw);
    const looksLikeFirstTouch = isHello || raw.length === 0;

    if (
        looksLikeFirstTouch &&
        hasAnyProgress(session) &&
        session.lastTouchedAt &&
        Date.now() - session.lastTouchedAt > 10_000
    ) {
        session.lastTouchedAt = Date.now();
        updateSession(visitorId, session);
        return welcomeBack(session);
    }

    // Continue button
    if (raw === "__CONTINUE__") {
        session.mode = "site_planning";
        session.lastTouchedAt = Date.now();
        updateSession(visitorId, session);
        return nextQuestion(session);
    }

    // crisis
    const crisisKeywords = ["suicide", "kill myself", "want to die", "end it", "ending it"];
    if (crisisKeywords.some((k) => text.includes(k))) {
        return {
            message:
                "I'm really sorry that you're feeling like this. You don’t have to face it alone. In the U.S. you can call or text 988 right now.",
            ui: withGlobalChoices([{ label: "Talk to someone", value: "talk to a person" }]),
        };
    }

    // talk to human intent
    if (wantsTalkToHuman(raw)) {
        const res = handleTalkToHuman(session, visitorId);
        session.lastTouchedAt = Date.now();
        updateSession(visitorId, session);
        return res;
    }

    const pricingRes = handlePricingIntent(session, raw);
    if (pricingRes) {
        // If pricing wants to start quote lead capture, flip mode + first question
        if (pricingRes.next === "lead_quote_start") {
            ensureLeadId(session);
            session.mode = "lead_capture";
            session.lastQuestion = "ask_name";
            saveLeadProgress(session, userRole);
        }

        session.lastTouchedAt = Date.now();
        updateSession(visitorId, session);
        return pricingRes;
    }

    // learn + persist lead progress
    learnFromUser(session, raw, userRole);
    session.lastTouchedAt = Date.now();
    updateSession(visitorId, session);

    // ---------------- LEAD CAPTURE MODE ----------------
    if (session.mode === "lead_capture") {
        const leadRes = handleLeadCapture(session, raw);

        // if leadRes is null, leadFlow didn't accept input; just ask again by calling it with same session state
        if (leadRes) {
            saveLeadProgress(session, userRole);
            session.lastTouchedAt = Date.now();
            updateSession(visitorId, session);
            return leadRes;
        }

        // If no result, re-prompt based on current question
        saveLeadProgress(session, userRole);
        session.lastTouchedAt = Date.now();
        updateSession(visitorId, session);

        if (session.lastQuestion === "ask_name") {
            return {
                message: "What name should I put this quote under?",
                ui: { kind: "choices", choices: [] },
            };
        }
    }


    // exit planning
    if ((session.mode === "site_planning" || session.lastQuestion) && wantsToExitPlanning(raw)) {
        session.mode = "default";
        session.lastQuestion = "";
        updateSession(visitorId, session);
        return {
            message: "All good — switching gears. What do you want to talk about?",
            ui: withGlobalChoices([
                { label: "Build a website", value: "i need a website" },
                { label: "Pricing", value: "pricing" },
                { label: "Premium chatbot", value: "chatbot" },
            ]),
        };
    }

    // start planning if implied
    if (session.mode === "default" && wantsPlanning(raw)) {
        session.mode = "site_planning";
        ensureLeadId(session);
        saveLeadProgress(session, userRole);
        updateSession(visitorId, session);
        return nextQuestion(session);
    }

    // drafting commands
    if (/draft website plan/i.test(raw)) {
        session.mode = "drafting";
        updateSession(visitorId, session);
        return draftWebsitePlan(session);
    }
    if (/draft landing page/i.test(raw)) {
        session.mode = "drafting";
        updateSession(visitorId, session);
        return draftLandingPage(session);
    }
    if (/draft chatbot flow/i.test(raw)) {
        session.mode = "drafting";
        updateSession(visitorId, session);
        return draftChatbotFlow(session);
    }
    if (/draft sitemap/i.test(raw) || /full sitemap/i.test(raw)) {
        session.mode = "drafting";
        updateSession(visitorId, session);
        return draftSitemap(session);
    }

    // knowledge routing
    const companyHit = bestMatch(companyKnowledge, raw);
    if (isCompanyQuestion(raw) && companyHit.best && companyHit.bestScore >= 6) {
        const conn = companyHit.best.connected_responses || [];
        const next1 = conn.length ? pickRandom(conn).text : "What kind of website do you want to build?";
        const next2 = conn.length > 1 ? pickRandom(conn).text : "Do you want the premium AI chatbot included?";
        return {
            message: companyHit.best.response,
            ui: withGlobalChoices([
                { label: "Build a website", value: "i need a website" },
                { label: "Premium chatbot", value: "yes, include the chatbot" },
                { label: "Talk to someone", value: "talk to a person" },
            ]),
            followUp: next1,
            reflection: next2,
        };
    }

    const generalHit = bestMatch(generalKnowledge, raw);
    if (generalHit.best && generalHit.bestScore >= 9) {
        return {
            message: generalHit.best.response,
            ui: withGlobalChoices(
                session.mode === "site_planning" || session.lastQuestion
                    ? [{ label: "Continue planning", value: "__CONTINUE__" }]
                    : [{ label: "Build a website", value: "i need a website" }]
            ),
        };
    }

    // if in planning, keep pushing forward
    if (session.mode === "site_planning" || session.lastQuestion) {
        const q = nextQuestion(session);
        updateSession(visitorId, session);
        await maybeNotifyLead(session, visitorId);
        updateSession(visitorId, session);
        return q;
    }

    // default pivot
    return wittyPivot(raw);
}
