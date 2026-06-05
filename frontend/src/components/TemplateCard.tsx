import { useState } from "react";

type PlanId = "basic" | "standard" | "premium";

const plans: { id: PlanId; name: string; label: string; priceRange: string; blurb: string }[] = [
    {
        id: "basic",
        name: "Basic",
        label: "Launch-ready",
        priceRange: "$2,000 – $4,000",
        blurb: "Perfect for solo founders and small teams taking their first AI step.",
    },
    {
        id: "standard",
        name: "Standard",
        label: "Growth-focused",
        priceRange: "$5,000 – $8,000",
        blurb: "For growing businesses that want content + automation built in.",
    },
    {
        id: "premium",
        name: "Premium",
        label: "Full AI system",
        priceRange: "$10,000 – $20,000+",
        blurb: "For brands that want a flagship AI experience and deep integration.",
    },
];

const templates = [
    {
        title: "Launch Lite",
        tier: "basic" as PlanId,
        useCase: "Consultants, solo founders, local services.",
        summary: "A clean 5-page AI-ready site with a homepage chatbot and lead capture.",
        includes: ["Hero chatbot", "FAQ automation", "Lead form routing"],
    },
    {
        title: "Content Engine",
        tier: "standard" as PlanId,
        useCase: "Coaches, agencies, education, media.",
        summary: "Blog-heavy layout with AI-assisted posting and smart content hubs.",
        includes: ["AI blog assistant", "Topic hubs", "SEO-friendly structure"],
    },
    {
        title: "Lead Machine",
        tier: "standard" as PlanId,
        useCase: "Service businesses and B2B teams.",
        summary: "Landing-page focused layout built to drive calls, demos, and signups.",
        includes: ["Qualification chatbot", "Multi-step forms", "Conversion tracking"],
    },
    {
        title: "AI Flagship",
        tier: "premium" as PlanId,
        useCase: "SaaS, platforms, and bigger brands.",
        summary: "Full-site experience with voice, AI search, and personalized sections.",
        includes: ["AI search", "Personalized sections", "Voice-ready chatbot"],
    },
];

