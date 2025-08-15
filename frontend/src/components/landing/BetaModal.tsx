interface BetaModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode: string;
}

export default function BetaModal({
  isOpen,
  onClose,
  referralCode,
}: BetaModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50'>
      <div className='w-full max-w-md p-6 text-black bg-white border-4 border-orange-500 sm:p-8 animate-slide-in-from-top'>
        <div className='text-center'>
          <h2 className='mb-4 text-2xl font-black text-orange-500 sm:text-3xl sm:mb-6'>
            THANK YOU FOR REGISTERING!
          </h2>

          <div className='flex justify-center mb-4 sm:mb-6'>
            <img
              src='/fire-thank-you.gif'
              alt='Thank you fire animation'
              className='object-contain w-full h-auto max-w-sm'
            />
          </div>

          <div className='mb-6 sm:mb-8'>
            <p className='mb-4 text-sm font-bold sm:text-base'>
              YOU HAVE BEEN SUCCESSFULLY REGISTERED IN THE ZATOBOX BETA
            </p>
            <p className='mb-4 text-xs text-gray-700 sm:text-sm'>
              We will send you an email with access instructions within the next
              24 hours.
            </p>
          </div>

          <div className='p-4 mb-6 text-black bg-orange-500 border-4 border-black sm:mb-8'>
            <h3 className='mb-2 text-lg font-black sm:text-xl'>
              YOUR REFERRAL CODE:
            </h3>
            <div className='p-3 font-mono text-lg font-bold text-black bg-white border-2 border-black select-all sm:text-xl'>
              {referralCode}
            </div>
            <p className='mt-2 text-xs font-bold sm:text-sm'>
              Share it with other Bitcoiners to get exclusive benefits
            </p>
          </div>

          <div className='space-y-3 sm:space-y-4'>
            <button
              onClick={onClose}
              className='w-full px-4 py-3 text-base font-black tracking-wider text-black transition-all duration-200 bg-orange-500 border-4 border-orange-500 rounded-none hover:bg-orange-400 sm:text-lg sm:px-8 sm:py-4 hover:scale-105 hover:shadow-lg'
            >
              GOT IT!
            </button>

            <p className='text-xs text-gray-600'>
              You will soon receive news about the official launch
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
