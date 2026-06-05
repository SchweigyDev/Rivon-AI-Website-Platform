import fs from "fs";
import path from "path";

const DEBUG = true;

// Optional: set LEAD_WEBHOOK_URL in .env to receive instant lead pings
const LEAD_WEBHOOK_URL = process.env.LEAD_WEBHOOK_URL || "";

// Also store a local log so you never lose leads
const leadAlertsPath = path.resolve("./data/leads/lead_alerts.json");

function ensureAlertsFile() {
    const dir = path.dirname(leadAlertsPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(leadAlertsPath)) fs.writeFileSync(leadAlertsPath, JSON.stringify([], null, 2), "utf8");
}

function readAlerts() {
    ensureAlertsFile();
    try {
        const raw = JSON.parse(fs.readFileSync(leadAlertsPath, "utf8"));
        return Array.isArray(raw) ? raw : [];
    } catch {
        return [];
    }
}

function writeAlerts(arr) {
    ensureAlertsFile();
    fs.writeFileSync(leadAlertsPath, JSON.stringify(arr, null, 2), "utf8");
}

export async function notifyLiveLead(payload) {
    const alert = {
        ...payload,
        createdAt: new Date().toISOString(),
    };

    // Always log locally
    try {
        const alerts = readAlerts();
        alerts.push(alert);
        writeAlerts(alerts);
        if (DEBUG) console.log("🔔 Lead alert logged:", alert);
    } catch (e) {
        console.error("❌ Failed to log lead alert:", e);
    }

    // Optional webhook
    if (!LEAD_WEBHOOK_URL) return;

    try {
        const res = await fetch(LEAD_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(alert),
        });

        if (DEBUG) console.log("🔔 Lead webhook status:", res.status);
    } catch (e) {
        console.error("❌ Lead webhook failed:", e);
    }
}
