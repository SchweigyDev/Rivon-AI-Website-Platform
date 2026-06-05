console.log("🚀 migrateToV4.js initializing...");

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { resolve } from "path";

/**
 * Migration Tool v2 (Windows-safe)
 * Converts category-based V3 JSON → unified V4 JSON
 */

function migrateToV4() {
    console.log("🧭 Starting migration from V3 → V4...");

    const basePath = path.resolve("./data/base_knowledge.json");
    const outputPath = path.resolve("./data/base_knowledge_v4.json");

    console.log("📂 Reading:", basePath);

    if (!fs.existsSync(basePath)) {
        console.error("❌ base_knowledge.json not found!");
        return;
    }

    let rawData;
    try {
        rawData = JSON.parse(fs.readFileSync(basePath, "utf8"));
    } catch (err) {
        console.error("❌ Could not parse base_knowledge.json:", err);
        return;
    }

    const result = [];
    let total = 0;

    for (const [section, entries] of Object.entries(rawData)) {
        if (!Array.isArray(entries)) continue;

        entries.forEach((entry, idx) => {
            total++;

            const id = `${section}_${String(idx + 1).padStart(3, "0")}_${crypto
                .randomBytes(3)
                .toString("hex")}`;

            const newEntry = {
                id,
                topic: section,
                keywords: entry.keywords || [],
                response: entry.response || "⚠️ Missing response text",
                tone: entry.tone || "neutral",
                emotion: entry.emotion || "neutral",
                context_tags: entry.context_tags || [section],
                restricted: !!entry.restricted,
                connected_responses:
                    entry.connected_responses ||
                    [
                        { text: "Would you like to know more?", tone: "friendly", depth: 1 },
                        { text: "I can explain further if you’d like.", tone: "professional", depth: 2 }
                    ]
            };

            result.push(newEntry);
        });
    }

    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), "utf8");
    console.log(`✅ Migration complete! Converted ${total} entries.`);
    console.log(`📁 Saved new file to: ${outputPath}`);
}

// --- AUTO-RUN COMPAT FIX (works on Windows/macOS/Linux)
const currentFile = fileURLToPath(import.meta.url);
const entryFile = resolve(process.argv[1] || "");

if (currentFile === entryFile) {
    console.log("🎯 Executing migrateToV4() directly...");
    migrateToV4();
} else {
    console.log("🧩 migrateToV4.js loaded as a module — awaiting manual call.");
}
