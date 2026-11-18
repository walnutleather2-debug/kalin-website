import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Shield, Lock, Eye, Mail, Phone, MapPin } from "lucide-react"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="h-20"></div>

      <div className="pt-8 pb-16 px-4 lg:px-8 max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#fff4df] border border-[#510c74]/20">
            <Shield className="w-6 h-6 text-[#510c74]" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-[#240334]">Privacy Policy</h1>
            <p className="text-sm text-gray-500 mt-1">Last updated: January 2025 • Bhadohi Kaleen</p>
          </div>
        </div>

        <div className="prose prose-purple max-w-none text-gray-700 space-y-8">
          <section className="bg-[#fff4df]/40 p-6 rounded-2xl border border-[#510c74]/15">
            <p className="text-base text-gray-800 leading-relaxed mb-0">
              Welcome to <strong>Bhadohi Kaleen</strong> ("we", "our", or "us"). We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you visit our website or make a purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#510c74] mb-3 flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#510c74]" />
              1. Information We Collect
            </h2>
            <p>We collect information that you voluntarily provide to us when placing an order, registering an account, or contacting our customer service:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Contact & Identity Data:</strong> Your full name, billing address, shipping address, email address, and contact telephone/mobile number.</li>
              <li><strong>Order History & Transaction Data:</strong> Details about the products you purchased, order dates, payment status, and order identifiers.</li>
              <li><strong>Technical & Browsing Data:</strong> IP address, device type, browser information, pages viewed, and session duration to ensure security and optimize website functionality.</li>
            </ul>
          </section>

          {/* Payment Security / Razorpay Section */}
          <section className="bg-purple-50/70 p-6 rounded-2xl border border-[#510c74]/20">
            <h2 className="text-2xl font-semibold text-[#510c74] mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#510c74]" />
              2. Payment Data Security (Powered by Razorpay)
            </h2>
            <p className="text-gray-800 leading-relaxed">
              We take payment security with paramount seriousness:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-800">
              <li>
                All online payments on <strong>Bhadohi Kaleen</strong> are processed through <strong>Razorpay Software Private Limited</strong>, India’s leading PCI-DSS Level 1 certified payment aggregator.
              </li>
              <li>
                <strong>No Storage of Card Details:</strong> We <strong>never</strong> store, process, or view your sensitive card credentials (such as 16-digit debit/credit card numbers, CVV codes, or net banking passwords) on our servers.
              </li>
              <li>
                All payment transmissions are encrypted via end-to-end <strong>256-bit bank-grade SSL encryption</strong> and 3D-Secure OTP verification by your card issuing bank.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#510c74] mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To process, fulfill, and deliver your orders accurately.</li>
              <li>To communicate order confirmation, shipment tracking, and invoices.</li>
              <li>To provide effective customer support and address service requests.</li>
              <li>To prevent fraudulent transactions and maintain platform security.</li>
              <li>To comply with statutory and legal obligations under Indian laws.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#510c74] mb-3">4. Sharing Your Information</h2>
            <p>
              We do not sell, rent, or trade your personal data to third parties. We share data strictly with vetted service providers necessary for operating our business:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Payment Aggregator:</strong> Razorpay, for payment processing, verification, and refunds.</li>
              <li><strong>Logistics Partners:</strong> Courier companies (BlueDart, Delhivery, DTDC) to deliver packages to your address.</li>
              <li><strong>Statutory Authorities:</strong> When required by Indian law or legal court orders.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#510c74] mb-3">5. Data Retention & Your Rights</h2>
            <p>
              We retain customer information only as long as necessary for fulfilling order requirements, taxation, and accounting regulations. You have the right to request access, correction, or deletion of your personal account information by emailing us at <a href="mailto:contact@bhadohikaleen.com" className="text-[#510c74] underline">contact@bhadohikaleen.com</a>.
            </p>
          </section>

          <section className="pt-4 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-[#510c74] mb-4">6. Contact Our Grievance Officer</h2>
            <p className="mb-4">
              If you have any questions, concerns, or grievances regarding our privacy practices or data processing, please reach out to us:
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
