export default function MarqueeBanner({
  items = [
    'FULL-STACK ARCHITECTURE',
    'MERN SYSTEMS',
    'DATA STRUCTURES & ALGORITHMS',
    'AWS CLOUD COMPUTING',
    'SMART INDIA HACKATHON',
    'HIGH PERFORMANCE WEB',
  ],
  direction = 'left',
  speed = 'normal',
  theme = 'dark', // 'dark' | 'light'
  className = '',
}) {
  const animationClass = direction === 'right' ? 'animate-marquee-reverse' : 'animate-marquee';
  const durationClass = speed === 'slow' ? 'duration-[45s]' : speed === 'fast' ? 'duration-[20s]' : 'duration-[28s]';
  const isDark = theme === 'dark';

  const repeatedItems = [...items, ...items, ...items];

  return (
    <div
      className={`relative w-full overflow-hidden py-5 md:py-6 border-y select-none ${
        isDark
          ? 'bg-[#0c0c0c] text-white border-[#222222]'
          : 'bg-bg-elevated text-text-primary border-border'
      } ${className}`}
    >
      <div className="flex w-max marquee-container">
        <div className={`flex items-center gap-10 shrink-0 ${animationClass} ${durationClass} marquee-content`}>
          {repeatedItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-10">
              <span className="font-heading font-black text-xs md:text-sm tracking-[0.22em] uppercase whitespace-nowrap">
                {item}
              </span>
              <span className="text-accent text-sm md:text-base font-black" aria-hidden="true">
                *
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
