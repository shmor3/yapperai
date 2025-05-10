import { BellIcon, GearIcon, LockIcon } from '@primer/octicons-react'
import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

const GlobalStore = createContext<GlobalStoreType>({ title: '' })

interface GlobalStoreType {
	title: string
}

export const Settings: React.FC = () => {
	const globalStore = useContext(GlobalStore) as GlobalStoreType
	const [state, setState] = useState({
		spaceName: 'My Space',
		privacy: 'private',
		emailNotifications: true,
		pushNotifications: false,
	})
	useEffect(() => {
		globalStore.title = 'settings'
	}, [globalStore])
	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value, type } = e.target
		setState((prevState) => ({
			...prevState,
			[name]:
				type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
		}))
	}
	return (
		<div className='container mx-auto p-4'>
			<h1 className='mb-6 text-3xl font-bold'>Space Settings</h1>
			<div className='grid gap-6 md:grid-cols-2'>
				{/* General Settings */}
				<div className='card bg-base-100 shadow-xl'>
					<div className='card-body'>
						<h2 className='card-title mb-4'>
							<GearIcon className='mr-2' />
							General Settings
						</h2>
						<div className='form-control'>
							<p className='label'>
								<span className='label-text'>Space Name</span>
							</p>
							<input
								type='text'
								placeholder='Enter space name'
								className='input input-bordered'
								name='spaceName'
								value={state.spaceName}
								onChange={handleInputChange}
							/>
						</div>
					</div>
				</div>
				{/* Privacy Settings */}
				<div className='card bg-base-100 shadow-xl'>
					<div className='card-body'>
						<h2 className='card-title mb-4'>
							<LockIcon className='mr-2' />
							Privacy Settings
						</h2>
						<div className='form-control'>
							<label className='label cursor-pointer'>
								<span className='label-text'>Space Visibility</span>
								<select
									className='select select-bordered'
									name='privacy'
									value={state.privacy}
									onChange={handleInputChange}
								>
									<option value='private'>Private</option>
									<option value='public'>Public</option>
									<option value='team'>Team Only</option>
								</select>
							</label>
						</div>
					</div>
				</div>
				{/* Notification Settings */}
				<div className='card bg-base-100 shadow-xl'>
					<div className='card-body'>
						<h2 className='card-title mb-4'>
							<BellIcon className='mr-2' />
							Notification Settings
						</h2>
						<div className='form-control'>
							<label className='label cursor-pointer'>
								<span className='label-text'>Email Notifications</span>
								<input
									type='checkbox'
									className='toggle'
									name='emailNotifications'
									checked={state.emailNotifications}
									onChange={handleInputChange}
								/>
							</label>
						</div>
						<div className='form-control'>
							<label className='label cursor-pointer'>
								<span className='label-text'>Push Notifications</span>
								<input
									type='checkbox'
									className='toggle'
									name='pushNotifications'
									checked={state.pushNotifications}
									onChange={handleInputChange}
								/>
							</label>
						</div>
					</div>
				</div>
			</div>
			<div className='mt-6 flex justify-end'>
				<button type='button' className='btn btn-primary'>
					Save Changes
				</button>
			</div>
		</div>
	)
}
