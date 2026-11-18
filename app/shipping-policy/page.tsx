import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Truck, Clock, ShieldCheck, MapPin, Mail, Phone, PackageCheck } from "lucide-react"

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="h-20"></div>

      <div className="pt-8 pb-16 px-4 lg:px-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#fff4df] border border-[#510c74]/20">
            <Truck className="w-6 h-6 text-[#510c74]" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-[#240334]">Shipping & Delivery Policy</h1>
            <p className="text-sm text-gray-500 mt-1">Last updated: January 2025 • Bhadohi Kaleen</p>
          </div>
        </div>

        <div className="prose prose-purple max-w-none text-gray-700 space-y-8">
          {/* Overview */}
          <section className="bg-[#fff4df]/40 p-6 rounded-2xl border border-[#510c74]/15">
            <p className="text-base text-gray-800 leading-relaxed">
              At <strong>Bhadohi Kaleen</strong>, we take pride in delivering handcrafted kaleen, carpets, and exquisite home textiles safely and promptly to your doorstep. We partner with India's premier logistics providers to ensure a seamless and reliable delivery experience.
            </p>
          </section>

          {/* 1. Shipping Coverage */}
          <section>
            <h2 className="text-2xl font-semibold text-[#510c74] mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#510c74]" />
              1. Shipping Coverage & Serviceable Pincodes
            </h2>
            <p>
              We deliver to all serviceable pincodes across India, covering over 19,000+ pin codes across all states and union territories. If your area is currently unserviceable by our primary courier partners, our customer support team will get in touch with you to arrange alternative shipping via India Post Speed Post.
            </p>
          </section>

          {/* 2. Order Processing & Dispatch Timelines */}
          <section>
            <h2 className="text-2xl font-semibold text-[#510c74] mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#510c74]" />
              2. Processing & Dispatch Timelines
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Standard In-Stock Products:</strong> Orders are verified, carefully packaged, and dispatched from our warehouse within <strong>24 to 48 hours</strong> (excluding Sundays and national holidays).
              </li>
              <li>
                <strong>Handcrafted / Custom Pieces:</strong> For customized or made-to-order kaleen varieties, production and dispatch timeline is communicated in the product description, typically between <strong>3 to 7 business days</strong>.
              </li>
              <li>
                Orders placed on Saturdays after 2:00 PM or Sundays will be processed on the next business day.
              </li>
            </ul>
          </section>

          {/* 3. Estimated Delivery Times */}
          <section>
            <h2 className="text-2xl font-semibold text-[#510c74] mb-3 flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-[#510c74]" />
              3. Estimated Delivery Timelines
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 my-4">
              <div className="p-5 rounded-xl border border-gray-200 bg-gray-50/60">
                <h3 className="font-semibold text-gray-900 mb-1">Metro Cities</h3>
                <p className="text-sm text-gray-600">Mumbai, Delhi-NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad</p>
                <p className="text-base font-bold text-[#510c74] mt-2">3 – 5 Business Days</p>
              </div>
              <div className="p-5 rounded-xl border border-gray-200 bg-gray-50/60">
                <h3 className="font-semibold text-gray-900 mb-1">Rest of India</h3>
                <p className="text-sm text-gray-600">Tier 2/3 cities, regional towns, and rural districts</p>
                <p className="text-base font-bold text-[#510c74] mt-2">5 – 7 Business Days</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 italic">
              * Delivery timelines are estimates and may occasionally experience minor delays due to adverse weather conditions, local holidays, or festive peak seasons.
            </p>
          </section>

          {/* 4. Shipping Charges */}
          <section>
            <h2 className="text-2xl font-semibold text-[#510c74] mb-3">4. Shipping Charges</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Prepaid Orders (Cards, UPI, NetBanking via Razorpay):</strong> We offer <strong>FREE Shipping</strong> across India on all prepaid orders.
              </li>
              <li>
                <strong>Cash on Delivery (COD):</strong> A nominal handling fee of ₹99 may apply to COD orders to cover additional logistics verification costs.
              </li>
              <li>
                All prices and shipping fees displayed during checkout are inclusive of applicable GST taxes. There are no hidden charges.
              </li>
            </ul>
          </section>

          {/* 5. Order Tracking */}
          <section>
            <h2 className="text-2xl font-semibold text-[#510c74] mb-3">5. Tracking Your Shipment</h2>
            <p>
              As soon as your package is dispatched, you will receive an email and SMS notification containing your <strong>AWB / Tracking Number</strong> along with a direct tracking link. You can track the real-time movement of your parcel at any time.
            </p>
          </section>

          {/* 6. Courier Partners */}
          <section>
            <h2 className="text-2xl font-semibold text-[#510c74] mb-3">6. Trusted Logistics Partners</h2>
            <p>
              We collaborate with reputable and trackable logistics providers including <strong>BlueDart, Delhivery, DTDC, Xpressbees, and India Post</strong> to ensure safe and insured transit of your products.
            </p>
          </section>

          {/* 7. Damaged or Tampered Package */}
          <section className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
            <h2 className="text-xl font-semibold text-amber-900 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-800" />
              7. Inspecting Your Parcel upon Delivery
            </h2>
            <p className="text-sm text-amber-900 leading-relaxed">
              If you notice that the outer packaging is visibly damaged, open, or tampered with at the time of delivery, please <strong>refuse to accept</strong> the package and ask the delivery executive to mark it as rejected due to tampering. If you discover damage after opening, please contact our support team with unboxing photos/videos within <strong>24 hours</strong> of delivery.
            </p>
          </section>

          {/* 8. Contact for Shipping Inquiries */}
          <section className="pt-4 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-[#510c74] mb-4">8. Customer Support & Inquiries</h2>
            <p className="mb-4">
              For any questions regarding your shipment, delivery delays, or address modifications, our support team is happy to assist:
            </p>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#510c74]" />
                <span className="text-sm">Email: <a href="mailto:contact@bhadohikaleen.com" className="text-[#510c74] font-medium hover:underline">contact@bhadohikaleen.com</a></span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#510c74]" />
                <span className="text-sm">Phone / WhatsApp: <a href="tel:+917045932672" className="text-[#510c74] font-medium hover:underline">+91 7045932672</a></span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#510c74] mt-0.5" />
                <span className="text-sm text-gray-600">Registered Office: Bhadohi Kaleen, Juhi Niharika Mirage, Sector-10, Kharghar, Navi Mumbai, Maharashtra - 410210</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}
