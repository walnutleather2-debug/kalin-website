import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-24 pb-16 px-4 lg:px-8 max-w-4xl mx-auto">
                <h1 className="text-4xl font-light text-[#510c74] mb-8">Privacy Policy</h1>

                <div className="prose prose-purple max-w-none text-gray-700 space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold text-[#510c74] mt-8 mb-4">Introduction</h2>
                        <p>
                            Welcome to Mariyae Kalin. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at info@mariyae.com.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[#510c74] mt-8 mb-4">Information We Collect</h2>
                        <p>
                            We collect personal information that you voluntarily provide to us when you register on the Website, express an interest in obtaining information about us or our products, when you participate in activities on the Website or otherwise when you contact us.
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Personal Data:</strong> Name, address, contact information (email and phone number), and payment details.</li>
                            <li><strong>Usage Data:</strong> We automatically collect certain information when you visit, use or navigate the Website. This information does not reveal your specific identity but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, and referring URLs.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[#510c74] mt-8 mb-4">How We Use Your Information</h2>
                        <p>
                            We use personal information collected via our Website for a variety of business purposes described below:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>To facilitate account creation and logon process.</li>
                            <li>To fulfill and manage your orders.</li>
                            <li>To send administrative information to you.</li>
                            <li>To protect our Services and for legal reasons.</li>
                            <li>To send you marketing and promotional communications (you can opt-out at any time).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[#510c74] mt-8 mb-4">How We Share Your Information</h2>
                        <p>
                            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. This includes third-party service providers like payment processors and shipping companies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[#510c74] mt-8 mb-4">Data Security</h2>
                        <p>
                            We aim to protect your personal information through a system of organizational and technical security measures. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[#510c74] mt-8 mb-4">Your Privacy Rights</h2>
                        <p>
                            In some regions, you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[#510c74] mt-8 mb-4">Contact Us</h2>
                        <p>
                            If you have questions or comments about this policy, you may email us at info@mariyae.com or by post to:
                        </p>
                        <p className="mt-2 font-medium">
                            Mariyae Kalin<br />
                            Juhi Niharika Mirage, Sector-10<br />
                            Kharghar, Navi Mumbai - 410210
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    )
}
