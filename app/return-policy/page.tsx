import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { RotateCcw, CheckCircle2, AlertCircle, Clock, CreditCard, XCircle, Mail, Phone, MapPin } from "lucide-react"

export default function ReturnPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="h-20"></div>

      <div className="pt-8 pb-16 px-4 lg:px-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#fff4df] border border-[#510c74]/20">
            <RotateCcw className="w-6 h-6 text-[#510c74]" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-[#240334]">Return, Refund & Cancellation Policy</h1>
            <p className="text-sm text-gray-500 mt-1">Last updated: January 2025 • Bhadohi Kaleen</p>
          </div>
        </div>

        <div className="prose prose-purple max-w-none text-gray-700 space-y-8">
          {/* Commitment Banner */}
          <section className="bg-[#fff4df]/40 p-6 rounded-2xl border border-[#510c74]/15">
            <h2 className="text-xl font-semibold text-[#510c74] mt-0 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              100% Customer Satisfaction Guarantee
            </h2>
            <p className="text-base text-gray-800 leading-relaxed mb-0">
              At <strong>Bhadohi Kaleen</strong>, customer satisfaction is our top priority. We want you to love your purchases. If for any reason you are not completely satisfied with your order, we offer transparent, hassle-free returns and refunds within <strong>7 days</strong> from the date of delivery.
            </p>
          </section>

          {/* 1. Cancellation Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-[#510c74] mb-3 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-[#510c74]" />
              1. Order Cancellation Policy
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Cancellation Before Dispatch:</strong> You can cancel your order free of charge at any time before it has been dispatched from our warehouse. Simply email us at <a href="mailto:contact@bhadohikaleen.com" className="text-[#510c74] font-medium hover:underline">contact@bhadohikaleen.com</a> or call/WhatsApp us at <a href="tel:+917045932672" className="text-[#510c74] font-medium hover:underline">+91 7045932672</a> with your Order ID.
              </li>
              <li>
                <strong>Immediate Refund on Pre-Dispatch Cancellation:</strong> If a prepaid order is cancelled prior to shipment, 100% of the transaction amount will be refunded immediately via Razorpay to the original payment source.
              </li>
              <li>
                <strong>Cancellation After Dispatch:</strong> If your order has already been dispatched, it cannot be intercepted in transit. You may refuse to accept the package at the time of delivery or follow the standard 7-day return procedure after receipt.
              </li>
            </ul>
          </section>

          {/* 2. Return Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-[#510c74] mb-3 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-[#510c74]" />
              2. 7-Day Return Window & Conditions
            </h2>
            <p>
              You may request a return within <strong>7 calendar days</strong> from the date your package was delivered. To be eligible for a return, the following conditions must be met:
            </p>
            <ul className="list-none space-y-3 pl-0 my-4">
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-[#510c74] flex-shrink-0 flex items-center justify-center text-white text-xs mt-0.5 mr-3 font-semibold">1</div>
                <p className="m-0">The item must be unused, unwashed, unaltered, and in the same pristine condition in which you received it.</p>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-[#510c74] flex-shrink-0 flex items-center justify-center text-white text-xs mt-0.5 mr-3 font-semibold">2</div>
                <p className="m-0">All original tags, authenticity brand labels, and protective packaging must be intact.</p>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-[#510c74] flex-shrink-0 flex items-center justify-center text-white text-xs mt-0.5 mr-3 font-semibold">3</div>
                <p className="m-0">Custom-made, personalized, or custom-dimension kaleen products are non-returnable unless received defective or damaged during transit.</p>
              </li>
            </ul>
          </section>

          {/* 3. Return Steps */}
          <section>
            <h2 className="text-2xl font-semibold text-[#510c74] mb-3">3. How to Initiate a Return</h2>
            <div className="grid md:grid-cols-3 gap-4 my-4">
              <div className="p-5 border border-gray-200 rounded-xl bg-gray-50/60">
                <h3 className="font-bold text-gray-900 mb-2">Step 1: Contact Us</h3>
                <p className="text-sm text-gray-600">Send an email to <a href="mailto:contact@bhadohikaleen.com" className="text-[#510c74] underline">contact@bhadohikaleen.com</a> with your Order ID, reason for return, and product photo.</p>
              </div>
              <div className="p-5 border border-gray-200 rounded-xl bg-gray-50/60">
                <h3 className="font-bold text-gray-900 mb-2">Step 2: Pickup Arranged</h3>
                <p className="text-sm text-gray-600">Our courier partner will arrange a doorstep reverse pickup from your registered delivery address within 2-3 business days.</p>
              </div>
              <div className="p-5 border border-gray-200 rounded-xl bg-gray-50/60">
                <h3 className="font-bold text-gray-900 mb-2">Step 3: Quality Check</h3>
                <p className="text-sm text-gray-600">Once the parcel reaches our fulfillment hub, our quality team inspects the item within 24-48 hours to approve the refund.</p>
              </div>
            </div>
          </section>

          {/* 4. Refund Policy (Razorpay Mandatory) */}
          <section className="bg-purple-50/70 p-6 rounded-2xl border border-[#510c74]/20">
            <h2 className="text-2xl font-semibold text-[#510c74] mb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#510c74]" />
              4. Refund Timelines & Payment Mode (via Razorpay)
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-800">
              <li>
                <strong>Prepaid Orders (Cards, NetBanking, UPI, Wallets):</strong> Approved refunds are credited directly back to the original payment source that you used during checkout through our PCI-DSS certified payment gateway partner, <strong>Razorpay</strong>.
              </li>
              <li>
                <strong>Refund Processing Timeline:</strong> Once approved, the refund is initiated within <strong>24 to 48 hours</strong> and typically reflects in your bank account, credit card statement, or UPI account within <strong>5 to 7 business days</strong> (depending on your bank's clearance cycle).
              </li>
              <li>
                <strong>Cash on Delivery (COD) Orders:</strong> For orders paid via COD, we will contact you to request your verified bank account details (Account Name, Account Number, IFSC code) or UPI ID. The refund will be credited via secure NEFT/IMPS/UPI transfer within <strong>5 to 7 business days</strong> of verification.
              </li>
              <li>
                You will receive an automated confirmation email with the Razorpay Refund Reference Number (RRN) as soon as the refund is initiated.
              </li>
            </ul>
          </section>

          {/* 5. Defective or Damaged Products */}
          <section className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-amber-800 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-amber-900 font-bold mb-1">Damaged, Defective or Incorrect Items</h3>
                <p className="text-amber-900 text-sm leading-relaxed mb-0">
                  If you receive an item that is defective, damaged in transit, or different from what you ordered, please notify us within <strong>48 hours</strong> of delivery with clear photographs of the defect and packaging. We will provide an immediate free replacement or a 100% full refund with no return shipping deduction.
                </p>
              </div>
            </div>
          </section>

          {/* 6. Support Contacts */}
          <section className="pt-4 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-[#510c74] mb-3">6. Have Questions About Returns or Refunds?</h2>
            <p className="text-gray-600 mb-4">
              We are committed to resolving any concerns promptly. Reach out to our dedicated support team:
            </p>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#510c74]" />
                <span>Support Email: <a href="mailto:contact@bhadohikaleen.com" className="text-[#510c74] font-medium hover:underline">contact@bhadohikaleen.com</a></span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#510c74]" />
                <span>Customer Care: <a href="tel:+917045932672" className="text-[#510c74] font-medium hover:underline">+91 7045932672</a> (Mon–Sat, 9:00 AM – 8:00 PM IST)</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#510c74] mt-0.5" />
                <span className="text-gray-600">Registered Office: Bhadohi Kaleen, Juhi Niharika Mirage, Sector-10, Kharghar, Navi Mumbai, Maharashtra - 410210</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}
