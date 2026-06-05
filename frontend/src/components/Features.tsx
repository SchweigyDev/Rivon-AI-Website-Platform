import { useState } from "react";
import { FiUsers, FiCpu, FiClock, FiStar } from "react-icons/fi";

const reasons = [
    {
        title: "AI is the starting point, not an add-on",
        description:
            "Most agencies bolt AI on at the end. Rivon designs your site, content, and flows around AI from day one, so everything works together.",
        icon: <FiCpu />,
    },
    {
        title: "Strategy + build in the same team",
        description:
            "We don’t just ship pages. We help you map journeys, prompts, automations, and KPI goals so your site is a real growth engine.",
        icon: <FiUsers />,
    },
    {
        title: "Fast iteration, long-term partnership",
        description:
            "Launch quickly, then keep improving with data. We stick around with updates, tuning, and new AI features as your business evolves.",
        icon: <FiClock />,
    },
];

const Features = () => {
    const [hovered, setHovered] = useState<string | null>(null);

    const sectionStyle = {
        position: "relative" as const,
        padding: "80px 20px 100px",
        background:
            "radial-gradient(circle at bottom, #020617 0%, #020617 60%, #000 100%)",
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

    const pillStyle = {
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

    const layoutStyle = {
        marginTop: 48,
        display: "grid",
        gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1.4fr)",
        gap: 32,
        alignItems: "flex-start",
    } as const;

    const layoutStackOnMobile: React.CSSProperties = {
        ...layoutStyle,
        gridTemplateColumns: "minmax(0,1fr)",
    };

    const reasonsColumnStyle = {
        display: "flex",
        flexDirection: "column" as const,
        gap: 18,
        textAlign: "left" as const,
    };

    const reasonRowBase = {
        display: "grid",
        gridTemplateColumns: "auto minmax(0,1fr)",
        gap: 14,
        padding: "16px 16px 18px",
        borderRadius: 16,
        border: "1px solid rgba(148,163,184,0.35)",
        background:
            "radial-gradient(circle at top left, rgba(15,23,42,0.9), rgba(15,23,42,0.98))",
        boxShadow:
            "0 16px 32px rgba(15,23,42,0.9), 0 0 0 1px rgba(15,23,42,0.8)",
        transition:
            "transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease, background 200ms ease",
    };

    const reasonRowHover = {
        transform: "translateY(-3px)",
        borderColor: "rgba(94,234,212,0.9)",
        background:
            "radial-gradient(circle at top left, rgba(79,70,229,0.35), rgba(15,23,42,1))",
        boxShadow:
            "0 22px 48px rgba(15,23,42,0.95), 0 0 0 1px rgba(56,189,248,0.65)",
    };

    const iconWrapStyle = {
        width: 40,
        height: 40,
        borderRadius: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
            "radial-gradient(circle at top, rgba(129,140,248,0.4), rgba(15,23,42,0.9))",
        border: "1px solid rgba(165,180,252,0.8)",
        boxShadow: "0 0 18px rgba(129,140,248,0.7)",
        marginTop: 4,
    };

    const iconStyle = {
        fontSize: "1.3rem",
        color: "#e5e7eb",
    };

    const reasonTitleStyle = {
        fontSize: "1rem",
        fontWeight: 600,
        color: "#e5e7eb",
        marginBottom: 4,
    };

    const reasonTextStyle = {
        fontSize: "0.9rem",
        color: "#9ca3af",
        lineHeight: 1.6,
    };

    const comparisonCardStyle = {
        borderRadius: 20,
        border: "1px solid rgba(148,163,184,0.45)",
        background:
            "radial-gradient(circle at top, rgba(15,23,42,1), rgba(15,23,42,0.98))",
        boxShadow:
            "0 20px 45px rgba(15,23,42,0.95), 0 0 0 1px rgba(15,23,42,0.9)",
        padding: "22px 20px 20px",
        textAlign: "left" as const,
        position: "relative" as const,
        overflow: "hidden" as const,
    };

    const comparisonGlow = {
        position: "absolute" as const,
        top: -40,
        right: -40,
        width: 120,
        height: 120,
        borderRadius: 999,
        background:
            "radial-gradient(circle, rgba(56,189,248,0.7), transparent 65%)",
        filter: "blur(8px)",
        opacity: 0.3,
        pointerEvents: "none" as const,
    };

    const comparisonTitle = {
        fontSize: "0.95rem",
        textTransform: "uppercase" as const,
        letterSpacing: "0.16em",
        color: "#a5b4fc",
        marginBottom: 4,
    };

    const comparisonHeadline = {
        fontSize: "1.1rem",
        fontWeight: 600,
        color: "#e5e7eb",
        marginBottom: 10,
    };

    const comparisonBody = {
        fontSize: "0.86rem",
        color: "#9ca3af",
        marginBottom: 12,
        lineHeight: 1.5,
    };

    const comparisonGrid = {
        display: "grid",
        gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
        gap: 10,
        fontSize: "0.82rem",
    };

    const comparisonColumnLabel = {
        fontSize: "0.78rem",
        textTransform: "uppercase" as const,
        letterSpacing: "0.16em",
        marginBottom: 4,
    };

    const rivonLabelColor = { color: "#bbf7d0" }; // light green
    const agencyLabelColor = { color: "#fca5a5" }; // light red

    const bulletRow = {
        display: "flex",
        alignItems: "flex-start",
        gap: 6,
        marginBottom: 4,
    };

    const bulletIcon = {
        marginTop: 2,
        fontSize: "0.85rem",
    };

    const bulletText = {
        lineHeight: 1.5,
    };

    const noteStyle = {
        marginTop: 16,
        fontSize: "0.78rem",
        color: "#9ca3af",
        opacity: 0.9,
    };

    // simple responsive tweak: stack columns on narrow screens
    const isNarrow = typeof window !== "undefined" && window.innerWidth < 900;
    const appliedLayoutStyle = isNarrow ? layoutStackOnMobile : layoutStyle;

    const orbBase = {
        position: "absolute" as const,
        width: 260,
        height: 260,
        borderRadius: 999,
        filter: "blur(24px)",
        opacity: 0.35,
        pointerEvents: "none" as const,
    };

    return (
        <section style={sectionStyle} id="features">
            <div style={innerStyle}>
                <p style={pillStyle}>Why choose Rivon</p>
                <h2 style={titleStyle}>More than a website — a smarter partner</h2>
                <p style={subtitleStyle}>
                    Rivon is built for teams that want more than “just a new site”.
                    We focus on long-term growth, automation, and giving you a real AI edge.
                </p>

                <div style={appliedLayoutStyle}>
                    {/* LEFT: Reasons */}
                    <div style={reasonsColumnStyle}>
                        {reasons.map((r) => {
                            const isHovered = hovered === r.title;
                            return (
                                <div
                                    key={r.title}
                                    style={{
                                        ...reasonRowBase,
                                        ...(isHovered ? reasonRowHover : {}),
                                    }}
                                    onMouseEnter={() => setHovered(r.title)}
                                    onMouseLeave={() => setHovered(null)}
                                >
                                    <div style={iconWrapStyle}>
                                        <span style={iconStyle}>{r.icon}</span>
                                    </div>
                                    <div>
                                        <h3 style={reasonTitleStyle}>{r.title}</h3>
                                        <p style={reasonTextStyle}>{r.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* RIGHT: Comparison Card */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <div style={comparisonCardStyle}>
                            <div style={comparisonGlow} />
                            <p style={comparisonTitle}>Rivon vs typical agency</p>
                            <h3 style={comparisonHeadline}>Designed for the AI era</h3>
                            <p style={comparisonBody}>
                                Instead of a one-and-done handoff, we design with data,
                                iteration, and automation in mind — so your site keeps
                                getting smarter over time.
                            </p>

                            <div style={comparisonGrid}>
                                <div>
                                    <p
                                        style={{
                                            ...comparisonColumnLabel,
                                            ...rivonLabelColor,
                                        }}
                                    >
                                        Rivon
                                    </p>
                                    <div style={bulletRow}>
                                        <span style={bulletIcon}>✅</span>
                                        <span style={bulletText}>
                                            AI-first architecture, from layout to flows.
                                        </span>
                                    </div>
                                    <div style={bulletRow}>
                                        <span style={bulletIcon}>✅</span>
                                        <span style={bulletText}>
                                            Strategic prompts, automations, and analytics.
                                        </span>
                                    </div>
                                    <div style={bulletRow}>
                                        <span style={bulletIcon}>✅</span>
                                        <span style={bulletText}>
                                            Ongoing tuning instead of a one-time build.
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <p
                                        style={{
                                            ...comparisonColumnLabel,
                                            ...agencyLabelColor,
                                        }}
                                    >
                                        Typical agency
                                    </p>
                                    <div style={bulletRow}>
                                        <span style={bulletIcon}>⚠️</span>
                                        <span style={bulletText}>
                                            Static pages with AI bolted on at the end.
                                        </span>
                                    </div>
                                    <div style={bulletRow}>
                                        <span style={bulletIcon}>⚠️</span>
                                        <span style={bulletText}>
                                            Limited or no automation strategy.
                                        </span>
                                    </div>
                                    <div style={bulletRow}>
                                        <span style={bulletIcon}>⚠️</span>
                                        <span style={bulletText}>
                                            Project ends when the site goes live.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p style={noteStyle}>
                            We also keep everything transparent: you own your stack, content,
                            and AI workflows — no weird lock-in or hidden tools.
                        </p>
                    </div>
                </div>
            </div>

            {/* Background orbs to connect with the rest of the site */}
            <div
                style={{
                    ...orbBase,
                    top: "40%",
                    left: -120,
                    background:
                        "radial-gradient(circle, rgba(79,70,229,0.5), transparent 70%)",
                }}
            />
            <div
                style={{
                    ...orbBase,
                    top: "12%",
                    right: -130,
                    background:
                        "radial-gradient(circle, rgba(56,189,248,0.45), transparent 70%)",
                }}
            />
        </section>
    );
};

export default Features;
