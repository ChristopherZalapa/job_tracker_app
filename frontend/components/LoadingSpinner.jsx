export default function LoadingSpinner({ message = "Loading..." }) {
	return (
		<div className='text-center py-12'>
			<div className='flex justify-center mb-4'>
				<div className='w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin'></div>
			</div>
			{message && <p className='text-gray-600'>{message}</p>}
		</div>
	);
}
