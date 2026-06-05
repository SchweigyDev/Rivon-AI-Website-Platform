import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { resolve } from "path";

console.log("🧠 verifyKnowledgeIntegrity.js initializing...");

function verifyKnowledgeIntegrity() {
    console.log("🔍 Verifying base_knowledge_v4_advanced.json integrity...");

    const filePath = path.resolve("./data/base_knowledge_v4_advanced.json");
    if (!fs.existsSync(filePath)) {
        console.error("❌ File not found:", filePath);
        return;
    }

    const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (!Array.isArray(raw)) {
        console.error("❌ Invalid structure: expected array of entries.");
        return;
    }

    let total = raw.length;
    let issues = [];
    let completeCount = 0;

    const requiredFields = [
        "id",
        "topic",
        "keywords",
        "response",
        "intent",
        "tone",
        "emotion",
        "context_tags",
        "memory_flags",
        "semantic_summary",
        "connected_responses"
    ];

    raw.forEach((entry, index) => {
        let entryIssues = [];

        // Check for required fields
        requiredFields.forEach((f) => {
            if (!(f in entry)) entryIssues.push(`missing ${f}`);
        });

        // Connected responses check
        if (!Array.isArray(entry.connected_responses) || entry.connected_responses.length < 8) {
            entryIssues.push(`only ${entry.connected_responses?.length || 0} connected responses`);
        } else {
            entry.connected_responses.forEach((cr, i) => {
                if (!cr.next_responses || cr.next_responses.length === 0)
                    entryIssues.push(`connected_responses[${i}] missing next_responses`);
            });
        }

        // Hooks check
        if (!entry.emotion_hooks) entryIssues.push("missing emotion_hooks");
        if (!entry.semantic_hooks) entryIssues.push("missing semantic_hooks");
        if (!entry.transitions) entryIssues.push("missing transitions");

        if (entryIssues.length === 0) {
            completeCount++;
        } else {
            issues.push({
                id: entry.id,
                topic: entry.topic,
                problems: entryIssues
            });
        }
    });

    const completeness = ((completeCount / total) * 100).toFixed(2);

    console.log("📊 Integrity check results:");
    console.log(`   Total entries checked: ${total}`);
    console.log(`   Complete entries: ${completeCount}`);
    console.log(`   Incomplete entries: ${issues.length}`);
    console.log(`   ✅ Completeness: ${completeness}%`);

    if (issues.length > 0) {
        console.log("\n⚠️ Issues found in the following entries:");
        issues.slice(0, 10).forEach((e) => {
            console.log(`- ${e.id || "(no id)"} (${e.topic}): ${e.problems.join(", ")}`);
        });
        if (issues.length > 10) console.log(`...and ${issues.length - 10} more issues not shown.`);
    }

    // Optional: Write report file
    const reportPath = path.resolve("./data/verifier_report.txt");
    fs.writeFileSync(
        reportPath,
        [
            `Verification Report - ${new Date().toLocaleString()}`,
            `Total entries: ${total}`,
            `Complete: ${completeCount}`,
            `Incomplete: ${issues.length}`,
            `Completeness: ${completeness}%`,
            "\nIssues (sample):",
            ...issues.slice(0, 50).map(
                (e) => `- ${e.id || "(no id)"} (${e.topic}): ${e.problems.join(", ")}`
            )
        ].join("\n"),
        "utf8"
    );

    console.log(`\n📝 Report saved to: ${reportPath}`);
}

// --- Auto-run when executed directly
const currentFile = fileURLToPath(import.meta.url);
const entryFile = resolve(process.argv[1] || "");
if (currentFile === entryFile) {
    console.log("🎯 Executing verifyKnowledgeIntegrity() directly...");
    verifyKnowledgeIntegrity();
} else {
    console.log("🧩 verifyKnowledgeIntegrity.js loaded as a module — awaiting manual call.");
}
