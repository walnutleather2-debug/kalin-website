import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { RotateCcw, CheckCircle2, AlertCircle } from "lucide-react"

export default function ReturnPolicy() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-24 pb-16 px-4 lg:px-8 max-w-4xl mx-auto">
                <div className="flex items-center space-x-3 mb-8">
                    <RotateCcw className="w-8 h-8 text-[#510c74]" />
                    <h1 className="text-4xl font-light text-[#510c74]">7 Day Return Policy</h1>
                </div>

                <div className="prose prose-purple max-w-none text-gray-700 space-y-8">
                    <section className="bg-[#fff4df]/30 p-6 rounded-2xl border border-[#510c74]/10">
                        <h2 className="text-2xl font-semibold text-[#510c74] mt-0 mb-4 flex items-center">
                            <CheckCircle2 className="w-6 h-6 mr-2 text-green-600" />
                            Easy Returns Within 7 Days
                        </h2>
                        <p className="text-lg">
                            At Mariyae Kalin, we want you to be completely satisfied with your purchase. If for any reason you are not happy with your product, you can return it within <strong>7 days</strong> from the date of delivery.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[#510c74] mb-4">Conditions for Return</h2>
                        <ul className="list-none space-y-4 pl-0">
                            <li className="flex items-start">
                                <div className="w-6 h-6 rounded-full bg-[#510c74] flex-shrink-0 flex items-center justify-center text-white text-xs mt-1 mr-3">1</div>
                                <p>The item must be in its original condition, unworn, and unused.</p>
                            </li>
                            <li className="flex items-start">
                                <div className="w-6 h-6 rounded-full bg-[#510c74] flex-shrink-0 flex items-center justify-center text-white text-xs mt-1 mr-3">2</div>
                                <p>All original packaging, tags, and authenticity certificates must be intact.</p>
                            </li>
                            <li className="flex items-start">
                                <div className="w-6 h-6 rounded-full bg-[#510c74] flex-shrink-0 flex items-center justify-center text-white text-xs mt-1 mr-3">3</div>
                                <p>Custom-made or personalized product pieces are not eligible for returns unless they arrive damaged or defective.</p>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[#510c74] mb-4">The Return Process</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-5 border border-gray-200 rounded-xl">
                                <h3 className="font-bold mb-2">Step 1: Initiation</h3>
                                <p className="text-sm">Contact our support team at info@mariyae.com or call us at +91 7045932672 within 7 days of receiving your order.</p>
                            </div>
                            <div className="p-5 border border-gray-200 rounded-xl">
                                <h3 className="font-bold mb-2">Step 2: Verification</h3>
                                <p className="text-sm">We will guide you through the return process and provide instructions for the courier pickup.</p>
                            </div>
                        </div>
                    </section>

                    <section className="bg-red-50 p-6 rounded-2xl border border-red-100 flex items-start">
                        <AlertCircle className="w-6 h-6 text-red-600 mr-4 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="text-red-900 font-bold mb-1">Important Note</h3>
                            <p className="text-red-800 text-sm">
                                Shipping costs for returns may apply unless the return is due to a quality issue or shipping error on our part. We will inform you of the exact shipping terms during the return initiation.
                            </p>
                        </div>
                    </section>

                    <section className="text-center pt-8">
                        <p className="text-gray-500 italic">
                            Timeless product variety deserves a perfect experience. We are here to ensure yours is nothing less.
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    )
}
