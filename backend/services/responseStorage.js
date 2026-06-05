import fs from "fs-extra";
import path from "path";

const responsesPath = path.resolve("./backend/data/responses.json");

export async function saveResponse(message, answer) {
    const data = await fs.readJson(responsesPath).catch(() => ({}));
    const key = message.toLowerCase().split(" ").slice(0, 3).join("_");

    data[key] = { question: message, answer };
    await fs.writeJson(responsesPath, data, { spaces: 2 });
}
