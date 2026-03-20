import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Event {
  id: number
  name: string
  description: string
  event_date: string
  venue: string
  price: number
  image_url: string | null
  category: string | null
}

interface CartStore {
  items: Event[]
  addItem: (event: Event) => void
  removeItem: (eventId: number) => void
  clearCart: () => void
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (event) =>
        set((state) => {
          if (state.items.find((item) => item.id === event.id)) {
            return state
          }
          return { items: [...state.items, event] }
        }),
      removeItem: (eventId: number) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== eventId),
        })),
      clearCart: () => set({ items: [] }),
      getTotalPrice: () =>
        get().items.reduce((total, item) => total + parseInt(String(item.price), 10), 0),
    }),
    {
      name: 'cart-storage-v2',
    }
  )
)
