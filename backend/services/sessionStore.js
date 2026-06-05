import fs from "fs";
import path from "path";

const sessionsPath = path.resolve("./data/sessions/rivon_sessions.json");
const DEBUG = true;

function ensureSessionsFile() {
    const dir = path.dirname(sessionsPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(sessionsPath)) fs.writeFileSync(sessionsPath, JSON.stringify({}, null, 2), "utf8");
}

export function loadAllSessions() {
    ensureSessionsFile();
    try {
        return JSON.parse(fs.readFileSync(sessionsPath, "utf8")) || {};
    } catch {
        return {};
    }
}

export function saveAllSessions(obj) {
    ensureSessionsFile();
    fs.writeFileSync(sessionsPath, JSON.stringify(obj, null, 2), "utf8");
}

export function getSession(visitorId, defaultSessionFactory) {
    const vid = String(visitorId || "").trim() || "anon";
    const all = loadAllSessions();

    if (!all[vid]) {
        all[vid] = defaultSessionFactory();
        saveAllSessions(all);
        if (DEBUG) console.log("🧠 Created new session for:", vid);
    }

    return { vid, session: all[vid] };
}

export function updateSession(visitorId, newSession) {
    const vid = String(visitorId || "").trim() || "anon";
    const all = loadAllSessions();
    all[vid] = newSession;
    saveAllSessions(all);
    if (DEBUG) console.log("🧠 Updated session for:", vid);
}

export function resetSession(visitorId) {
    const vid = String(visitorId || "").trim() || "anon";
    const all = loadAllSessions();

    if (all[vid]) {
        delete all[vid];
        saveAllSessions(all);
        if (DEBUG) console.log("🧼 Reset session for:", vid);
    }
}
