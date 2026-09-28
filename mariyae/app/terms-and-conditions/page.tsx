import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function TermsAndConditions() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-24 pb-16 px-4 lg:px-8 max-w-4xl mx-auto">
                <h1 className="text-4xl font-light text-[#510c74] mb-8">Terms & Conditions</h1>

                <div className="prose prose-purple max-w-none text-gray-700 space-y-6">
                    <section>
                        <p className="italic">Last updated: January 2024</p>
                        <p>
                            Please read these Terms and Conditions carefully before using the Mariyae Kalin website. Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[#510c74] mt-8 mb-4">1. Product Information</h2>
                        <p>
                            We attempt to be as accurate as possible with the representation of our product variety. However, we do not warrant that product descriptions or other content are accurate, complete, reliable, current, or error-free. Due to the handcrafted nature of our products and screen display settings, slight variations in color and appearance may occur.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[#510c74] mt-8 mb-4">2. Pricing and Payment</h2>
                        <p>
                            All prices are listed in the currency specified on the site and are subject to change without notice. We reserve the right to refuse or cancel any orders placed for products listed at an incorrect price. Payment is required at the time of purchase via our approved payment gateways.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[#510c74] mt-8 mb-4">3. Shipping and Delivery</h2>
                        <p>
                            Delivery times are estimates and start from the date of shipping. We are not responsible for delays caused by shipping carriers or customs clearance. Risk of loss and title for items purchased pass to you upon delivery to the carrier.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[#510c74] mt-8 mb-4">4. Returns and Refunds</h2>
                        <p>
                            Please review our return policy available on the website. Custom-made or personalized pieces are generally non-returnable unless defective.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[#510c74] mt-8 mb-4">5. Intellectual Property</h2>
                        <p>
                            The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of Mariyae Kalin and its licensors. Our designs, logos, and images are protected by copyright and trademark laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[#510c74] mt-8 mb-4">6. Limitation of Liability</h2>
                        <p>
                            In no event shall Mariyae Kalin, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, or other intangible losses, resulting from your access to or use of the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[#510c74] mt-8 mb-4">7. Governing Law</h2>
                        <p>
                            These Terms shall be governed and construed in accordance with the laws of the jurisdiction where Mariyae Kalin is registered, without regard to its conflict of law provisions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[#510c74] mt-8 mb-4">8. Changes</h2>
                        <p>
                            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[#510c74] mt-8 mb-4">Contact Us</h2>
                        <p>
                            If you have any questions about these Terms, please contact us at info@mariyae.com.
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    )
}
