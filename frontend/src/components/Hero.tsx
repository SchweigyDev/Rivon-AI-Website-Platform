import { useState, useEffect, useRef } from "react";
import Chatbot from "./Chatbot";
import "../styles/hero.css"; // We'll create this file

const Hero = () => {
    const heroRef = useRef<HTMLDivElement>(null);
    const [showFloating, setShowFloating] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (!heroRef.current) return;
            const rect = heroRef.current.getBoundingClientRect();
            setShowFloating(rect.bottom < 0);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section ref={heroRef} className="hero-section">
            <h1 className="hero-logo">Rivon</h1>
            <p className="hero-tagline">
                AI-powered websites for smarter businesses – chatbots, blogs, and more.
            </p>

            <div className="hero-chat">
                <Chatbot embedded />
            </div>

            <div className="floating-circle purple"></div>
            <div className="floating-circle blue"></div>

            {showFloating && <Chatbot />}
        </section>
    );
};

export default Hero;
