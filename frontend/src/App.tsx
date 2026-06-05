// App.tsx
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Features from "./components/Features";
import Footer from "./components/Footer";
import TemplateCard from "./components/TemplateCard";
import Contact from "./components/Contact";

function App() {
    return (
        <div className="App" style={{ fontFamily: "sans-serif", color: "#fff", background: "#111" }}>
            <Navbar />
            <Hero />

            <About />
            <Services />
            <Features />
            <TemplateCard />
            <Contact />
            <Footer />
        </div>
    );
}

export default App;
