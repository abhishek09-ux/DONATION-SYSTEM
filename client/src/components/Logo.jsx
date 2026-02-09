// Custom DonateMatch Logo - Hands forming a heart shape representing connection & giving
const Logo = ({ className = "h-8 w-8", variant = "full" }) => {
  if (variant === "icon") {
    // Just the icon
    return (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Two hands meeting to form a heart - symbolizing matching donors with causes */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#F43F5E" />
          </linearGradient>
        </defs>
        
        {/* Heart shape formed by connecting paths */}
        <path
          d="M24 42C24 42 6 28 6 16C6 10 10 6 16 6C20 6 23 9 24 12C25 9 28 6 32 6C38 6 42 10 42 16C42 28 24 42 24 42Z"
          fill="url(#logoGradient)"
          opacity="0.2"
        />
        
        {/* Left hand reaching up */}
        <path
          d="M12 30C10 28 8 24 8 20C8 16 10 14 12 14C14 14 15 15 16 16L18 20C18.5 21 19 21.5 20 22L24 24"
          stroke="url(#logoGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Right hand reaching up */}
        <path
          d="M36 30C38 28 40 24 40 20C40 16 38 14 36 14C34 14 33 15 32 16L30 20C29.5 21 29 21.5 28 22L24 24"
          stroke="url(#logoGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Heart in center where hands meet */}
        <path
          d="M24 28C24 28 20 25 20 22C20 20 21 19 22.5 19C23.5 19 24 20 24 20C24 20 24.5 19 25.5 19C27 19 28 20 28 22C28 25 24 28 24 28Z"
          fill="url(#logoGradient)"
        />
        
        {/* Connection dots representing matching */}
        <circle cx="16" cy="12" r="2" fill="#8B5CF6" opacity="0.6" />
        <circle cx="32" cy="12" r="2" fill="#F43F5E" opacity="0.6" />
        <circle cx="24" cy="8" r="1.5" fill="#EC4899" />
      </svg>
    );
  }

  // Full logo with text
  return (
    <div className="flex items-center gap-2">
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <linearGradient id="logoGradientFull" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#F43F5E" />
          </linearGradient>
        </defs>
        
        {/* Heart shape background */}
        <path
          d="M24 42C24 42 6 28 6 16C6 10 10 6 16 6C20 6 23 9 24 12C25 9 28 6 32 6C38 6 42 10 42 16C42 28 24 42 24 42Z"
          fill="url(#logoGradientFull)"
          opacity="0.15"
        />
        
        {/* Left hand */}
        <path
          d="M12 30C10 28 8 24 8 20C8 16 10 14 12 14C14 14 15 15 16 16L18 20C18.5 21 19 21.5 20 22L24 24"
          stroke="url(#logoGradientFull)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Right hand */}
        <path
          d="M36 30C38 28 40 24 40 20C40 16 38 14 36 14C34 14 33 15 32 16L30 20C29.5 21 29 21.5 28 22L24 24"
          stroke="url(#logoGradientFull)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Center heart */}
        <path
          d="M24 28C24 28 20 25 20 22C20 20 21 19 22.5 19C23.5 19 24 20 24 20C24 20 24.5 19 25.5 19C27 19 28 20 28 22C28 25 24 28 24 28Z"
          fill="url(#logoGradientFull)"
        />
        
        {/* Matching dots */}
        <circle cx="16" cy="12" r="2" fill="#8B5CF6" opacity="0.6" />
        <circle cx="32" cy="12" r="2" fill="#F43F5E" opacity="0.6" />
        <circle cx="24" cy="8" r="1.5" fill="#EC4899" />
      </svg>
    </div>
  );
};

// Alternative: Puzzle piece with heart cutout
export const LogoPuzzle = ({ className = "h-8 w-8" }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="puzzleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    
    {/* Puzzle piece shape */}
    <path
      d="M8 12C8 9.79 9.79 8 12 8H18C18 5.79 19.79 4 22 4H26C28.21 4 30 5.79 30 8H36C38.21 8 40 9.79 40 12V18C42.21 18 44 19.79 44 22V26C44 28.21 42.21 30 40 30V36C40 38.21 38.21 40 36 40H30C30 42.21 28.21 44 26 44H22C19.79 44 18 42.21 18 40H12C9.79 40 8 38.21 8 36V30C5.79 30 4 28.21 4 26V22C4 19.79 5.79 18 8 18V12Z"
      fill="url(#puzzleGradient)"
      opacity="0.15"
      stroke="url(#puzzleGradient)"
      strokeWidth="2"
    />
    
    {/* Heart in center */}
    <path
      d="M24 32C24 32 16 26 16 20C16 16.5 18.5 14 22 14C23.5 14 24 15.5 24 15.5C24 15.5 24.5 14 26 14C29.5 14 32 16.5 32 20C32 26 24 32 24 32Z"
      fill="url(#puzzleGradient)"
    />
    
    {/* Connection lines */}
    <path
      d="M14 24H18M30 24H34M24 14V18M24 30V34"
      stroke="url(#puzzleGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
);

// Alternative: Minimalist handshake forming heart
export const LogoMinimal = ({ className = "h-8 w-8" }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="minimalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="50%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#F43F5E" />
      </linearGradient>
    </defs>
    
    {/* Two curved paths meeting to form heart shape - representing connection */}
    <path
      d="M6 20C6 14 10 10 16 10C20 10 22 12 24 16C26 12 28 10 32 10C38 10 42 14 42 20C42 30 24 42 24 42C24 42 6 30 6 20Z"
      stroke="url(#minimalGradient)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    
    {/* Handshake in center */}
    <path
      d="M18 22L22 26L26 22M22 26L26 30L30 26"
      stroke="url(#minimalGradient)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    
    {/* Match indicator - two dots connecting */}
    <circle cx="14" cy="16" r="2" fill="#8B5CF6" />
    <circle cx="34" cy="16" r="2" fill="#F43F5E" />
    <path
      d="M16 16C18 14 20 14 24 16C28 14 30 14 32 16"
      stroke="#EC4899"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeDasharray="2 2"
      opacity="0.6"
    />
  </svg>
);

export default Logo;
