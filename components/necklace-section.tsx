"use client";

import Image from "next/image";



const items = [
  {
    image: "https://res.cloudinary.com/djjj41z17/image/upload/v1754041855/WED_1240_pbfm4b.jpg",
    title: "Glam in a Glance",
    subtitle: "Necklaces At Best Price",
    button: true,
  },
  {
    image: "https://res.cloudinary.com/djjj41z17/image/upload/v1754041852/WED_1238_diccyx.jpg",
    title: "Elegant Necklaces",
    subtitle: "Premium Collection",
  },
  {
    image: "https://res.cloudinary.com/djjj41z17/image/upload/v1754041851/WED_1242_upwdea.jpg",
    title: "Designer Necklaces",
    subtitle: "Exclusive Collection",
  },
  {
    image: "https://res.cloudinary.com/djjj41z17/image/upload/v1754041850/WED_1231_xhhr7j.jpg",
    title: "Luxury Necklaces",
    subtitle: "Boutique Collection",
  },
  {
    image: "https://res.cloudinary.com/djjj41z17/image/upload/v1754041847/RNS-DC-35_ehddlo.jpg",
    title: "Classic Necklaces",
    subtitle: "Timeless Collection",
  },
];

export default function NecklaceSection() {
  return (
    <section className="w-full h-screen p-2 bg-white mt-16">
      {/* Section Title */}
      <div className="text-center mb-8">
        <h2 className="font-allura text-5xl font-light text-gray-900 mb-4">Necklaces Collection</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-6">
          Discover our exquisite collection of necklaces and pendants
        </p>

      </div>

      <div className="flex flex-col md:flex-row w-full h-full gap-4">

        {/* Left Large Feature */}
        <div
          className="relative group rounded-xl overflow-hidden w-full md:w-[35%] h-1/2 md:h-full animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          <Image
            src={items[0].image}
            alt={items[0].title}
            width={600}
            height={600}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300" />
          <div className="absolute bottom-6 left-6 text-white max-w-[80%] transform group-hover:translate-y-0 transition-transform duration-300">
            <h2 className="text-2xl font-bold transform group-hover:scale-105 transition-transform duration-300">
              {items[0].title}
            </h2>
            <p className="text-sm mb-4 transform group-hover:scale-105 transition-transform duration-300">
              {items[0].subtitle}
            </p>
            {items[0].button && (
              <button className="bg-[#510c74] text-white px-4 py-2 text-sm font-medium hover:bg-white hover:text-[#510c74] border border-[#510c74] transition-all duration-300 transform hover:scale-105">
                SHOP NOW
              </button>
            )}
          </div>
        </div>



        {/* Right Grid 2x2 */}
        <div className="w-full md:w-[70%] grid grid-cols-2 gap-4 px-2"> {/* Added px-2 for side spacing */}
          {items.slice(1).map((item, idx) => (
            <div
              key={idx}
              className="relative rounded-xl overflow-hidden group h-[284px] animate-fade-in-up mx-auto w-[95%]" // Reduced card width slightly
              style={{ animationDelay: `${0.4 + idx * 0.1}s` }}
            >
              <Image
                src={item.image}
                alt={item.title}
                width={700}
                height={700}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300" />
              <div className="absolute bottom-4 left-4 text-white transform group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="font-semibold text-lg transform group-hover:scale-105 transition-transform duration-300">
                  {item.title}
                </h3>
                <p className="text-sm transform group-hover:scale-105 transition-transform duration-300">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>



      </div>

      {/* Explore Button */}
      <div className="text-center mt-8">
        <button className="bg-[#510c74] text-white px-8 py-3 text-lg font-medium hover:bg-[#240334] transition-colors duration-300 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105">
          Explore Necklaces Collection
        </button>
      </div>
    </section>
  );
} 