const About = () => {
    const sectionStyle = {
        position: "relative" as const,
        padding: "80px 20px 90px",
        background:
            "radial-gradient(circle at top, #020617 0, #020617 40%, #020617 100%)",
        color: "#e5e7eb",
        textAlign: "center" as const,
    };

    const innerStyle = {
        maxWidth: "960px",
        margin: "0 auto",
    };

    const kickerStyle = {
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
        letterSpacing: "0.04em",
        backgroundImage: "linear-gradient(120deg, #e5e7eb, #a5b4fc, #22d3ee)",
        WebkitBackgroundClip: "text" as const,
        backgroundClip: "text",
        color: "transparent",
    };

    const paragraphStyle = {
        marginTop: 16,
        maxWidth: 720,
        marginLeft: "auto",
        marginRight: "auto",
        fontSize: "0.95rem",
        lineHeight: 1.7,
        color: "#9ca3af",
    };

    const highlightRowStyle = {
        marginTop: 40,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 20,
        textAlign: "left" as const,
    };

    const pillCardStyle = {
        padding: "18px 18px 20px",
        borderRadius: 16,
        border: "1px solid rgba(148,163,184,0.32)",
        background:
            "radial-gradient(circle at top left, rgba(15,23,42,0.85), rgba(15,23,42,0.98))",
        boxShadow:
            "0 16px 30px rgba(15,23,42,0.85), 0 0 0 1px rgba(15,23,42,0.8)",
    };

    const pillTitleStyle = {
        fontSize: "0.9rem",
        fontWeight: 600,
        color: "#e5e7eb",
        marginBottom: 4,
    };

    const pillTaglineStyle = {
        fontSize: "0.78rem",
        textTransform: "uppercase" as const,
        letterSpacing: "0.16em",
        color: "#a5b4fc",
        marginBottom: 6,
    };

    const pillTextStyle = {
        fontSize: "0.85rem",
        color: "#9ca3af",
        lineHeight: 1.6,
    };

    return (
        <section style={sectionStyle} id="about">
            <div style={innerStyle}>
                <p style={kickerStyle}>About Rivon</p>
                <h2 style={titleStyle}>AI-native websites, built for real businesses</h2>
                <p style={paragraphStyle}>
                    Rivon specializes in AI-integrated websites that don&apos;t just look good
                    — they think with you. We build custom chatbots, content responders, and
                    intelligent web tools that help you answer questions faster, qualify leads,
                    and automate the work you shouldn&apos;t be doing by hand.
                </p>

                <div style={highlightRowStyle}>
                    <div style={pillCardStyle}>
                        <p style={pillTaglineStyle}>AI in every build</p>
                        <p style={pillTitleStyle}>Not an add-on, your foundation</p>
                        <p style={pillTextStyle}>
                            Every Rivon site ships with AI baked in from day one — from the
                            chatbot in your hero to smart forms and on-page recommendations.
                        </p>
                    </div>

                    <div style={pillCardStyle}>
                        <p style={pillTaglineStyle}>Done-for-you automation</p>
                        <p style={pillTitleStyle}>We handle the complexity</p>
                        <p style={pillTextStyle}>
                            You bring the business goals, we translate them into flows,
                            prompts, and smart automations that actually save time for your
                            team and your customers.
                        </p>
                    </div>

                    <div style={pillCardStyle}>
                        <p style={pillTaglineStyle}>Future-ready stack</p>
                        <p style={pillTitleStyle}>Built to evolve with you</p>
                        <p style={pillTextStyle}>
                            Modern frameworks, clean architecture, and AI tools that can adapt
                            as your offers, audience, and technology shift over time.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
