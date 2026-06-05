export default function Contact() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 max-w-lg">
                <h2 className="text-3xl font-bold mb-6">Contact RYVO</h2>
                <form className="flex flex-col gap-4">
                    <input type="text" placeholder="Name" className="border p-3 rounded"/>
                    <input type="email" placeholder="Email" className="border p-3 rounded"/>
                    <textarea placeholder="Message" className="border p-3 rounded"/>
                    <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500 transition">Send Message</button>
                </form>
            </div>
        </section>
    );
}