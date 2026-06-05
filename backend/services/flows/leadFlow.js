// backend/services/flows/leadFlow.js

function buildChoices(choices = []) {
    return {
        kind: "choices",
        choices: choices.map((c, idx) => ({
            id: c.id || `c_${idx}_${Date.now()}`,
            label: c.label,
            value: c.value,
        })),
    };
}

function withLeadButtons(extra = []) {
    const base = [
        { label: "Skip", value: "lead_skip" },
        { label: "Talk to someone", value: "talk to a person" },
        { label: "Start over", value: "__RESET__" },
    ];

    const seen = new Set();
    const merged = [...extra, ...base].filter((c) => {
        const key = String(c.label || "").toLowerCase();
        if (!key) return false;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    return buildChoices(merged);
}

function clean(s) {
    return String(s || "").trim();
}

function parseEmail(raw = "") {
    const m = raw.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    return m ? m[0] : "";
}

function parsePhone(raw = "") {
    // US-friendly loose parse
    const m = raw.match(/(\+?1\s*)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
    return m ? m[0].trim() : "";
}

function looksLikeSkip(raw = "") {
    return /(skip|later|not now|no thanks|dont want|don't want)/i.test(raw);
}

// Main public handler
export function handleLeadCapture(session, raw = "") {
    const t = clean(raw);

    // allow button skip
    if (t === "lead_skip") return { skipped: true };

    // if user typed skip words
    if (looksLikeSkip(t)) return { skipped: true };

    const q = session.lastQuestion;

    // ---- name ----
    if (q === "ask_name") {
        // avoid emails being mistaken as a name
        if (parseEmail(t)) return null;

        const name = clean(t.replace(/^my name is\s+/i, ""));
        if (name.length >= 2) {
            session.leadName = session.leadName || name;
            session.lastQuestion = "ask_email";
            return {
                message: `Nice — ${session.leadName}. What’s the best email to send your quote + plan?`,
                ui: withLeadButtons([{ label: "I’ll type it", value: "my email is" }]),
            };
        }
        return {
            message: "What name should I put this quote under?",
            ui: withLeadButtons(),
        };
    }

    // ---- email ----
    if (q === "ask_email") {
        const email = parseEmail(t);
        if (email) {
            session.email = session.email || email;
            session.emailConfirmed = false;
            session.lastQuestion = "confirm_email";
            return {
                message: `Just to confirm — should I use **${session.email}**?`,
                ui: withLeadButtons([
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                ]),
            };
        }

        if (looksLikeSkip(t)) {
            session.lastQuestion = "ask_project";
            return {
                message: "No problem. What are you looking to build? (landing page / full site / ecommerce / chatbot)",
                ui: withLeadButtons([
                    { label: "Landing page", value: "landing page" },
                    { label: "Full website", value: "full website" },
                    { label: "Ecommerce", value: "ecommerce" },
                    { label: "Chatbot", value: "chatbot" },
                ]),
            };
        }

        return {
            message: "What’s the best email to send the quote to?",
            ui: withLeadButtons([{ label: "Skip", value: "lead_skip" }]),
        };
    }

    // ---- confirm email ----
    if (q === "confirm_email") {
        const low = t.toLowerCase();
        if (/(yes|yep|yeah|correct|right|ok)/i.test(low)) {
            session.emailConfirmed = true;
            session.lastQuestion = "ask_project";
            return {
                message: "Perfect. What are you looking to build?",
                ui: withLeadButtons([
                    { label: "Landing page", value: "landing page" },
                    { label: "Full website", value: "full website" },
                    { label: "Ecommerce", value: "ecommerce" },
                    { label: "Chatbot", value: "chatbot" },
                ]),
            };
        }
        if (/(no|nope|nah|wrong)/i.test(low)) {
            session.email = "";
            session.emailConfirmed = false;
            session.lastQuestion = "ask_email";
            return {
                message: "Got it — what’s the correct email?",
                ui: withLeadButtons(),
            };
        }

        // user may paste a new email
        const email2 = parseEmail(t);
        if (email2) {
            session.email = email2;
            session.emailConfirmed = false;
            session.lastQuestion = "confirm_email";
            return {
                message: `Just to confirm — should I use **${session.email}**?`,
                ui: withLeadButtons([
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                ]),
            };
        }

        return {
            message: `Just to confirm — should I use **${session.email}**?`,
            ui: withLeadButtons([
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
            ]),
        };
    }

    // ---- project ----
    if (q === "ask_project") {
        const project = clean(t.replace(/^i want\s+/i, ""));
        if (project.length >= 2) {
            session.requestSummary = session.requestSummary || project;
            session.lastQuestion = "ask_timeline";
            return {
                message: "Got it. What’s your timeline?",
                ui: withLeadButtons([
                    { label: "ASAP", value: "asap" },
                    { label: "1–2 weeks", value: "1-2 weeks" },
                    { label: "About a month", value: "1 month" },
                    { label: "Flexible", value: "flexible" },
                ]),
            };
        }
        return {
            message: "What are you looking to build? (landing page / full site / ecommerce / chatbot)",
            ui: withLeadButtons([
                { label: "Landing page", value: "landing page" },
                { label: "Full website", value: "full website" },
                { label: "Ecommerce", value: "ecommerce" },
                { label: "Chatbot", value: "chatbot" },
            ]),
        };
    }

    // ---- timeline ----
    if (q === "ask_timeline") {
        const low = t.toLowerCase();
        const tl =
            /(asap|right away|now)/i.test(low)
                ? "asap"
                : /(1-2 weeks|two weeks|couple weeks|2 weeks)/i.test(low)
                    ? "1-2 weeks"
                    : /(month|4 weeks|few weeks)/i.test(low)
                        ? "1 month"
                        : /(flexible|no rush|whenever)/i.test(low)
                            ? "flexible"
                            : "";

        if (tl) {
            session.timeline = session.timeline || tl;
            session.lastQuestion = "ask_phone";
            return {
                message:
                    "Optional — want to leave a phone number for text/call updates? (or skip)",
                ui: withLeadButtons([
                    { label: "Skip", value: "lead_skip" },
                    { label: "I’ll type it", value: "my number is" },
                ]),
            };
        }

        return {
            message: "Timeline-wise, what are you aiming for?",
            ui: withLeadButtons([
                { label: "ASAP", value: "asap" },
                { label: "1–2 weeks", value: "1-2 weeks" },
                { label: "About a month", value: "1 month" },
                { label: "Flexible", value: "flexible" },
            ]),
        };
    }

    // ---- phone ----
    if (q === "ask_phone") {
        if (looksLikeSkip(t)) {
            session.lastQuestion = "";
            session.mode = "default";
            return {
                message:
                    "✅ Perfect — I’ve got what I need. If you want, tell me your business type and I’ll recommend the best tier + next steps.",
                ui: withLeadButtons([
                    { label: "Pricing", value: "pricing" },
                    { label: "Build a website", value: "i need a website" },
                ]),
            };
        }

        const phone = parsePhone(t);
        if (phone) {
            session.phone = session.phone || phone;
            session.lastQuestion = "";
            session.mode = "default";
            return {
                message:
                    "✅ Got it. I’ll send your quote/plan soon. Want to answer 2 quick questions so I can tighten the estimate?",
                ui: withLeadButtons([
                    { label: "Yes", value: "yes tighten estimate" },
                    { label: "No", value: "no" },
                ]),
            };
        }

        return {
            message: "What’s the best phone number? (or type “skip”)",
            ui: withLeadButtons([{ label: "Skip", value: "lead_skip" }]),
        };
    }

    return null;
}
