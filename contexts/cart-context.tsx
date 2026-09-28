"use client"

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'

export interface CartItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  quantity: number
  category: string
  brand: string
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id)

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
          total: state.total + (action.payload.price * action.payload.quantity),
          itemCount: state.itemCount + action.payload.quantity
        }
      } else {
        return {
          ...state,
          items: [...state.items, action.payload],
          total: state.total + (action.payload.price * action.payload.quantity),
          itemCount: state.itemCount + action.payload.quantity
        }
      }
    }

    case 'REMOVE_ITEM': {
      const itemToRemove = state.items.find(item => item.id === action.payload)
      if (!itemToRemove) return state

      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        total: state.total - (itemToRemove.price * itemToRemove.quantity),
        itemCount: state.itemCount - itemToRemove.quantity
      }
    }

    case 'UPDATE_QUANTITY': {
      const item = state.items.find(item => item.id === action.payload.id)
      if (!item) return state

      const quantityDiff = action.payload.quantity - item.quantity

      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.total + (item.price * quantityDiff),
        itemCount: state.itemCount + quantityDiff
      }
    }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0
      }

    case 'LOAD_CART': {
      const total = action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const itemCount = action.payload.reduce((sum, item) => sum + item.quantity, 0)

      return {
        items: action.payload,
        total,
        itemCount
      }
    }

    default:
      return state
  }
}

interface CartContextType {
  state: CartState
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0
  })
  const { toast } = useToast()

  // Load cart from localStorage on mount (only on client-side)
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return

    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const parsedCart: CartItem[] = JSON.parse(savedCart)
        // Filter out legacy demo data (numeric IDs)
        const validItems = parsedCart.filter(item => {
          // MongoDB IDs are normally 24 hex characters, demo IDs were short numbers
          const isNumericId = !isNaN(Number(item.id))
          return !isNumericId
        })
        dispatch({ type: 'LOAD_CART', payload: validItems })

        // If we filtered some items, update localStorage
        if (validItems.length !== parsedCart.length) {
          localStorage.setItem('cart', JSON.stringify(validItems))
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes (only on client-side)
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return

    localStorage.setItem('cart', JSON.stringify(state.items))
  }, [state.items])

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity: 1 } })

    // Show toast notification
    toast({
      title: "Product Added to Cart! 🛒",
      description: `${item.name} has been added to your cart.`,
      variant: "success",
      duration: 3000, // 3 seconds
    })
  }

  const removeItem = (id: string) => {
    const itemToRemove = state.items.find(item => item.id === id)
    dispatch({ type: 'REMOVE_ITEM', payload: id })

    // Show toast notification
    if (itemToRemove) {
      toast({
        title: "Item Removed from Cart",
        description: `${itemToRemove.name} has been removed from your cart.`,
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
    } else {
      const item = state.items.find(item => item.id === id)
      const oldQuantity = item?.quantity || 0
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })

      // Show toast notification for quantity changes
      if (item && quantity !== oldQuantity) {
        const action = quantity > oldQuantity ? "increased" : "decreased"
        toast({
          title: "Quantity Updated",
          description: `${item.name} quantity ${action} to ${quantity}.`,
          duration: 2000,
        })
      }
    }
  }

  const clearCart = () => {
    const itemCount = state.itemCount
    dispatch({ type: 'CLEAR_CART' })

    // Show toast notification
    if (itemCount > 0) {
      toast({
        title: "Cart Cleared",
        description: `All ${itemCount} item${itemCount !== 1 ? 's' : ''} have been removed from your cart.`,
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  return (
    <CartContext.Provider value={{
      state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  )
}
