import fs from "fs";
import path from "path";

console.log("📊 countKnowledgeByTopic.js initializing...");

const filePath = path.resolve("./data/base_knowledge_v4_advanced.json");

if (!fs.existsSync(filePath)) {
    console.error("❌ File not found:", filePath);
    process.exit(1);
}

try {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (!Array.isArray(raw)) {
        console.error("❌ Invalid JSON structure: expected array of entries.");
        process.exit(1);
    }

    const counts = {};
    raw.forEach((entry) => {
        const topic = entry.topic || "unknown";
        counts[topic] = (counts[topic] || 0) + 1;
    });

    // Sort by highest count
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

    console.log("\n📋 Knowledge Base Category Report");
    console.log("───────────────────────────────────────────");
    let total = 0;
    sorted.forEach(([topic, count]) => {
        total += count;
        console.log(`${topic.padEnd(25)} → ${count.toString().padStart(4)} entries`);
    });
    console.log("───────────────────────────────────────────");
    console.log(`🧩 Total Entries: ${total}`);
    console.log(`🗂️  Unique Topics: ${sorted.length}`);

    // Save to text report
    const reportPath = path.resolve("./data/category_report.txt");
    const reportText = [
        "Knowledge Base Category Report",
        `Generated: ${new Date().toLocaleString()}`,
        "───────────────────────────────────────────",
        ...sorted.map(([topic, count]) => `${topic.padEnd(25)} → ${count}`),
        "───────────────────────────────────────────",
        `Total Entries: ${total}`,
        `Unique Topics: ${sorted.length}`
    ].join("\n");

    fs.writeFileSync(reportPath, reportText, "utf8");
    console.log(`\n📝 Saved report to: ${reportPath}`);

} catch (err) {
    console.error("💥 Error reading or parsing JSON:", err);
}
