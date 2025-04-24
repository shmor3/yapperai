import type React from 'react'
import { create } from 'zustand'

export const useBearStore = create<BearStore>((set) => ({
	bears: 0,
	increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
	decreasePopulation: () =>
		set((state) => ({ bears: state.bears > 0 ? state.bears - 1 : 0 })),
	removeAllBears: () => set({ bears: 0 }),
}))

interface BearStore {
	bears: number
	increasePopulation: () => void
	decreasePopulation: () => void
	removeAllBears: () => void
}

interface BearStateProps {
	children: (state: BearStore) => React.ReactNode
}

export const BearState: React.FC<BearStateProps> = ({ children }) => {
	const bears = useBearStore((state) => state.bears)
	const increasePopulation = useBearStore((state) => state.increasePopulation)
	const decreasePopulation = useBearStore((state) => state.decreasePopulation)
	const removeAllBears = useBearStore((state) => state.removeAllBears)

	return (
		<>
			{children({
				bears,
				increasePopulation,
				decreasePopulation,
				removeAllBears,
			})}
		</>
	)
}
