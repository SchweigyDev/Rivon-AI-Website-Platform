// backend/services/flows/pricingFlow.js

// Tiny UI helper (local to this flow so you don't need to import buildUI)
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

function withPricingButtons(extra = []) {
    // Always include your tier buttons + key actions
    const base = [
        { label: "Basic", value: "pricing_basic" },
        { label: "Standard", value: "pricing_standard" },
        { label: "Premium", value: "pricing_premium" },
        { label: "Get exact quote", value: "pricing_quote" },
    ];

    // De-dupe by label
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

// Optional: interpret very broad “pricing” questions
function looksLikePricingQuestion(raw = "") {
    const t = raw.toLowerCase();
    return /(price|pricing|cost|how much|packages|plans|tiers|rate|quote)/i.test(t);
}

// Optional: detect ecommerce / landing page intent for recommendation
function detectBuildTypeHint(session, raw = "") {
    const t = raw.toLowerCase();
    const hintFromText =
        /(ecommerce|online store|shop|checkout|cart)/i.test(t)
            ? "ecommerce"
            : /(landing page|one page|sales page)/i.test(t)
                ? "landing_page"
                : /(full website|website|site)/i.test(t)
                    ? "full_website"
                    : "";

    return hintFromText || session?.siteType || "";
}

function moneyRangeText() {
    // You can change these later — keep wording non-committal but helpful
    return (
        "Pricing depends on scope (pages, features, ecommerce vs. service site, copywriting, integrations).\n" +
        "If you want, I can give an exact quote after 4 quick questions."
    );
}

// ---- Tier copy ----
function tierSummary() {
    return (
        "Rivon offers three tiers:\n\n" +
        "**Basic** — clean, modern web presence (great for simple sites & landing pages)\n" +
        "**Standard** — automation + stronger conversion setup (most businesses choose this)\n" +
        "**Premium** — full custom build + advanced AI chatbot layer + deeper integrations\n"
    );
}

function basicDetails() {
    return (
        "**Basic (best for: landing page or simple business site)**\n" +
        "- Clean modern design (mobile-first)\n" +
        "- Core pages (Home + About/Services + Contact)\n" +
        "- Basic SEO setup (titles, metadata)\n" +
        "- Contact form (lead capture to your email)\n" +
        "- Fast performance + security best practices\n\n" +
        "If you just need something clean that converts, Basic is the move."
    );
}

function standardDetails() {
    return (
        "**Standard (best for: growing businesses who want more leads)**\n" +
        "- Everything in Basic\n" +
        "- Stronger conversion structure (CTA sections, trust blocks, FAQs)\n" +
        "- Lead capture tuned for your goal (calls, forms, bookings)\n" +
        "- Simple automations (lead notifications, follow-up prompts)\n" +
        "- Optional blog/content structure\n\n" +
        "Standard is the sweet spot when you want the site to *work*, not just exist."
    );
}

function premiumDetails() {
    return (
        "**Premium (best for: ecommerce or custom systems)**\n" +
        "- Everything in Standard\n" +
        "- Premium AI chatbot layer (lead capture + FAQs + smart routing)\n" +
        "- Advanced personalization (recommendations, smart offers)\n" +
        "- Integrations (payments, booking, CRM, email tools, analytics)\n" +
        "- Custom pages/flows (portals, memberships, dashboards)\n\n" +
        "If you want the “whole system” — Premium."
    );
}

// ---- Recommendation ----
function recommendTier(session, raw = "") {
    const hint = detectBuildTypeHint(session, raw);

    if (hint === "ecommerce") {
        return (
            "If you’re doing **ecommerce**, I usually recommend **Premium** (or Standard if it’s a small catalog) " +
            "because checkout + product flows + integrations matter."
        );
    }

    if (hint === "landing_page") {
        return (
            "For a **landing page**, **Basic** is often perfect — unless you want automation + stronger lead handling (then Standard)."
        );
    }

    if (hint === "full_website") {
        return (
            "For a **full business website**, **Standard** is usually the best value — it’s built for lead capture and conversion."
        );
    }

    return (
        "If you tell me what you’re building (landing page, full site, ecommerce), I’ll recommend the best tier in 10 seconds."
    );
}

// ---- Public handler ----
// Call this from localLogic.js when user types "pricing" OR clicks a pricing button.
export function handlePricingIntent(session, raw = "") {
    // If user clicked a tier button, handle it
    const t = (raw || "").toLowerCase().trim();

    if (t === "pricing_basic") {
        return {
            message: basicDetails() + "\n\nWant pricing guidance for *your* situation? Click **Get exact quote**.",
            ui: withPricingButtons([
                { label: "What's included?", value: "pricing_compare" },
                { label: "Which should I pick?", value: "pricing_recommend" },
            ]),
        };
    }

    if (t === "pricing_standard") {
        return {
            message: standardDetails() + "\n\nIf you want, I’ll recommend the best tier for what you’re building.",
            ui: withPricingButtons([
                { label: "Compare tiers", value: "pricing_compare" },
                { label: "Which should I pick?", value: "pricing_recommend" },
            ]),
        };
    }

    if (t === "pricing_premium") {
        return {
            message: premiumDetails() + "\n\nIf you’re doing ecommerce or anything custom, Premium is usually the right fit.",
            ui: withPricingButtons([
                { label: "Compare tiers", value: "pricing_compare" },
                { label: "What about ecommerce?", value: "pricing_ecom" },
            ]),
        };
    }

    if (t === "pricing_compare") {
        return {
            message:
                "**Quick compare:**\n\n" +
                "**Basic** → clean site + essentials\n" +
                "**Standard** → conversion + automations (best value)\n" +
                "**Premium** → custom system + AI chatbot + integrations\n\n" +
                moneyRangeText(),
            ui: withPricingButtons([
                { label: "Which should I pick?", value: "pricing_recommend" },
                { label: "Get exact quote", value: "pricing_quote" },
            ]),
        };
    }

    if (t === "pricing_ecom") {
        return {
            message:
                "Yep — we do ecommerce.\n\n" +
                "Ecommerce pricing depends on:\n" +
                "- product count\n" +
                "- shipping/tax setup\n" +
                "- variants (sizes/colors)\n" +
                "- integrations (POS, email, CRM)\n\n" +
                "If you answer 4 quick questions I can point you to the right tier and give a tighter estimate.",
            ui: withPricingButtons([
                { label: "Small store (under 25 products)", value: "pricing_ecom_small" },
                { label: "Medium store (25–200)", value: "pricing_ecom_med" },
                { label: "Large store (200+)", value: "pricing_ecom_large" },
            ]),
        };
    }

    if (t === "pricing_ecom_small") {
        return {
            message:
                "For **under 25 products**, **Standard** can work if it’s simple. If you want recommendations, upsells, or heavier automation, go **Premium**.",
            ui: withPricingButtons([{ label: "Get exact quote", value: "pricing_quote" }]),
        };
    }

    if (t === "pricing_ecom_med") {
        return {
            message:
                "For **25–200 products**, I usually recommend **Premium** because catalog structure + filters + automation matter a lot.",
            ui: withPricingButtons([{ label: "Get exact quote", value: "pricing_quote" }]),
        };
    }

    if (t === "pricing_ecom_large") {
        return {
            message:
                "For **200+ products**, it’s almost always **Premium** (sometimes a staged rollout). We’ll want to talk catalog strategy + integrations.",
            ui: withPricingButtons([{ label: "Talk to someone", value: "talk to a person" }]),
        };
    }

    if (t === "pricing_recommend") {
        return {
            message:
                recommendTier(session, raw) +
                "\n\nTell me what you’re building (landing page / full site / ecommerce) and your timeline, and I’ll point you to the best tier.",
            ui: withPricingButtons([
                { label: "Landing page", value: "pricing_hint_landing" },
                { label: "Full website", value: "pricing_hint_full" },
                { label: "Ecommerce", value: "pricing_hint_ecom" },
            ]),
        };
    }

    if (t === "pricing_hint_landing") {
        return {
            message:
                "Landing page → usually **Basic** (fast + clean). If you want automation and more aggressive lead capture, **Standard**.",
            ui: withPricingButtons([{ label: "Get exact quote", value: "pricing_quote" }]),
        };
    }

    if (t === "pricing_hint_full") {
        return {
            message:
                "Full business website → **Standard** is usually the best value. Premium if you want chatbot + integrations + custom flows.",
            ui: withPricingButtons([{ label: "Get exact quote", value: "pricing_quote" }]),
        };
    }

    if (t === "pricing_hint_ecom") {
        return {
            message:
                "Ecommerce → usually **Premium**, unless it’s a tiny catalog and very simple (then Standard can work).",
            ui: withPricingButtons([{ label: "What about ecommerce?", value: "pricing_ecom" }]),
        };
    }

    // This one is a bridge into lead collection flow (you will wire this to leadFlow next)
    if (t === "pricing_quote") {
        return {
            message:
                "Cool — I can give an exact quote. I just need 4 quick things:\n" +
                "1) Your name\n" +
                "2) Best email\n" +
                "3) What you’re building (landing/full/ecom)\n" +
                "4) Timeline\n\n" +
                "Start with your **name** 👇",
            ui: withPricingButtons([
                { label: "Talk to someone", value: "talk to a person" },
            ]),
            // Optional hint: localLogic can set session.mode or session.lastQuestion after this return
            next: "lead_quote_start",
        };
    }

    // Default: user typed "pricing" (or anything pricing-ish)
    if (looksLikePricingQuestion(raw)) {
        return {
            message: tierSummary() + "\n\n" + moneyRangeText(),
            ui: withPricingButtons([
                { label: "Compare tiers", value: "pricing_compare" },
                { label: "Which should I pick?", value: "pricing_recommend" },
            ]),
        };
    }

    // If this handler was called incorrectly, return null so router can keep going
    return null;
}
