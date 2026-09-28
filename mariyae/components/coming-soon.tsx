"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface ComingSoonProps {
    title: string
}

export default function ComingSoon({ title }: ComingSoonProps) {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center py-20 px-4">
                <div className="text-center max-w-2xl mx-auto">
                    <div className="mb-8 relative inline-block">
                        <div className="w-24 h-24 bg-[#fff4df] rounded-full flex items-center justify-center mx-auto border-2 border-[#510c74]/20 animate-pulse">
                            <span className="text-4xl">💎</span>
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif text-[#240334] mb-6">{title}</h1>
                    <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                        We are currently crafting something beautiful for this page.
                        Our digital collection is growing, and this section will be available very soon.
                    </p>
                    <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center items-center">
                        <Button asChild className="bg-[#510c74] hover:bg-[#240334] text-white px-8 py-6 rounded-full text-lg">
                            <Link href="/products">Browse Collection</Link>
                        </Button>
                        <Button variant="outline" asChild className="border-[#510c74] text-[#510c74] hover:bg-[#fff4df] px-8 py-6 rounded-full text-lg">
                            <Link href="/" className="flex items-center gap-2">
                                <ArrowLeft className="w-5 h-5" />
                                Back to Home
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
