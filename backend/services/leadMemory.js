export function createDefaultMemory(visitorId) {
    const now = new Date().toISOString();

    return {
        identity: {
            visitor_id: String(visitorId || ""),
            created_at: now,
            last_seen_at: now,
        },
        lead_profile: {
            business_type: null,    // "pet store"
            need: null,             // "landing page", "website", "chatbot"
            goal: null,             // "sales", "leads", "bookings"
            checkout: null,         // true/false
            product_count: null,    // number
            budget: null,           // "low/med/high" or "$..."
            timeline: null,         // "asap", "this month", etc
            contact: {
                email: null,
                phone: null,
            },
        },
        locks: {
            business_type: false,
            need: false,
            goal: false,
            checkout: false,
            product_count: false,
        },
        stage: "discovery", // discovery -> solution -> plan -> handoff
        notes: {
            summary: "",
        },
    };
}

export function lockIfSet(memory, key) {
    if (memory?.lead_profile?.[key] !== null && memory?.lead_profile?.[key] !== "" && memory?.lead_profile?.[key] !== undefined) {
        if (memory.locks && key in memory.locks) memory.locks[key] = true;
    }
}

export function advanceStage(memory) {
    const L = memory.lead_profile;
    const K = memory.locks;

    // essentials for "solution"
    const essentials =
        K.business_type &&
        K.goal &&
        (K.need || L.need !== null) &&
        K.checkout;

    if (essentials && memory.stage === "discovery") {
        memory.stage = "solution";
    }

    // if they've got solution & are asking about pricing, we move to plan inside localLogic
    memory.identity.last_seen_at = new Date().toISOString();
    return memory;
}
