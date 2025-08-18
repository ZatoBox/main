import { useState, useEffect } from 'react';

export default function BetaCounter(): JSX.Element {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const startCount = 0;
    const targetCount = 0;
    const duration = 3000;
    const steps = 50;
    const increment = (targetCount - startCount) / steps;
    const stepDuration = duration / steps;

    setCount(startCount);
    setIsVisible(true);

    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev >= targetCount) {
          clearInterval(timer);
          return targetCount;
        }
        return Math.min(prev + increment, targetCount);
      });
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  const currentSlots = Math.floor(count);
  const remainingSlots = 150 - currentSlots;

  return (
    <div
      className={`w-full transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {/* Timer Visual */}
      <div className='text-center'>
        {/* Large and dramatic numbers */}
        <div className='flex items-center justify-center gap-1 mb-4'>
          <div className='text-6xl font-black text-orange-500 animate-pulse'>
            {String(currentSlots)
              .padStart(3, '0')
              .split('')
              .map((digit, index) => (
                <span
                  key={index}
                  className='inline-block mx-1 animate-bounce-in'
                >
                  {digit}
                </span>
              ))}
          </div>

          <div className='mx-4 text-6xl font-black text-gray-800'>/</div>

          <div className='text-6xl font-black text-gray-800'>150</div>
        </div>

        {/* Urgency message */}
        <div className='mb-2 text-sm font-bold text-orange-600 animate-pulse'>
          ⚠️ EXCLUSIVE EARLY ACCESS FOR BUSINESSES AND BITCOINERS. ⚠️
        </div>

        <div className='mb-4 text-xs font-bold text-orange-500 animate-soft-blink'>
          ONLY {remainingSlots} SLOTS REMAINING - REGISTER NOW BEFORE THEY'RE
          GONE!
        </div>

        {/* Remaining slots */}
        <div className='text-lg font-bold text-gray-700'>
          {remainingSlots} SLOTS LEFT
        </div>
      </div>
    </div>
  );
}