const Templates = () => {
    const [activePlan, setActivePlan] = useState<PlanId>("standard");

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
        backgroundImage: "linear-gradient(120deg, #e5e7eb, #a5b4fc, #22d3ee)",
        WebkitBackgroundClip: "text" as const,
        backgroundClip: "text",
        color: "transparent",
    };

    const subtitleStyle = {
        marginTop: 14,
        maxWidth: 700,
        marginLeft: "auto",
        marginRight: "auto",
        fontSize: "0.95rem",
        color: "#9ca3af",
    };

    // ribbon container
    const ribbonContainer = {
        marginTop: 32,
        padding: "10px 10px",
        borderRadius: 999,
        background:
            "linear-gradient(90deg, rgba(79,70,229,0.25), rgba(56,189,248,0.18))",
        border: "1px solid rgba(148,163,184,0.5)",
        boxShadow:
            "0 18px 40px rgba(15,23,42,0.9), 0 0 0 1px rgba(15,23,42,0.9)",
        display: "flex",
        gap: 8,
        justifyContent: "center",
        flexWrap: "wrap" as const,
    };

    const ribbonButtonBase = {
        minWidth: 140,
        padding: "10px 16px",
        borderRadius: 999,
        border: "1px solid transparent",
        background: "rgba(15,23,42,0.9)",
        color: "#e5e7eb",
        fontSize: "0.85rem",
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "flex-start" as const,
        cursor: "pointer",
        transition:
            "background 160ms ease, color 160ms ease, border-color 160ms ease, box-shadow 160ms ease, transform 140ms ease",
    };

    const ribbonButtonActive = {
        background:
            "radial-gradient(circle at top left, rgba(56,189,248,0.3), rgba(15,23,42,1))",
        border: "1px solid rgba(56,189,248,0.9)",
        boxShadow: "0 10px 25px rgba(8,47,73,0.9)",
        transform: "translateY(-1px)",
    };

    const ribbonLabelStyle = {
        fontSize: "0.7rem",
        textTransform: "uppercase" as const,
        letterSpacing: "0.16em",
        color: "#a5b4fc",
        marginBottom: 4,
    };

    const ribbonNameStyle = {
        fontSize: "0.95rem",
        fontWeight: 600,
    };

    const ribbonPriceStyle = {
        marginTop: 2,
        fontSize: "0.78rem",
        color: "#9ca3af",
    };

    const ribbonBlurbStyle = {
        marginTop: 4,
        fontSize: "0.78rem",
        color: "#9ca3af",
        maxWidth: 260,
    };

    const templatesGrid = {
        marginTop: 36,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 24,
        textAlign: "left" as const,
    };

    const templateCardBase = {
        position: "relative" as const,
        padding: "22px 20px 22px",
        borderRadius: 18,
        border: "1px solid rgba(148,163,184,0.4)",
        background:
            "radial-gradient(circle at top left, rgba(15,23,42,0.95), rgba(15,23,42,1))",
        boxShadow:
            "0 18px 36px rgba(15,23,42,0.9), 0 0 0 1px rgba(15,23,42,0.85)",
        overflow: "hidden" as const,
        transition:
            "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease, background 200ms ease",
    };

    const templateCardHover = {
        transform: "translateY(-4px)",
        borderColor: "rgba(94,234,212,0.9)",
        background:
            "radial-gradient(circle at top left, rgba(79,70,229,0.32), rgba(15,23,42,1))",
        boxShadow:
            "0 22px 52px rgba(15,23,42,0.96), 0 0 0 1px rgba(56,189,248,0.7)",
    };

    const templateTierTag = {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: "0.7rem",
        textTransform: "uppercase" as const,
        letterSpacing: "0.16em",
        color: "#bbf7d0",
        background: "rgba(22,163,74,0.12)",
        border: "1px solid rgba(74,222,128,0.6)",
        marginBottom: 8,
    };

    const templateTitleStyle = {
        fontSize: "1.05rem",
        fontWeight: 600,
        color: "#e5e7eb",
        marginBottom: 4,
    };

    const templateUseCaseStyle = {
        fontSize: "0.78rem",
        textTransform: "uppercase" as const,
        letterSpacing: "0.14em",
        color: "#a5b4fc",
        marginBottom: 8,
    };

    const templateSummaryStyle = {
        fontSize: "0.9rem",
        color: "#9ca3af",
        lineHeight: 1.5,
        marginBottom: 10,
    };

    const templateList = {
        fontSize: "0.82rem",
        color: "#9ca3af",
        listStyleType: "disc" as const,
        paddingLeft: 16,
        marginTop: 4,
    };

    const templateGlow = {
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

    const noteStyle = {
        marginTop: 20,
        fontSize: "0.8rem",
        color: "#9ca3af",
        opacity: 0.95,
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

    const filteredTemplates = templates.filter((tpl) => tpl.tier === activePlan);

    return (
        <section style={sectionStyle} id="templates">
            <div style={innerStyle}>
                <p style={kickerStyle}>Templates</p>
                <h2 style={titleStyle}>Launch-ready layouts for every plan</h2>
                <p style={subtitleStyle}>
                    Pick a starting point that matches your stage. Every template comes
                    with Rivon&apos;s AI features baked in — then we customize it around
                    your brand, offers, and audience.
                </p>

                {/* Plan Ribbon */}
                <div style={ribbonContainer}>
                    {plans.map((plan) => {
                        const isActive = plan.id === activePlan;
                        return (
                            <button
                                key={plan.id}
                                type="button"
                                onClick={() => setActivePlan(plan.id)}
                                style={{
                                    ...ribbonButtonBase,
                                    ...(isActive ? ribbonButtonActive : {}),
                                }}
                            >
                                <span style={ribbonLabelStyle}>{plan.label}</span>
                                <span style={ribbonNameStyle}>{plan.name} plan</span>
                                <span style={ribbonPriceStyle}>{plan.priceRange}</span>
                                <span style={ribbonBlurbStyle}>{plan.blurb}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Templates grid for selected plan */}
                <div style={templatesGrid}>
                    {filteredTemplates.map((tpl) => (
                        <article
                            key={tpl.title}
                            style={templateCardBase}
                            onMouseEnter={(e) =>
                                Object.assign(
                                    (e.currentTarget as HTMLDivElement).style,
                                    templateCardHover
                                )
                            }
                            onMouseLeave={(e) =>
                                Object.assign(
                                    (e.currentTarget as HTMLDivElement).style,
                                    templateCardBase
                                )
                            }
                        >
                            <div style={templateGlow} />
                            <div style={templateTierTag}>
                                <span
                                    style={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: 999,
                                        backgroundColor: "#4ade80",
                                    }}
                                />
                                <span>{tpl.tier.toUpperCase()} TEMPLATE</span>
                            </div>
                            <h3 style={templateTitleStyle}>{tpl.title}</h3>
                            <p style={templateUseCaseStyle}>{tpl.useCase}</p>
                            <p style={templateSummaryStyle}>{tpl.summary}</p>
                            <ul style={templateList}>
                                {tpl.includes.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>

                <p style={noteStyle}>
                    Not sure which template or plan fits? We can start with a quick call,
                    match your goals to a plan, and customize from there.
                </p>
            </div>

            {/* Background orbs to match the rest of the site */}
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
                    top: "8%",
                    right: -130,
                    background:
                        "radial-gradient(circle, rgba(56,189,248,0.45), transparent 70%)",
                }}
            />
        </section>
    );
};

export default Templates;
