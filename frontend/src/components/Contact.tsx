import { useState } from "react";

const Contact = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (!email.trim()) {
            setStatus("error");
            return;
        }

        // Placeholder: this is where you'd call your backend / API later
        console.log("New Rivon contact lead:", {
            email,
            message,
        });

        setStatus("success");
        setEmail("");
        setMessage("");
    };

    const sectionStyle = {
        position: "relative" as const,
        padding: "80px 20px 100px",
        background:
            "radial-gradient(circle at top, #020617 0, #020617 50%, #000 100%)",
        color: "#e5e7eb",
        textAlign: "center" as const,
        overflow: "hidden" as const,
    };

    const innerStyle = {
        maxWidth: "1120px",
        margin: "0 auto",
        position: "relative" as const,
        zIndex: 2,
    };

    const headerKickerStyle = {
        display: "inline-flex",
        padding: "4px 12px",
        borderRadius: 999,
        fontSize: "0.75rem",
        letterSpacing: "0.12em",
        textTransform: "uppercase" as const,
        background: "rgba(148,163,184,0.08)",
        border: "1px solid rgba(148,163,184,0.32)",
        color: "#a5b4fc",
        backdropFilter: "blur(12px)",
    };

    const titleStyle = {
        marginTop: 16,
        fontSize: "clamp(1.9rem, 3vw, 2.4rem)",
        fontWeight: 700,
        backgroundImage: "linear-gradient(120deg, #e5e7eb, #a5b4fc, #22d3ee)",
        WebkitBackgroundClip: "text" as const,
        backgroundClip: "text",
        color: "transparent",
    };

    const subtitleStyle = {
        marginTop: 14,
        maxWidth: 640,
        marginLeft: "auto",
        marginRight: "auto",
        fontSize: "0.95rem",
        color: "#9ca3af",
    };

    const cardWrapperStyle: React.CSSProperties = {
        marginTop: 40,
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
        gap: 32,
        alignItems: "stretch",
    };

    const cardWrapperStacked: React.CSSProperties = {
        marginTop: 40,
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr)",
        gap: 32,
        alignItems: "stretch",
    };

    // Very simple responsive check
    const isNarrow =
        typeof window !== "undefined" && window.innerWidth < 900;
    const appliedCardWrapper = isNarrow
        ? cardWrapperStacked
        : cardWrapperStyle;

    const textPanelStyle = {
        textAlign: "left" as const,
        display: "flex",
        flexDirection: "column" as const,
        gap: 14,
        justifyContent: "center",
        padding: "0 4px",
    };

    const textPanelTitle = {
        fontSize: "1.2rem",
        fontWeight: 600,
        color: "#e5e7eb",
    };

    const textPanelBody = {
        fontSize: "0.95rem",
        color: "#9ca3af",
        lineHeight: 1.6,
    };

    const bulletList = {
        marginTop: 6,
        listStyleType: "disc" as const,
        paddingLeft: 20,
        fontSize: "0.9rem",
        color: "#9ca3af",
    };

    const formCardStyle = {
        position: "relative" as const,
        borderRadius: 20,
        border: "1px solid rgba(148,163,184,0.45)",
        background:
            "radial-gradient(circle at top left, rgba(15,23,42,0.98), rgba(15,23,42,1))",
        boxShadow:
            "0 20px 48px rgba(15,23,42,0.96), 0 0 0 1px rgba(15,23,42,0.9)",
        padding: "22px 22px 24px",
        textAlign: "left" as const,
        overflow: "hidden" as const,
    };

    const formGlow = {
        position: "absolute" as const,
        top: -40,
        right: -40,
        width: 120,
        height: 120,
        borderRadius: 999,
        background:
            "radial-gradient(circle, rgba(56,189,248,0.7), transparent 65%)",
        filter: "blur(8px)",
        opacity: 0.25,
        pointerEvents: "none" as const,
    };

    const formTitleStyle = {
        fontSize: "1.05rem",
        fontWeight: 600,
        color: "#e5e7eb",
        marginBottom: 4,
    };

    const formSubtitleStyle = {
        fontSize: "0.85rem",
        color: "#9ca3af",
        marginBottom: 16,
    };

    const labelStyle = {
        display: "block",
        fontSize: "0.8rem",
        textTransform: "uppercase" as const,
        letterSpacing: "0.14em",
        color: "#a5b4fc",
        marginBottom: 6,
    };

    const inputStyle = {
        width: "100%",
        padding: "10px 11px",
        borderRadius: 10,
        border: "1px solid rgba(148,163,184,0.6)",
        backgroundColor: "rgba(15,23,42,0.9)",
        color: "#e5e7eb",
        fontSize: "0.9rem",
        outline: "none" as const,
        boxShadow: "0 0 0 1px rgba(15,23,42,0.9)",
        transition:
            "border-color 140ms ease, box-shadow 140ms ease, background-color 140ms ease",
    };

    const textareaStyle = {
        ...inputStyle,
        minHeight: 90,
        resize: "vertical" as const,
    };

    const buttonStyle = {
        marginTop: 14,
        width: "100%",
        padding: "10px 14px",
        borderRadius: 999,
        border: "1px solid rgba(56,189,248,0.9)",
        background:
            "radial-gradient(circle at top left, rgba(56,189,248,0.32), rgba(15,23,42,1))",
        color: "#e0f2fe",
        fontSize: "0.9rem",
        textTransform: "uppercase" as const,
        letterSpacing: "0.14em",
        cursor: "pointer",
        transition:
            "background 150ms ease, transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease",
    };

    const buttonHoverStyle = {
        background:
            "radial-gradient(circle at top left, rgba(56,189,248,0.5), rgba(15,23,42,1))",
        transform: "translateY(-1px)",
        boxShadow: "0 12px 26px rgba(8,47,73,0.9)",
    };

    // const helperRowStyle = {
    //     marginTop: 10,
    //     fontSize: "0.78rem",
    //     color: "#9ca3af",
    //     display: "flex",
    //     justifyContent: "space-between",
    //     gap: 12,
    //     flexWrap: "wrap" as const,
    // };

    const statusStyleBase = {
        marginTop: 10,
        fontSize: "0.8rem",
    };

    const orbBase = {
        position: "absolute" as const,
        width: 260,
        height: 260,
        borderRadius: 999,
        filter: "blur(24px)",
        opacity: 0.35,
        pointerEvents: "none" as const,
    };

    const isError = status === "error";
    const isSuccess = status === "success";

    return (
        <section style={sectionStyle} id="contact">
            <div style={innerStyle}>
                <p style={headerKickerStyle}>Contact</p>
                <h2 style={titleStyle}>Let&apos;s build your AI-first website</h2>
                <p style={subtitleStyle}>
                    Leave your email and a few notes, and we&apos;ll send over next steps,
                    example builds, and a rough plan tailored to your stage and budget.
                </p>

                <div style={appliedCardWrapper}>
                    {/* LEFT: Copy */}
                    <div style={textPanelStyle}>
                        <h3 style={textPanelTitle}>Tell us where you&apos;re at</h3>
                        <p style={textPanelBody}>
                            Whether you&apos;re validating an idea or replacing an old site,
                            Rivon helps you move faster with a clear AI strategy baked into
                            your web presence.
                        </p>
                        <ul style={bulletList}>
                            <li>Match you with Basic, Standard, or Premium plans</li>
                            <li>Share examples similar to your industry</li>
                            <li>Outline what an AI-first site could automate for you</li>
                        </ul>
                    </div>

                    {/* RIGHT: Form */}
                    <div style={formCardStyle}>
                        <div style={formGlow} />
                        <h3 style={formTitleStyle}>Get your Rivon intro</h3>
                        <p style={formSubtitleStyle}>
                            Drop your best email. No spam, no pressure — just options.
                        </p>

                        <form onSubmit={handleSubmit}>
                            <label style={labelStyle} htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@company.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (status !== "idle") setStatus("idle");
                                }}
                                style={{
                                    ...inputStyle,
                                    borderColor: isError
                                        ? "rgba(248,113,113,0.9)"
                                        : inputStyle.border,
                                }}
                            />

                            <label style={{ ...labelStyle, marginTop: 14 }} htmlFor="message">
                                Optional notes
                            </label>
                            <textarea
                                id="message"
                                placeholder="Tell us about your business, goals, or timeline..."
                                value={message}
                                onChange={(e) => {
                                    setMessage(e.target.value);
                                    if (status !== "idle") setStatus("idle");
                                }}
                                style={textareaStyle}
                            />

                            <button
                                type="submit"
                                style={buttonStyle}
                                onMouseEnter={(e) =>
                                    Object.assign(
                                        (e.currentTarget as HTMLButtonElement).style,
                                        buttonHoverStyle
                                    )
                                }
                                onMouseLeave={(e) =>
                                    Object.assign(
                                        (e.currentTarget as HTMLButtonElement).style,
                                        buttonStyle
                                    )
                                }
                            >
                                Send my Rivon overview
                            </button>
                        </form>

                        {isError && (
                            <p
                                style={{
                                    ...statusStyleBase,
                                    color: "#fecaca",
                                }}
                            >
                                Please add a valid email so we know where to reach you.
                            </p>
                        )}

                        {isSuccess && (
                            <p
                                style={{
                                    ...statusStyleBase,
                                    color: "#bbf7d0",
                                }}
                            >
                                Thanks! We&apos;d follow up here with next steps once this is
                                wired to a backend.
                            </p>
                        )}

                        {!isError && !isSuccess && (
                            <p
                                style={{
                                    ...statusStyleBase,
                                    color: "#9ca3af",
                                }}
                            >
                                Your info stays private. This form is just a front-end demo
                                until we hook it to your backend or email service.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Background glow orbs */}
            <div
                style={{
                    ...orbBase,
                    top: "45%",
                    left: -120,
                    background:
                        "radial-gradient(circle, rgba(79,70,229,0.5), transparent 70%)",
                }}
            />
            <div
                style={{
                    ...orbBase,
                    top: "10%",
                    right: -130,
                    background:
                        "radial-gradient(circle, rgba(56,189,248,0.45), transparent 70%)",
                }}
            />
        </section>
    );
};

export default Contact;
