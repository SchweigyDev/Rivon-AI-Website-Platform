import express from "express";
import { handleMessage } from "../services/localLogic.js";

const router = express.Router();

// NOTE: frontend should send { message, visitorId, userRole, choiceValue? }
router.post("/", async (req, res) => {
    const { message, userRole = "guest", visitorId = "anon", choiceValue = "" } = req.body || {};

    // If a button was clicked, we treat that as the message.
    const input = (choiceValue || message || "").toString();

    console.log("📩 Incoming:", { visitorId, userRole, input });

    // SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
        const reply = await handleMessage(input, userRole, visitorId);
        console.log("💬 Outgoing reply:", reply?.message);

        // crisis cutoff
        if (reply?.message && String(reply.message).includes("988")) {
            const crisisText = reply.message.startsWith("Bot:") ? reply.message : `Bot: ${reply.message}`;
            res.write(`event: message\ndata: ${JSON.stringify({ text: crisisText, ui: reply.ui || null })}\n\n`);
            res.write(`event: done\ndata: {}\n\n`);
            res.end();
            return;
        }

        const text = reply?.message ? (reply.message.startsWith("Bot:") ? reply.message : `Bot: ${reply.message}`) : "Bot: ...";

        // One SSE payload includes ui object for buttons
        res.write(`event: message\ndata: ${JSON.stringify({ text, ui: reply.ui || null })}\n\n`);
        res.write(`event: done\ndata: {}\n\n`);
    } catch (err) {
        console.error("❌ SSE error:", err);
        res.write(`event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`);
    } finally {
        res.end();
    }
});

export default router;
