"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface WishlistItem {
    _id: string
    name: string
    price: number
    image: string
    category: string
}

interface WishlistContextType {
    wishlist: WishlistItem[]
    addToWishlist: (item: WishlistItem) => void
    removeFromWishlist: (id: string) => void
    isInWishlist: (id: string) => boolean
    clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([])

    // Load wishlist from localStorage on mount
    useEffect(() => {
        const savedWishlist = localStorage.getItem('mariyae_wishlist')
        if (savedWishlist) {
            try {
                setWishlist(JSON.parse(savedWishlist))
            } catch (error) {
                console.error('Failed to parse wishlist:', error)
            }
        }
    }, [])

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('mariyae_wishlist', JSON.stringify(wishlist))
    }, [wishlist])

    const addToWishlist = (item: WishlistItem) => {
        setWishlist((prev) => {
            if (prev.some((i) => i._id === item._id)) return prev
            return [...prev, item]
        })
    }

    const removeFromWishlist = (id: string) => {
        setWishlist((prev) => prev.filter((i) => i._id !== id))
    }

    const isInWishlist = (id: string) => {
        return wishlist.some((i) => i._id === id)
    }

    const clearWishlist = () => {
        setWishlist([])
    }

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist }}>
            {children}
        </WishlistContext.Provider>
    )
}

export const useWishlist = () => {
    const context = useContext(WishlistContext)
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider')
    }
    return context
}
