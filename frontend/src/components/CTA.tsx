import { Link } from "react-router-dom";

export default function CTA() {
    return (
        <section className="py-20 bg-blue-50 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="mb-6 text-gray-700">Join thousands of businesses already using RYVO websites.</p>
            <Link to="/contact" className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-500 transition">Sign Up Now</Link>
        </section>
    );
}