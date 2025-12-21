function GradientIcon({ children }) {
  return (
    <>
      <svg width="0" height="0">
        <defs>
          <linearGradient
            id="icon-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#9333ea" />
          </linearGradient>
        </defs>
      </svg>
      {children}
    </>
  );
}
export default GradientIcon;
