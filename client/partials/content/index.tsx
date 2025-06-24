interface ContentProps {
	children: React.ReactNode
}

export const Content: React.FC<ContentProps> = ({ children }) => {
	return (
		<div className='flex w-full h-full pl-16 bg-base-100'>
			<div className='flex flex-col items-center justify-center w-full h-full overflow-hidden pt-20 pb-4 bg-base-100'>
				<div className='w-full max-w-4xl max-h-4xl h-full px-4 bg-base-100 overflow-hidden'>
					{children}
				</div>
			</div>
		</div>
	)
}
