import { Truck, RotateCcw, Users, Headphones } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: Truck,
      title: "Free Delivery",
      description: "Orders from all Item",
      color: "text-[#510c74]",
      bgColor: "bg-[#fff4df]",
    },
    {
      icon: RotateCcw,
      title: "Return & Refund",
      description: "Money back guarantee",
      color: "text-[#510c74]",
      bgColor: "bg-[#fff4df]",
    },
    {
      icon: Users,
      title: "Member Discount",
      description: "Onevery order over $140.00",
      color: "text-[#510c74]",
      bgColor: "bg-[#fff4df]",
    },
    {
      icon: Headphones,
      title: "Support 24/7",
      description: "Contact us 24 hours a day",
      color: "text-[#510c74]",
      bgColor: "bg-[#fff4df]",
    },
  ]

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 group cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-all duration-300"
            >
              <div
                className={`w-14 h-14 ${feature.bgColor} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className={`w-7 h-7 ${feature.color}`} strokeWidth={1.5} />
              </div>
              <div className="group-hover:translate-x-1 transition-transform duration-300">
                <h3 className="font-bold text-gray-900 text-lg mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
