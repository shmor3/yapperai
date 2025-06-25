import type React from 'react'
import { createContext, useContext, useState } from 'react'

interface BearContextType {
	bears: number
	activeTab: string
	handleTabChange: (tab: string) => void
	increasePopulation: () => void
	decreasePopulation: () => void
	removeAllBears: () => void
}

const BearContext = createContext<BearContextType | undefined>(undefined)

export const BearProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [bears, setBears] = useState(0)
	const [activeTab, setActiveTab] = useState('home')
	const handleTabChange = (tab: string) => setActiveTab(tab)

	const increasePopulation = () => setBears(bears + 1)
	const decreasePopulation = () => {
		const newPopulation = bears > 0 ? bears - 1 : 0
		setBears(newPopulation)
	}
	const removeAllBears = () => setBears(0)

	return (
		<BearContext.Provider
			value={{
				activeTab,
				handleTabChange,
				bears,
				increasePopulation,
				decreasePopulation,
				removeAllBears,
			}}
		>
			{children}
		</BearContext.Provider>
	)
}

export const useBearContext = () => {
	const context = useContext(BearContext)
	if (context === undefined) {
		throw new Error('useBearContext must be used within a BearProvider')
	}
	return context
}
