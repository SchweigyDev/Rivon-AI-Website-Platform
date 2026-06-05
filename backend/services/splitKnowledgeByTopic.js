import fs from "fs";
import path from "path";

/**
 * Automatically splits a massive base_knowledge.json into separate files by topic.
 * Each file will contain a JSON array of entries belonging to that topic.
 */

export async function splitKnowledgeByTopic() {
    console.log("🧠 Starting knowledge base splitter...");

    const basePath = path.resolve("./data");
    const sourceFile = path.join(basePath, "base_knowledge.json");
    const outputDir = path.join(basePath, "knowledge");

    // ✅ Confirm working directory
    console.log(`📂 Current working directory: ${process.cwd()}`);

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        console.log(`📁 Created output directory: ${outputDir}`);
    }

    // Load and parse the source file
    let data;
    try {
        const raw = fs.readFileSync(sourceFile, "utf8");
        data = JSON.parse(raw);
    } catch (err) {
        console.error("❌ Failed to read or parse base_knowledge.json:", err);
        return;
    }

    // Ensure it's an array or flatten it if needed
    let entries = [];
    if (Array.isArray(data)) {
        entries = data;
    } else if (typeof data === "object" && data !== null) {
        for (const section of Object.values(data)) {
            if (Array.isArray(section)) entries.push(...section);
        }
    }

    console.log(`📦 Loaded ${entries.length} total entries from base_knowledge.json`);

    if (entries.length === 0) {
        console.warn("⚠️ No entries found — check that base_knowledge.json has valid data.");
        return;
    }

    // Prepare storage for categorized entries
    const categories = {};

    for (const entry of entries) {
        let topic = (entry.topic || "").trim().toLowerCase();

        if (!topic && Array.isArray(entry.context_tags) && entry.context_tags.length > 0) {
            topic = entry.context_tags[0].toLowerCase();
        } else if (!topic && entry.id) {
            const guess = entry.id.split("_")[0];
            topic = guess || "misc";
        }

        if (!topic) topic = "misc";
        const safeTopic = topic.replace(/[^a-z0-9_]/gi, "_");

        if (!categories[safeTopic]) categories[safeTopic] = [];
        categories[safeTopic].push(entry);
    }

    // Write out one file per topic
    const written = [];
    for (const [topic, list] of Object.entries(categories)) {
        const outputPath = path.join(outputDir, `${topic}.json`);
        try {
            fs.writeFileSync(outputPath, JSON.stringify(list, null, 2), "utf8");
            written.push({ topic, count: list.length });
        } catch (err) {
            console.error(`❌ Failed to write ${topic}.json:`, err);
        }
    }

    console.log("✅ Split complete! Summary:");
    written.forEach(w => console.log(`   • ${w.topic}.json — ${w.count} entries`));

    console.log(`📂 All files saved to: ${outputDir}`);
}

// 🟢 Run if called directly (safe check)
if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) {
    splitKnowledgeByTopic();
}
