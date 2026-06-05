import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
    const [open, setOpen] = useState(false);

    return (
        <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold">RYVO</Link>
                <button className="md:hidden" onClick={() => setOpen(!open)}>☰</button>
                <nav className={`flex-col md:flex md:flex-row md:space-x-6 ${open ? "flex" : "hidden"} md:flex`}>
                    <Link to="/" className="hover:text-gray-200 py-2 md:py-0">Home</Link>
                    <Link to="/templates" className="hover:text-gray-200 py-2 md:py-0">Templates</Link>
                    <Link to="/about" className="hover:text-gray-200 py-2 md:py-0">About</Link>
                    <Link to="/contact" className="hover:text-gray-200 py-2 md:py-0">Contact</Link>
                </nav>
            </div>
        </header>
    );
}
