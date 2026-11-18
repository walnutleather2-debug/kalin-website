import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { FileText, Mail, Phone, MapPin } from "lucide-react"

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="h-20"></div>

      <div className="pt-8 pb-16 px-4 lg:px-8 max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#fff4df] border border-[#510c74]/20">
            <FileText className="w-6 h-6 text-[#510c74]" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-[#240334]">Terms and Conditions</h1>
            <p className="text-sm text-gray-500 mt-1">Last updated: January 2025 • Bhadohi Kaleen</p>
          </div>
        </div>

        <div className="prose prose-purple max-w-none text-gray-700 space-y-8">
          <section className="bg-[#fff4df]/40 p-6 rounded-2xl border border-[#510c74]/15">
            <p className="text-base text-gray-800 leading-relaxed mb-0">
              Please read these Terms and Conditions carefully before using the <strong>Bhadohi Kaleen</strong> website. Your access to and use of this website and services are conditioned on your acceptance of and compliance with these Terms. By browsing or purchasing from our platform, you agree to be bound by these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#510c74] mb-3">1. Merchant & Business Details</h2>
            <p>
              This website is operated by <strong>Bhadohi Kaleen</strong>, having its principal registered office at <strong>Juhi Niharika Mirage, Sector-10, Kharghar, Navi Mumbai, Maharashtra - 410210, India</strong>. Throughout the site, the terms "we", "us", and "our" refer to Bhadohi Kaleen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#510c74] mb-3">2. Products & Accuracy of Information</h2>
            <p>
              We specialize in offering high-quality handcrafted kaleen, carpets, rugs, and luxury home textile varieties. We take utmost care in accurately displaying product images, colors, and descriptions. However, because our products incorporate handwoven and artisanal craftsmanship, slight natural variations in weave texture, shading, and dimensions may occur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#510c74] mb-3">3. Pricing & Currency</h2>
            <p>
              All product prices are quoted in <strong>Indian Rupees (INR / ₹)</strong> and are inclusive of all statutory goods and services taxes (GST) unless explicitly stated otherwise. We reserve the right to revise product prices at any time prior to order placement.
            </p>
          </section>

          {/* Payments Section */}
          <section className="bg-purple-50/70 p-6 rounded-2xl border border-[#510c74]/20">
            <h2 className="text-2xl font-semibold text-[#510c74] mb-3">4. Online Payments & Razorpay Integration</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-800">
              <li>
                Online payments are securely processed through our authorized payment partner, <strong>Razorpay Software Private Limited</strong>.
              </li>
              <li>
                We support UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit cards (Visa, MasterCard, RuPay), Net Banking (over 50 Indian banks), and verified digital wallets.
              </li>
              <li>
                You confirm that the payment instrument used belongs to you or that you have express authorization from the cardholder to complete the purchase.
              </li>
              <li>
                All transactions are encrypted with 256-bit bank-level SSL encryption and verified via 3D Secure OTP authentication.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#510c74] mb-3">5. Shipping, Delivery & Cancellations</h2>
            <p>
              Orders are dispatched and delivered in accordance with our <a href="/shipping-policy" className="text-[#510c74] underline font-medium">Shipping & Delivery Policy</a>. Cancellations, returns, and refunds are governed strictly by our <a href="/return-policy" className="text-[#510c74] underline font-medium">Return, Refund & Cancellation Policy</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#510c74] mb-3">6. Intellectual Property Rights</h2>
            <p>
              All trademarks, product names, logos, product imagery, web graphics, and content published on this site are the exclusive intellectual property of <strong>Bhadohi Kaleen</strong>. Unauthorized copying, distribution, or commercial reproduction is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#510c74] mb-3">7. Limitation of Liability</h2>
            <p>
              In no event shall Bhadohi Kaleen, its founders, directors, employees, or partners be liable for any indirect, incidental, consequential, or punitive damages arising from the use of, or inability to use, our website or products.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#510c74] mb-3">8. Governing Law & Jurisdiction</h2>
            <p>
              These Terms and Conditions shall be governed by, interpreted, and construed in accordance with the substantive laws of <strong>India</strong>. Any disputes arising out of or related to these Terms or purchases made on our platform shall be subject to the exclusive jurisdiction of the competent courts in <strong>Navi Mumbai / Mumbai, Maharashtra, India</strong>.
            </p>
          </section>

          <section className="pt-4 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-[#510c74] mb-4">9. Contact Information</h2>
            <p className="mb-4">
              If you have any questions or require clarifications regarding these Terms and Conditions, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-2 text-sm">
              <p className="font-semibold text-gray-900">Bhadohi Kaleen</p>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#510c74]" />
                <span>Email: <a href="mailto:contact@bhadohikaleen.com" className="text-[#510c74] font-medium hover:underline">contact@bhadohikaleen.com</a></span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#510c74]" />
                <span>Phone: <a href="tel:+917045932672" className="text-[#510c74] font-medium hover:underline">+91 7045932672</a></span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#510c74] mt-0.5" />
                <span className="text-gray-600">Address: Juhi Niharika Mirage, Sector-10, Kharghar, Navi Mumbai, Maharashtra - 410210, India</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}
