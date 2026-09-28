import Image from "next/image"
import Link from "next/link"

export default function Categories() {
  const categories = [
    {
      id: 1,
      name: "Rings",
      count: 45,
      image: "/placeholder.svg?height=400&width=300&text=Rings+Collection",
      href: "/categories/rings",
    },
    {
      id: 2,
      name: "Necklaces",
      count: 32,
      image: "/placeholder.svg?height=400&width=300&text=Necklaces+Collection",
      href: "/categories/necklaces",
    },
    {
      id: 3,
      name: "Earrings",
      count: 28,
      image: "/placeholder.svg?height=400&width=300&text=Earrings+Collection",
      href: "/categories/earrings",
    },
    {
      id: 4,
      name: "Bracelets",
      count: 19,
      image: "/placeholder.svg?height=400&width=300&text=Bracelets+Collection",
      href: "/categories/bracelets",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our diverse collection of product varieties, each carefully curated to suit every style and
            occasion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link key={category.id} href={category.href} className="group">
              <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  width={300}
                  height={400}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-semibold text-white mb-2">{category.name}</h3>
                  <p className="text-white opacity-90">{category.count} Products</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
