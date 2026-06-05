// ✅ Force start log
console.log("🚀 autoTrainer.js initializing...");

import fs from "fs";
import path from "path";
import crypto from "crypto";

console.log("✅ Modules imported.");

/**
 * Auto-Trainer v3 (Diagnostic + Stable)
 * - Always logs every step
 * - Always writes output, even if empty
 * - Works with small or large log sets
 * - Fully ESM compatible
 */

export async function autoTrain() {
    console.log("🧠 Auto-Trainer started…");

    // Define directories and paths
    const baseDir = path.resolve("./");
    const logsDir = path.join(baseDir, "data", "logs");
    const knowledgePath = path.join(baseDir, "data", "base_knowledge.json");
    const draftsPath = path.join(baseDir, "data", "auto_training_drafts.json");

    console.log("📂 Paths resolved:", { baseDir, logsDir, knowledgePath, draftsPath });

    // Check logs directory
    if (!fs.existsSync(logsDir)) {
        console.log("⚠️  No logs directory found at:", logsDir);
        return;
    }

    // Load base knowledge
    let existingKnowledge = [];
    if (fs.existsSync(knowledgePath)) {
        try {
            const rawData = fs.readFileSync(knowledgePath, "utf8");
            existingKnowledge = JSON.parse(rawData);
            console.log(`📘 Loaded ${existingKnowledge.length} knowledge entries.`);
        } catch (err) {
            console.error("❌ Error reading base_knowledge.json:", err);
        }
    } else {
        console.log("⚠️  base_knowledge.json not found, continuing with empty knowledge.");
    }

    // Read all logs
    const files = fs.readdirSync(logsDir);
    console.log(`📁 Found ${files.length} log file(s) in ${logsDir}`);

    let allMessages = [];

    for (const file of files) {
        const filePath = path.join(logsDir, file);
        try {
            const content = fs.readFileSync(filePath, "utf8");
            const logs = JSON.parse(content);
            logs.forEach(entry => {
                if (entry?.userInput) allMessages.push(entry.userInput.toLowerCase());
            });
            console.log(`✅ Parsed ${logs.length} entries from ${file}`);
        } catch (err) {
            console.error(`❌ Error reading ${file}:`, err);
        }
    }

    console.log(`🗣️  Total collected user messages: ${allMessages.length}`);

    if (allMessages.length === 0) {
        console.log("⚠️  No user messages found — writing empty drafts file.");
        fs.writeFileSync(draftsPath, JSON.stringify([], null, 2), "utf8");
        return;
    }

    // Count frequencies
    const freq = {};
    allMessages.forEach(msg => {
        const cleaned = msg.replace(/[^\w\s]/g, "").trim();
        if (cleaned.length < 4) return;
        freq[cleaned] = (freq[cleaned] || 0) + 1;
    });

    const frequent = Object.entries(freq)
        .filter(([_, count]) => count >= 1)
        .sort((a, b) => b[1] - a[1]);

    console.log(`📊 Found ${frequent.length} unique phrases.`);

    // Existing keywords to avoid duplicates
    // 🧩 Handle both array- and object-based base_knowledge.json
    let allKeywords = [];

    if (Array.isArray(existingKnowledge)) {
        allKeywords = existingKnowledge.flatMap(e => e.keywords || []);
    } else if (typeof existingKnowledge === "object" && existingKnowledge !== null) {
        // If structured by categories (like greetings, farewells, etc.)
        for (const [section, entries] of Object.entries(existingKnowledge)) {
            if (Array.isArray(entries)) {
                for (const item of entries) {
                    if (item.keywords) allKeywords.push(...item.keywords);
                }
            }
        }
    }

    const knownKeywords = new Set(allKeywords);
    console.log(`🧩 Extracted ${knownKeywords.size} known keywords from base_knowledge.json`);


    const drafts = frequent
        .filter(([phrase]) => !knownKeywords.has(phrase))
        .map(([phrase, count]) => {
            const id = crypto.randomBytes(6).toString("hex");
            return {
                id,
                topic: "auto_trained",
                keywords: [phrase],
                response: `Placeholder response for "${phrase}" (${count}× seen).`,
                intent: "auto_draft",
                emotion: "neutral",
                context_tags: ["auto_generated"],
                training_meta: {
                    occurrences: count,
                    last_seen: new Date().toISOString()
                }
            };
        });

    // Always write something
    fs.writeFileSync(draftsPath, JSON.stringify(drafts, null, 2), "utf8");

    if (drafts.length > 0) {
        console.log(`✅ Created ${drafts.length} new draft entries`);
        console.log(`📁 Saved at: ${draftsPath}`);
    } else {
        console.log("ℹ️  No new drafts created (file written anyway).");
    }

    console.log("🎉 Auto-Trainer completed successfully!");
}

// Run directly if executed via CLI
if (import.meta.url === `file://${process.argv[1]}`) {
    console.log("🎯 Executing autoTrain() directly...");
    autoTrain().catch(err => console.error("💥 Auto-Trainer crashed:", err));
}

// --- AUTO-RUN COMPAT FIX ---
// Works on Windows, macOS, and Linux
import { fileURLToPath } from "url";
import { resolve } from "path";

const currentFile = fileURLToPath(import.meta.url);
const entryFile = resolve(process.argv[1] || "");

if (currentFile === entryFile) {
    console.log("🎯 Executing autoTrain() directly...");
    autoTrain().catch(err => console.error("💥 Auto-Trainer crashed:", err));
} else {
    console.log("🧩 autoTrainer.js loaded as a module — awaiting manual call.");
}
