import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "lead_memory.json");

export function ensureMemoryFile() {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(FILE_PATH)) fs.writeFileSync(FILE_PATH, JSON.stringify({}, null, 2), "utf-8");
}

export function loadMemory(visitorId) {
    ensureMemoryFile();
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const all = JSON.parse(raw || "{}");
    return all[visitorId] || null;
}

export function saveMemory(visitorId, memoryObj) {
    ensureMemoryFile();
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const all = JSON.parse(raw || "{}");
    all[visitorId] = memoryObj;
    fs.writeFileSync(FILE_PATH, JSON.stringify(all, null, 2), "utf-8");
}
