import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Award, Users, Gem, Shield } from "lucide-react"

export default function AboutSection() {
  const stats = [
    { icon: Award, label: "Years of Excellence", value: "25+" },
    { icon: Users, label: "Happy Customers", value: "50K+" },
    { icon: Gem, label: "Unique Designs", value: "1000+" },
    { icon: Shield, label: "Lifetime Warranty", value: "100%" },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-6">Crafting Timeless Beauty Since 1998</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                At Mariyae Kalin, we believe that our product variety is more than just items—it's a reflection of your unique story,
                your precious moments, and your personal style. For over two decades, we've been dedicated to creating
                exquisite pieces that celebrate life's most beautiful moments.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Our master craftsmen combine traditional techniques with modern innovation to create product varieties that stand
                the test of time. Every piece is carefully designed and meticulously crafted using only the finest
                materials, ensuring that your items remain as beautiful as the day you first received them.
              </p>
              <Button size="lg" className="bg-[#510c74] hover:bg-[#240334] text-white">
                Learn More About Us
              </Button>
            </div>
          </div>

          {/* Right image */}
          <div className="relative aspect-[4/3] rounded-2xl shadow-lg overflow-hidden flex items-center justify-center p-8 border border-[#510c74]/15" style={{ backgroundColor: '#fff4df' }}>
            <Image
              src="/mariyae_dark_wbg.png"
              alt="Mariyae Kalin Logo"
              fill
              className="object-contain p-8 drop-shadow-md hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#510c74] rounded-full flex items-center justify-center">
                  <Gem className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Premium Quality</p>
                  <p className="text-sm text-gray-600">Certified & Authentic</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-[#510c74] rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
