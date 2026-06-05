import { useState } from "react";
import { FiMessageCircle, FiCpu, FiGlobe, FiTrendingUp } from "react-icons/fi";

const services = [
    {
        title: "AI Chatbots",
        label: "24/7 Smart Support",
        icon: <FiMessageCircle />,
        description:
            "Custom-trained chatbots that answer questions, qualify leads, and book appointments while you sleep.",
    },
    {
        title: "AI Blog Automation",
        label: "Content on Autopilot",
        icon: <FiCpu />,
        description:
            "SEO-ready posts generated and scheduled automatically, tuned to your brand voice and industry.",
    },
    {
        title: "Smart Websites",
        label: "Built for Conversion",
        icon: <FiGlobe />,
        description:
            "Lightning-fast, responsive sites with AI-personalized sections that adapt to each visitor.",
    },
    {
        title: "Analytics & Insights",
        label: "Smarter Decisions",
        icon: <FiTrendingUp />,
        description:
            "AI-powered dashboards that translate visitor behavior into clear, actionable next steps.",
    },
];

const Services = () => {
    const [hovered, setHovered] = useState<string | null>(null);

    const sectionStyle: React.CSSProperties = {
        position: "relative",
        padding: "80px 20px 100px",
        background:
            "radial-gradient(circle at top, #111827 0, #020617 45%, #020617 100%)",
        color: "#e5e7eb",
        textAlign: "center",
        overflow: "hidden",
    };

    const innerStyle: React.CSSProperties = {
        maxWidth: "1120px",
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
    };

    const headerKickerStyle: React.CSSProperties = {
        display: "inline-flex",
        padding: "4px 12px",
        borderRadius: 999,
        fontSize: "0.75rem",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        background: "rgba(148,163,184,0.1)",
        border: "1px solid rgba(148,163,184,0.35)",
        color: "#a5b4fc",
        backdropFilter: "blur(12px)",
    };

    const titleStyle: React.CSSProperties = {
        marginTop: 16,
        fontSize: "clamp(1.9rem, 3vw, 2.4rem)",
        fontWeight: 700,
        letterSpacing: "0.04em",
        backgroundImage: "linear-gradient(120deg, #e5e7eb, #a5b4fc, #22d3ee)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
    };

    const subtitleStyle: React.CSSProperties = {
        marginTop: 12,
        maxWidth: 640,
        marginLeft: "auto",
        marginRight: "auto",
        fontSize: "0.95rem",
        color: "#9ca3af",
    };

    const gridStyle: React.CSSProperties = {
        marginTop: 40,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
        gap: 24,
        textAlign: "left",
    };

    const cardBaseStyle: React.CSSProperties = {
        position: "relative",
        padding: "24px 22px 26px",
        borderRadius: 18,
        background:
            "radial-gradient(circle at top left, rgba(79,70,229,0.22), rgba(15,23,42,0.98))",
        border: "1px solid rgba(148,163,184,0.35)",
        boxShadow:
            "0 18px 40px rgba(15,23,42,0.9), 0 0 0 1px rgba(15,23,42,0.85)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        transformOrigin: "center",
        transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease, background 200ms ease",
        cursor: "default",
        overflow: "hidden",
    };

    const cardHoverStyle: React.CSSProperties = {
        transform: "translateY(-4px) scale(1.01)",
        borderColor: "rgba(94,234,212,0.9)",
        boxShadow:
            "0 20px 55px rgba(15,23,42,0.95), 0 0 0 1px rgba(56,189,248,0.7)",
        background:
            "radial-gradient(circle at top left, rgba(79,70,229,0.35), rgba(15,23,42,1))",
    };

    const glowBlobStyle: React.CSSProperties = {
        position: "absolute",
        top: -40,
        right: -40,
        width: 120,
        height: 120,
        borderRadius: "999px",
        background:
            "radial-gradient(circle, rgba(129,140,248,0.8), transparent 60%)",
        filter: "blur(4px)",
        opacity: 0.25,
        pointerEvents: "none",
        transition: "opacity 180ms ease, transform 180ms ease",
    };

    const glowBlobHoverStyle: React.CSSProperties = {
        opacity: 0.45,
        transform: "translate(-6px, 6px)",
    };

    const iconWrapStyle: React.CSSProperties = {
        width: 44,
        height: 44,
        borderRadius: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
            "radial-gradient(circle at top, rgba(129,140,248,0.4), rgba(15,23,42,0.95))",
        border: "1px solid rgba(165,180,252,0.8)",
        boxShadow: "0 0 18px rgba(129,140,248,0.7)",
    };

    const iconStyle: React.CSSProperties = {
        fontSize: "1.35rem",
        color: "#e5e7eb",
    };

    const labelStyle: React.CSSProperties = {
        marginTop: 10,
        fontSize: "0.75rem",
        textTransform: "uppercase",
        letterSpacing: "0.16em",
        color: "#a5b4fc",
    };

    const nameStyle: React.CSSProperties = {
        marginTop: 2,
        fontSize: "1.1rem",
        fontWeight: 600,
        color: "#e5e7eb",
    };

    const descriptionStyle: React.CSSProperties = {
        marginTop: 6,
        fontSize: "0.9rem",
        lineHeight: 1.5,
        color: "#9ca3af",
    };

    const ctaStyle: React.CSSProperties = {
        marginTop: 14,
        alignSelf: "flex-start",
        padding: "8px 16px",
        borderRadius: 999,
        border: "1px solid rgba(56,189,248,0.7)",
        background:
            "radial-gradient(circle at top left, rgba(56,189,248,0.22), rgba(15,23,42,1))",
        color: "#e0f2fe",
        fontSize: "0.8rem",
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        cursor: "pointer",
        transition:
            "background 160ms ease, transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
    };

    const ctaHoverStyle: React.CSSProperties = {
        background:
            "radial-gradient(circle at top left, rgba(56,189,248,0.35), rgba(15,23,42,1))",
        borderColor: "rgba(56,189,248,1)",
        transform: "translateY(-1px)",
        boxShadow: "0 10px 25px rgba(8,47,73,0.85)",
    };

    const orbBase: React.CSSProperties = {
        position: "absolute",
        width: 260,
        height: 260,
        borderRadius: 999,
        filter: "blur(24px)",
        opacity: 0.35,
        pointerEvents: "none",
    };

    return (
        <section style={sectionStyle} id="services">
            <div style={innerStyle}>
                <div>
                    <p style={headerKickerStyle}>What Rivon Builds</p>
                    <h2 style={titleStyle}>AI-first services for modern brands</h2>
                    <p style={subtitleStyle}>
                        From the first pixel to the last chatbot reply, every Rivon website
                        is engineered with AI at the core.
                    </p>
                </div>

                <div style={gridStyle}>
                    {services.map((service) => {
                        const isHovered = hovered === service.title;

                        return (
                            <article
                                key={service.title}
                                style={{
                                    ...cardBaseStyle,
                                    ...(isHovered ? cardHoverStyle : {}),
                                }}
                                onMouseEnter={() => setHovered(service.title)}
                                onMouseLeave={() => setHovered(null)}
                            >
                                <div
                                    style={{
                                        ...glowBlobStyle,
                                        ...(isHovered ? glowBlobHoverStyle : {}),
                                    }}
                                />
                                <div style={iconWrapStyle}>
                                    <span style={iconStyle}>{service.icon}</span>
                                </div>
                                <p style={labelStyle}>{service.label}</p>
                                <h3 style={nameStyle}>{service.title}</h3>
                                <p style={descriptionStyle}>
                                    {service.description}
                                </p>
                                <button
                                    style={{
                                        ...ctaStyle,
                                        ...(isHovered ? ctaHoverStyle : {}),
                                    }}
                                    type="button"
                                >
                                    See how it works
                                </button>
                            </article>
                        );
                    })}
                </div>
            </div>

            {/* background glow orbs to visually connect with hero */}
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
                    top: "10%",
                    right: -130,
                    background:
                        "radial-gradient(circle, rgba(56,189,248,0.45), transparent 70%)",
                }}
            />
        </section>
    );
};

export default Services;
