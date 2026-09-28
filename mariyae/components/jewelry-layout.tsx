"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function JewelryLayout() {
  const jewelryCategories = [
    {
      id: 1,
      title: "Power in Every Twist",
      subtitle: "Kada Collection",
      image: "https://source.unsplash.com/random/400x300?bracelet",
      href: "/collections/kada"
    },
    {
      id: 2,
      title: "Every Step Sparkles",
      subtitle: "Anklet Collection",
      image: "https://source.unsplash.com/random/400x300?anklet",
      href: "/collections/anklet"
    },
    {
      id: 3,
      title: "Rings for Every Mood",
      subtitle: "Rings Collection",
      image: "https://source.unsplash.com/random/400x300?ring",
      href: "/collections/rings"
    },
    {
      id: 4,
      title: "Earrings with a Story",
      subtitle: "Antique Earrings",
      image: "https://source.unsplash.com/random/400x300?earrings",
      href: "/collections/earrings"
    }
  ]

  const CategoryCard = ({ title, subtitle, image, href }: {
    title: string;
    subtitle: string;
    image: string;
    href: string;
  }) => (
    <Link href={href} className="group">
      <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
        <Image
          src={image}
          alt={title}
          width={400}
          height={300}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
          <p className="text-white/90 text-sm">{subtitle}</p>
        </div>
      </div>
    </Link>
  )

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Hero Section - Left */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="https://source.unsplash.com/random/800x1000?jewelry+necklace"
                alt="Jewelry Hero"
                width={800}
                height={1000}
                className="w-full h-96 lg:h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

              {/* Text Overlay */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <h2 className="text-4xl lg:text-5xl font-light text-white mb-4">
                    Glam in a Glance
                  </h2>
                  <p className="text-white/90 text-lg mb-8">
                    Necklaces At Best Price
                  </p>
                  <Button
                    size="lg"
                    className="bg-[#510c74] text-white hover:bg-[#240334] px-8 py-3 text-lg font-medium"
                  >
                    SHOP NOW
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid - Right */}
          <div className="grid grid-cols-2 gap-6">
            {jewelryCategories.map((category) => (
              <CategoryCard
                key={category.id}
                title={category.title}
                subtitle={category.subtitle}
                image={category.image}
                href={category.href}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
} 