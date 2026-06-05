import TemplateCard from "../components/TemplateCard";

const Templates = () => {
    const templates = [
        { name: "Business", description: "Sleek business template" },
        { name: "Portfolio", description: "Showcase your work" },
        { name: "E-commerce", description: "Sell products easily" },
    ];

    return (
        <section className="p-8">
            <h1 className="text-3xl font-bold mb-6">Templates</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {templates.map((t, i) => (
                    <TemplateCard key={i} {...t} />
                ))}
            </div>
        </section>
    );
};

export default Templates;