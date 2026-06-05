import { useState, useEffect } from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Navbar = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const links = ["Home", "Templates", "About", "Contact"];

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            style={{
                position: "sticky",
                top: 0,
                zIndex: 50,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 20px",
                background: scrolled ? "rgba(17, 17, 17, 0.95)" : "#111",
                backdropFilter: scrolled ? "blur(8px)" : "none",
                transition: "background 0.3s, backdrop-filter 0.3s",
                color: "white",
                boxShadow: scrolled ? "0 2px 8px rgba(0,0,0,0.4)" : "none",
            }}
        >
            {/* Animated Logo */}
            <div
                className="logo animate-gradient"
                style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    background: "linear-gradient(270deg, #6A00F5, #00D4FF, #6A00F5)",
                    backgroundSize: "600% 600%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: "gradientAnimation 5s ease infinite",
                }}
            >
                Rivon
            </div>

            {/* Desktop Links */}
            {!isMobile && (
                <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                    {links.map((link) => (
                        <a key={link} href={`#${link.toLowerCase()}`} className="nav-link">
                            {link}
                        </a>
                    ))}

                    {/* Social / WhatsBroken Buttons */}
                    <div style={{ display: "flex", gap: "12px", marginLeft: "25px", alignItems: "center" }}>
                        <a href="#" className="social-icon facebook"><FaFacebookF /></a>
                        <a href="#" className="social-icon twitter"><FaTwitter /></a>
                        <a href="#" className="social-icon instagram"><FaInstagram /></a>
                        <button className="cta-button floating-button">Contact</button>
                    </div>
                </div>
            )}

            {/* Mobile Hamburger */}
            {isMobile && (
                <>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`hamburger ${isOpen ? "open" : ""}`}
                        style={{
                            fontSize: "1.8rem",
                            color: "white",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            zIndex: 110,
                            position: "relative",
                            width: "30px",
                            height: "24px",
                        }}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    {isOpen && (
                        <div
                            onClick={() => setIsOpen(false)}
                            style={{
                                position: "fixed",
                                top: 0,
                                left: 0,
                                width: "100vw",
                                height: "100vh",
                                backgroundColor: "rgba(0,0,0,0.5)",
                                zIndex: 100,
                            }}
                        />
                    )}

                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            right: isOpen ? "0" : "-100%",
                            height: "100vh",
                            width: "250px",
                            background: "#111",
                            transition: "right 0.3s ease-in-out",
                            paddingTop: "60px",
                            zIndex: 105,
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {links.map((link) => (
                            <a
                                key={link}
                                href={`#${link.toLowerCase()}`}
                                className="mobile-link"
                                onClick={() => setIsOpen(false)}
                            >
                                {link}
                            </a>
                        ))}

                        <div style={{ display: "flex", justifyContent: "center", padding: "20px", gap: "15px" }}>
                            <a href="#" className="social-icon facebook"><FaFacebookF /></a>
                            <a href="#" className="social-icon twitter"><FaTwitter /></a>
                            <a href="#" className="social-icon instagram"><FaInstagram /></a>
                            <button className="cta-button floating-button">Contact</button>
                        </div>
                    </div>
                </>
            )}

            {/* Styles */}
            <style>
                {`
          @keyframes gradientAnimation {
            0% {background-position: 0% 50%;}
            50% {background-position: 100% 50%;}
            100% {background-position: 0% 50%;}
          }

          .nav-link {
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-weight: 500;
            position: relative;
            text-decoration: none;
            transition: all 0.3s;
          }

          .nav-link::after {
            content: '';
            position: absolute;
            width: 0%;
            height: 2px;
            bottom: 0;
            left: 0;
            background: linear-gradient(90deg, #6A00F5, #00D4FF);
            transition: width 0.3s ease;
            border-radius: 1px;
          }

          .nav-link:hover::after {
            width: 100%;
          }

          .cta-button {
            padding: 6px 14px;
            border-radius: 6px;
            background: linear-gradient(90deg, #6A00F5, #00D4FF);
            color: white;
            font-weight: 500;
            cursor: pointer;
            border: none;
            transition: all 0.3s, box-shadow 0.3s;
            box-shadow: 0 0 0 rgba(106, 0, 245, 0);
          }

          .cta-button:hover, .floating-button:hover {
            transform: scale(1.05);
            box-shadow: 0 0 12px #6A00F5, 0 0 20px #00D4FF;
          }

          .floating-button {
            animation: float 2.5s ease-in-out infinite;
          }

          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }

          .social-icon {
            color: white;
            font-size: 1.2rem;
            transition: all 0.3s ease;
          }

          .social-icon.facebook:hover {
            transform: scale(1.3);
            color: #3b5998;
          }

          .social-icon.twitter:hover {
            transform: scale(1.3);
            color: #1da1f2;
          }

          .social-icon.instagram:hover {
            transform: scale(1.3);
            color: #e1306c;
          }

          .hamburger span {
            display: block;
            height: 3px;
            width: 30px;
            background: white;
            margin: 6px 0;
            border-radius: 2px;
            transition: all 0.3s ease;
          }

          .hamburger.open span:nth-child(1) {
            transform: rotate(45deg) translate(0, 9px);
          }

          .hamburger.open span:nth-child(2) {
            opacity: 0;
          }

          .hamburger.open span:nth-child(3) {
            transform: rotate(-45deg) translate(0, -9px);
          }

          /* Mobile link underline effect */
          .mobile-link {
            color: white;
            text-decoration: none;
            padding: 15px 20px;
            position: relative;
            transition: all 0.3s ease;
          }

          .mobile-link::after {
            content: '';
            position: absolute;
            width: 0%;
            height: 2px;
            bottom: 0;
            left: 0;
            background: linear-gradient(90deg, #6A00F5, #00D4FF);
            transition: width 0.3s ease;
            border-radius: 1px;
          }

          .mobile-link:hover::after {
            width: 100%;
          }
        `}
            </style>
        </nav>
    );
};

export default Navbar;
