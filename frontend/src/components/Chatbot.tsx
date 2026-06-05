import { useEffect, useRef, useState } from "react";
import { FaCommentDots, FaTimes } from "react-icons/fa";

interface ChatbotProps {
    embedded?: boolean;
}

type QuickButton = {
    label: string;
    value: string;
};

type ChatMessage = {
    id: string;
    from: "user" | "bot";
    text: string;
    buttons?: QuickButton[];
};

function uid() {
    return `m_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

function getVisitorId(): string {
    const key = "rivon_visitor_id";
    const existing = localStorage.getItem(key);
    if (existing && existing.length > 0) return existing;

    const id =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : `vid_${Math.random().toString(16).slice(2)}_${Date.now()}`;

    localStorage.setItem(key, id);
    return id;
}

const API_BASE = "http://localhost:5000";

function stripBotPrefix(s: string) {
    return String(s || "").replace(/^Bot:\s*/i, "");
}

// Convert backend ui payload -> QuickButton[]
function uiToButtons(ui: any): QuickButton[] {
    if (!ui || typeof ui !== "object") return [];
    if (ui.kind !== "choices") return [];
    const choices = Array.isArray(ui.choices) ? ui.choices : [];
    return choices
        .map((c: any) => ({
            label: String(c?.label ?? "").trim(),
            value: String(c?.value ?? "").trim(),
        }))
        .filter((b: QuickButton) => b.label && b.value);
}

const Chatbot = ({ embedded = false }: ChatbotProps) => {
    const [open, setOpen] = useState(false);

    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: uid(), from: "bot", text: "Hello! How can I help your business today?" },
    ]);

    const [input, setInput] = useState("");

    const didResumeThisOpenRef = useRef(false);
    const messagesRef = useRef<HTMLDivElement | null>(null);
    const isTypingRef = useRef(false);

    // keep scrolled to bottom
    useEffect(() => {
        const el = messagesRef.current;
        if (!el) return;
        el.scrollTop = el.scrollHeight;
    }, [messages, open, embedded]);

    const chatBoxStyle: React.CSSProperties = {
        width: "580px",
        maxWidth: "92vw",
        height: "260px",
        background: "rgba(17,17,17,0.92)",
        backdropFilter: "blur(10px)",
        borderRadius: "16px",
        padding: "14px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.45)",
        display: "flex",
        flexDirection: "column",
        color: "#ddd",
        animation: "slideIn 0.55s forwards",
    };

    const messagesContainerStyle: React.CSSProperties = {
        flex: 1,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        marginBottom: "10px",
        paddingRight: "6px",
    };

    const inputRowStyle: React.CSSProperties = {
        display: "flex",
        gap: "8px",
        alignItems: "center",
    };

    const inputStyle: React.CSSProperties = {
        padding: "10px 12px",
        borderRadius: "10px",
        border: "1px solid rgba(255,255,255,0.12)",
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
        background: "#111",
        color: "#fff",
    };

    const sendBtnStyle: React.CSSProperties = {
        border: "none",
        borderRadius: "10px",
        padding: "0 14px",
        height: "40px",
        cursor: "pointer",
        color: "#fff",
        background: "linear-gradient(135deg, #6A00F5, #00D4FF)",
        whiteSpace: "nowrap",
    };

    const pillBtnStyle: React.CSSProperties = {
        border: "1px solid rgba(255,255,255,0.18)",
        borderRadius: "999px",
        padding: "7px 10px",
        cursor: "pointer",
        color: "#fff",
        background: "rgba(255,255,255,0.08)",
        fontSize: "0.85rem",
    };

    const pinnedBtnStyle: React.CSSProperties = {
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: "10px",
        padding: "0 10px",
        height: "40px",
        cursor: "pointer",
        color: "#fff",
        background: "rgba(255,255,255,0.08)",
        whiteSpace: "nowrap",
    };

    // typewriter: add a bot message and fill it letter-by-letter
    async function typeBotMessage(fullText: string, buttons: QuickButton[] = []) {
        const text = stripBotPrefix(fullText);
        const msgId = uid();

        isTypingRef.current = true;
        setMessages((prev) => [...prev, { id: msgId, from: "bot", text: "", buttons: [] }]);

        await new Promise((r) => setTimeout(r, 220));

        let i = 0;
        const speed = 12;
        await new Promise<void>((resolve) => {
            const timer = setInterval(() => {
                i++;
                setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, text: text.slice(0, i) } : m)));

                if (i >= text.length) {
                    clearInterval(timer);
                    if (buttons.length) {
                        setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, buttons } : m)));
                    }
                    resolve();
                }
            }, speed);
        });

        isTypingRef.current = false;
    }

    async function streamBotReply(userText: string) {
        const visitorId = getVisitorId();

        const res = await fetch(`${API_BASE}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userText, userRole: "guest", visitorId }),
        });

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No stream reader.");

        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const chunks = buffer.split("\n\n");

            for (const chunk of chunks.slice(0, -1)) {
                if (!chunk.trim()) continue;

                const eventLine = chunk.split("\n").find((l) => l.startsWith("event:"));
                const dataLine = chunk.split("\n").find((l) => l.startsWith("data:"));

                const event = eventLine?.replace("event:", "").trim();
                const dataStr = dataLine?.replace("data:", "").trim();

                if (!event) continue;

                if (event === "message" && dataStr) {
                    const data = JSON.parse(dataStr);

                    const botText = String(data.text || "");
                    // ✅ FIX: backend sends ui.choices, not data.buttons
                    const buttons = uiToButtons(data.ui);

                    await typeBotMessage(botText, buttons);
                }

                if (event === "error" && dataStr) {
                    await typeBotMessage("Server error — check backend logs.");
                }
            }

            buffer = chunks[chunks.length - 1];
        }
    }

    async function sendMessage(textOverride?: string) {
        const text = (textOverride ?? input).trim();
        if (!text) return;
        if (isTypingRef.current) return; // avoid double-sending while typing

        setMessages((prev) => [...prev, { id: uid(), from: "user", text }]);
        setInput("");

        if (text === "__RESET__") {
            await handleStartOver();
            return;
        }

        try {
            await streamBotReply(text);
        } catch {
            await typeBotMessage("Connection error — check backend.");
        }
    }

    // Resume on open
    useEffect(() => {
        if (embedded) return;

        if (!open) {
            didResumeThisOpenRef.current = false;
            return;
        }

        if (didResumeThisOpenRef.current) return;
        didResumeThisOpenRef.current = true;

        (async () => {
            try {
                const visitorId = getVisitorId();
                const url = `${API_BASE}/api/chat/resume?visitorId=${encodeURIComponent(visitorId)}`;
                const res = await fetch(url);
                const data = await res.json();

                const welcome = String(data?.message || "").trim();
                const buttons = uiToButtons(data?.ui); // ✅ if your resume endpoint returns ui

                if (!welcome) return;
                await typeBotMessage(welcome, buttons);
            } catch {
                // ignore
            }
        })();
    }, [open, embedded]);

    async function handleStartOver() {
        try {
            const visitorId = getVisitorId();
            await fetch(`${API_BASE}/api/chat/reset`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ visitorId }),
            });
        } catch {
            // ignore
        }

        setMessages([
            {
                id: uid(),
                from: "bot",
                text: "All good — starting fresh. What are you trying to build? (website, ecommerce, landing page, blog, forum, etc.)",
            },
        ]);

        // nudge planning
        try {
            await streamBotReply("website");
        } catch {
            // ignore
        }
    }

    const renderButtons = (buttons: QuickButton[]) => (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
            {buttons.map((b, idx) => (
                <button
                    key={`${b.value}_${idx}`}
                    style={pillBtnStyle}
                    onClick={() => sendMessage(b.value)}
                    title={b.value}
                >
                    {b.label}
                </button>
            ))}
        </div>
    );

    // ✅ FIX: full-width row flex so bubbles truly align left/right
    const renderMessage = (m: ChatMessage) => {
        const isUser = m.from === "user";

        return (
            <div
                key={m.id}
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: isUser ? "flex-end" : "flex-start",
                }}
            >
                <div style={{ maxWidth: "86%" }}>
                    <div
                        style={{
                            background: isUser ? "rgba(255,255,255,0.08)" : "#6A00F5",
                            color: "#fff",
                            padding: "8px 10px",
                            borderRadius: "10px",
                            fontSize: "0.92rem",
                            border: isUser ? "1px solid rgba(106,0,245,0.7)" : "none",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            textAlign: "left",
                        }}
                    >
                        {m.text}
                    </div>

                    {!isUser && m.buttons && m.buttons.length > 0 && renderButtons(m.buttons)}
                </div>
            </div>
        );
    };

    const renderChat = () => (
        <div style={chatBoxStyle}>
            <div style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "8px", letterSpacing: "0.2px" }}>
                Rivon AI Chat
            </div>

            <div ref={messagesRef} style={messagesContainerStyle}>
                {messages.map(renderMessage)}
            </div>

            <div style={inputRowStyle}>
                <button style={pinnedBtnStyle} onClick={() => sendMessage("talk to a person")}>
                    Talk to a person
                </button>

                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    type="text"
                    placeholder="Type your message..."
                    style={inputStyle}
                />

                <button onClick={() => sendMessage()} style={sendBtnStyle}>
                    Send
                </button>
            </div>

            <style>
                {`
          @keyframes slideIn {
            from { transform: translateX(24px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}
            </style>
        </div>
    );

    if (embedded) return renderChat();

    return (
        <>
            <button
                onClick={() => setOpen(!open)}
                style={{
                    position: "fixed",
                    bottom: "30px",
                    right: "30px",
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6A00F5, #00D4FF)",
                    border: "none",
                    color: "white",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 200,
                }}
            >
                {open ? <FaTimes /> : <FaCommentDots />}
            </button>

            {open && (
                <div style={{ position: "fixed", bottom: "100px", right: "30px", zIndex: 150 }}>
                    {renderChat()}
                </div>
            )}
        </>
    );
};

export default Chatbot;
