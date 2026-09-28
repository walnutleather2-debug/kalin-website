"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

export default function FAQPage() {
    const faqs = [
        {
            category: "General",
            questions: [
                {
                    q: "What is Mariyae Kalin?",
                    a: "Mariyae Kalin is a premium brand offering an extensive product variety, founded in 1998. We specialize in crafting exquisite, high-quality products that blend timeless elegance with contemporary craftsmanship."
                },
                {
                    q: "Are the product pieces handcrafted?",
                    a: "Yes, many of our pieces involve a high degree of manual craftsmanship. Due to this nature, slight variations in color and appearance may occur, making each piece unique."
                },
                {
                    q: "Are your products durable?",
                    a: "While our product variety is crafted with high-quality materials and finishes, we recommend taking proper care to maintain their appearance and longevity for years to come."
                }
            ]
        },
        {
            category: "Orders & Shipping",
            questions: [
                {
                    q: "How can I track my order?",
                    a: "Once your order is shipped, you will receive a tracking ID via email. You can use this ID on our courier partner's website to monitor your delivery status."
                },
                {
                    q: "What are the shipping charges?",
                    a: "Shipping charges may vary based on your location and the total order value. Regular shipping terms will be provided during the checkout process."
                },
                {
                    q: "How long does delivery take?",
                    a: "Delivery times are estimates. Typically, orders are processed within 1-2 business days and delivered within 5-7 business days, depending on your location."
                }
            ]
        },
        {
            category: "Payments & Razorpay",
            questions: [
                {
                    q: "What payment methods are supported?",
                    a: "We accept all major payment methods powered securely by Razorpay: UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, MasterCard, RuPay), Net Banking (50+ banks), digital wallets, and Cash on Delivery (COD)."
                },
                {
                    q: "Is it safe to pay online on Mariyae Kalin?",
                    a: "Yes, 100%. All online transactions are processed through Razorpay's PCI-DSS Level 1 certified gateway with 256-bit bank-grade SSL encryption. We do not store your card or banking credentials."
                },
                {
                    q: "What happens if money was debited but the order failed?",
                    a: "In the rare event of a network disruption where money is deducted but your order isn't confirmed, Razorpay automatically initiates a refund back to your original payment source within 5 to 7 business days. You can also contact us at info@mariyae.com with your payment reference ID."
                },
                {
                    q: "Is Cash on Delivery (COD) available?",
                    a: "Yes! Cash on Delivery is available across most serviceable pin codes across India. You can pay in cash to the delivery partner once your package arrives."
                }
            ]
        },
        {
            category: "Returns & Refunds",
            questions: [
                {
                    q: "What is your return policy?",
                    a: "We offer a 7-day return policy. If you are not satisfied with your purchase, you can initiate a return within 7 days of delivery, provided the item is in its original, unworn condition with all tags intact."
                },
                {
                    q: "Can I return personalized items?",
                    a: "Custom-made or personalized product pieces are not eligible for returns unless they arrive damaged or defective, as per our Terms and Conditions."
                },
                {
                    q: "How do I initiate a return?",
                    a: "To start a return, please contact our support team at info@mariyae.com or call us at +91 7045932672. We will guide you through the verification and pickup process."
                }
            ]
        },
        {
            category: "Privacy & Security",
            questions: [
                {
                    q: "Is my personal data safe?",
                    a: "Absolutely. We use organizational and technical security measures to protect your personal information. Please refer to our Privacy Policy for more details on how we handle your data."
                },
                {
                    q: "Do you share my information with third parties?",
                    a: "We only share your information with your consent or when necessary to fulfill your orders (e.g., with shipping companies and payment processors) or to comply with legal requirements."
                }
            ]
        }
    ]

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-24 pb-16 px-4 lg:px-8 max-w-4xl mx-auto">
                <div className="flex items-center space-x-3 mb-8">
                    <HelpCircle className="w-8 h-8 text-[#510c74]" />
                    <h1 className="text-4xl font-light text-[#510c74]">Frequently Asked Questions</h1>
                </div>

                <p className="text-gray-600 mb-12 text-lg">
                    Find answers to common questions about our products, orders, and policies.
                    If you can't find what you're looking for, feel free to contact us.
                </p>

                <div className="space-y-12">
                    {faqs.map((group, idx) => (
                        <div key={idx}>
                            <h2 className="text-2xl font-semibold text-[#240334] mb-6 border-b border-gray-100 pb-2">
                                {group.category}
                            </h2>
                            <Accordion type="single" collapsible className="w-full">
                                {group.questions.map((item, qIdx) => (
                                    <AccordionItem key={qIdx} value={`item-${idx}-${qIdx}`}>
                                        <AccordionTrigger className="text-left text-[#510c74] hover:text-[#240334] font-medium py-4">
                                            {item.q}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-gray-600 leading-relaxed text-base">
                                            {item.a}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    ))}
                </div>

                <div className="mt-20 bg-[#fff4df]/50 p-8 rounded-2xl border border-[#510c74]/10 text-center">
                    <h3 className="text-xl font-semibold text-[#510c74] mb-4">Still have questions?</h3>
                    <p className="text-gray-600 mb-6">
                        Our customer service team is here to help you.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="mailto:info@mariyae.com"
                            className="px-8 py-3 bg-[#510c74] text-white rounded-full hover:bg-[#240334] transition-colors"
                        >
                            Email Us
                        </a>
                        <a
                            href="tel:+917045932672"
                            className="px-8 py-3 border border-[#510c74] text-[#510c74] rounded-full hover:bg-[#fff4df] transition-colors"
                        >
                            Call Us
                        </a>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
