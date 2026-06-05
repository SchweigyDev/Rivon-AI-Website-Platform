import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { resolve } from "path";
import crypto from "crypto";

console.log("🚀 enrichToV4Advanced.js initializing...");

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function enrichToV4Advanced() {
    console.log("🧠 Starting V4 enrichment process...");

    const basePath = path.resolve("./data/base_knowledge_v4.json");
    const outputPath = path.resolve("./data/base_knowledge_v4_advanced.json");

    if (!fs.existsSync(basePath)) {
        console.error("❌ base_knowledge_v4.json not found!");
        return;
    }

    const raw = JSON.parse(fs.readFileSync(basePath, "utf8"));
    if (!Array.isArray(raw)) {
        console.error("❌ Invalid data structure in base_knowledge_v4.json (expected array)");
        return;
    }

    const tones = ["friendly", "professional", "funny", "sarcastic", "enlightened", "personal", "flirty", "neutral"];
    const intents = [
        "greet_user", "farewell_user", "ask_question", "give_information", "acknowledge_user",
        "offer_help", "motivate_user", "express_gratitude", "continue_smalltalk", "offer_support"
    ];

    const enriched = raw.map((entry) => {
        const id = entry.id || `${entry.topic}_${crypto.randomBytes(3).toString("hex")}`;
        const tone = entry.tone && tones.includes(entry.tone) ? entry.tone : randomChoice(tones);
        const emotion = entry.emotion || randomChoice(["positive", "neutral", "curious", "warm", "empathetic"]);
        const intent = entry.intent || randomChoice(intents);

        // Connected responses (8 total)
        const connected_responses = [];
        for (let i = 1; i <= 8; i++) {
            connected_responses.push({
                text:
                    i === 1
                        ? "That’s interesting — tell me more about it!"
                        : randomChoice([
                            "Can you expand on that a bit?",
                            "I’d love to hear more details!",
                            "That makes sense — what happened next?",
                            "Hmm, intriguing thought 🤔",
                            "Sounds like there’s more to it!",
                            "I totally get that — go on!",
                            "Tell me what you think about it personally."
                        ]),
                intent: randomChoice(intents),
                emotion: randomChoice(["friendly", "curious", "empathetic", "neutral"]),
                context_tags: [entry.topic, "conversation_followup"],
                expected_user_replies: randomChoice([
                    ["yes", "no", "maybe"],
                    ["sure", "why not", "not really"],
                    ["interesting", "tell me more", "okay"]
                ]),
                next_responses: [
                    {
                        text: randomChoice([
                            "I appreciate that perspective 🙌",
                            "That’s a smart way to look at it!",
                            "Fascinating! You’ve got a unique way of thinking."
                        ]),
                        intent: randomChoice(intents),
                        emotion: randomChoice(["friendly", "enlightened", "personal"])
                    },
                    {
                        text: randomChoice([
                            "That’s totally fair 👍",
                            "Makes sense when you put it that way.",
                            "Good point — I hadn’t thought of it like that."
                        ]),
                        intent: randomChoice(intents),
                        emotion: randomChoice(["neutral", "professional"])
                    }
                ]
            });
        }

        // Transitions + hooks
        const transitions = [
            { if_user_mentions: ["help", "support"], go_to_topic: "support" },
            { if_user_mentions: ["price", "plan"], go_to_topic: "pricing" },
            { if_user_mentions: ["learn", "study"], go_to_topic: "learning" },
            { if_user_mentions: ["sad", "angry"], go_to_topic: "mindfulness" }
        ];

        const emotion_hooks = {
            on_user_positive: ["continue_smalltalk", "reinforce_positive"],
            on_user_negative: ["offer_support", "acknowledge_feelings"],
            on_user_neutral: ["ask_question"]
        };

        const semantic_hooks = {
            update_memory: ["user_mood", "recent_topic", "conversation_depth"],
            retrieve_context: ["previous_mood", "stored_entities"]
        };

        const memory_flags = {
            store_topic: true,
            entities: ["user_name", "mood", "topic_interest"],
            decay_after: 12,
            memory_level: "session"
        };

        const semantic_summary = `Bot responds about ${entry.topic} with a ${tone} and ${emotion} tone.`;

        return {
            id,
            topic: entry.topic,
            keywords: entry.keywords || [],
            response: entry.response || "No response available.",
            intent,
            tone,
            emotion,
            context_tags: entry.context_tags || [entry.topic],
            memory_flags,
            semantic_summary,
            connected_responses,
            transitions,
            emotion_hooks,
            semantic_hooks
        };
    });

    fs.writeFileSync(outputPath, JSON.stringify(enriched, null, 2), "utf8");
    console.log(`✅ Enrichment complete! ${enriched.length} entries upgraded.`);
    console.log(`📁 Saved enriched file to: ${outputPath}`);
}

// --- Auto-run compat fix (works everywhere)
const currentFile = fileURLToPath(import.meta.url);
const entryFile = resolve(process.argv[1] || "");
if (currentFile === entryFile) {
    console.log("🎯 Executing enrichToV4Advanced() directly...");
    enrichToV4Advanced();
} else {
    console.log("🧩 enrichToV4Advanced.js loaded as a module — awaiting manual call.");
}
