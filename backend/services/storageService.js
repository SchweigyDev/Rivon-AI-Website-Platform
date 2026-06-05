import fs from "fs";
import path from "path";

/**
 * Save a chat message (local or GPT) to a date-based JSON log.
 * Automatically creates folders and files if they don't exist.
 */
export async function saveChatLog({
                                      userRole = "guest",
                                      message,
                                      reply,
                                      source = "local"
                                  }) {
    try {
        const today = new Date().toISOString().split("T")[0];
        const logsDir = path.resolve("./data/logs");
        const logFile = path.join(logsDir, `${today}_${userRole}.json`);

        // Make sure directory exists
        if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

        // Create new file if none exists
        if (!fs.existsSync(logFile)) fs.writeFileSync(logFile, "[]", "utf8");

        // Read current logs
        const existingLogs = JSON.parse(fs.readFileSync(logFile, "utf8"));

        // New entry
        const newEntry = {
            timestamp: new Date().toISOString(),
            userRole,
            userInput: message,
            reply,
            source
        };

        // Append and save
        existingLogs.push(newEntry);
        fs.writeFileSync(logFile, JSON.stringify(existingLogs, null, 2), "utf8");

        console.log(`💾 Chat saved to ${logFile}`);
    } catch (err) {
        console.error("❌ Failed to save chat log:", err);
    }
}

/**
 * Optional helper to get all logs for a given day or userRole
 */
export function loadChatLogs({ date = null, userRole = null } = {}) {
    try {
        const logsDir = path.resolve("./data/logs");
        if (!fs.existsSync(logsDir)) return [];

        const files = fs.readdirSync(logsDir);
        let results = [];

        files.forEach(file => {
            if (
                (!date || file.startsWith(date)) &&
                (!userRole || file.includes(userRole))
            ) {
                const filePath = path.join(logsDir, file);
                const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
                results = results.concat(data);
            }
        });

        return results;
    } catch (err) {
        console.error("❌ Failed to load chat logs:", err);
        return [];
    }
}
