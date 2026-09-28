import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Truck, RotateCcw, Users, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CollectionsSection() {
  const features = [
    {
      icon: Truck,
      title: "Free Delivery",
      description: "Orders from all item",
      color: "text-[#510c74]",
    },
    {
      icon: RotateCcw,
      title: "Return & Refund",
      description: "Money back guarantee",
      color: "text-[#510c74]",
    },
    {
      icon: Users,
      title: "Member Discount",
      description: "Onevery order over $140.00",
      color: "text-[#510c74]",
    },
    {
      icon: Headphones,
      title: "Support 24/7",
      description: "Contact us 24 hours a day",
      color: "text-[#510c74]",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 group cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-[#fff4df] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <feature.icon className={`w-6 h-6 ${feature.color}`} strokeWidth={1.5} />
              </div>
              <div className="group-hover:translate-x-1 transition-transform duration-300">
                <h3 className="font-semibold text-gray-900 text-base mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-12 gap-6 h-[500px]">
          {/* Ardeco Pearl Collection - Large Left Card (spans 8 columns) */}
          <div className="col-span-12 lg:col-span-8 row-span-1">
            <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 rounded-2xl p-8 h-full flex items-center justify-between overflow-hidden relative group hover:shadow-xl transition-all duration-300">
              <div className="z-10 flex-1">
                <p className="text-[#510c74] text-sm font-medium mb-3 tracking-wide uppercase">Collection</p>
                <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6 leading-tight">
                  Ardeco pearl
                  <br />
                  Rings style 2023
                </h2>
                <Link href="/collections/ardeco-pearl">
                  <Button
                    variant="ghost"
                    className="text-gray-900 hover:text-blue-600 p-0 h-auto font-medium group/btn"
                  >
                    Shop Now
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              <div className="flex-1 flex justify-center items-center">
                <Image
                  src="/Gemini_Gener__copy.jpg"
                  alt="Ardeco Pearl Rings"
                  width={250}
                  height={250}
                  className="group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Ring Gold with Diamonds - Large Right Card (spans 4 columns, full height) */}
          <div className="col-span-12 lg:col-span-4 row-span-2">
            <div className="relative rounded-2xl overflow-hidden h-full group hover:shadow-xl transition-all duration-300">
              <Image
                src="/model-jewelry.jpg"
                alt="Woman wearing diamond earrings"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-300"></div>
              <div className="absolute bottom-8 left-8 text-white z-10">
                <p className="text-white/90 text-sm font-medium mb-3 tracking-wide uppercase">Collection</p>
                <h2 className="text-2xl lg:text-3xl font-light mb-6 leading-tight">
                  Ring gold with
                  <br />
                  diamonds
                </h2>
                <Link href="/collections/gold-diamonds">
                  <Button
                    variant="outline"
                    className="text-white border-white hover:bg-white hover:text-gray-900 bg-transparent"
                  >
                    Shop Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Tropical Set - Bottom Left */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 rounded-2xl p-6 h-full flex flex-col justify-between group hover:shadow-xl transition-all duration-300">
              <div>
                <p className="text-[#510c74] text-sm font-medium mb-3 tracking-wide uppercase">Trending</p>
                <h3 className="text-xl lg:text-2xl font-light text-gray-900 mb-4">Tropical Set</h3>
              </div>
              <div className="flex justify-center mb-6">
                <Image
                  src="/placeholder.svg?height=140&width=140&text=Green+Leaf+Earrings"
                  alt="Tropical Set Earrings"
                  width={140}
                  height={140}
                  className="group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Gold Jewelry - Bottom Middle */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-gradient-to-br from-[#fff4df] via-[#ffedc2] to-[#fff4df] rounded-2xl p-6 h-full flex flex-col justify-between group hover:shadow-xl transition-all duration-300">
              <div>
                <p className="text-[#510c74] text-sm font-medium mb-3 tracking-wide uppercase">New Arrival</p>
                <h3 className="text-xl lg:text-2xl font-light text-gray-900 mb-4">Gold Jewelry</h3>
              </div>
              <div className="flex justify-center mb-6">
                <Image
                  src="/placeholder.svg?height=140&width=140&text=Rose+Gold+Hoop+Earrings"
                  alt="Gold Jewelry Collection"
                  width={140}
                  height={140}
                  className="group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
