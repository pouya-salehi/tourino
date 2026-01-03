"use client";
export default function GoToTourLogo({
  variant = "main",
  size = "normal",
  className = "",
}) {
  const variants = {
    main: {
      text: "GoTo Tour",
      style:
        "font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent",
    },
    minimal: {
      text: "CPR",
      style: "font-black text-purple-600",
    },
    icon: {
      text: "⚡",
      style: "text-yellow-500",
    },
  };

  const sizes = {
    small: "text-xl",
    normal: "text-3xl",
    large: "text-5xl",
  };

  const currentVariant = variants[variant];
  const currentSize = sizes[size];

  return (
    <div className={`flex absolute bottom-10 left-20 items-center ${className}`}>
      {variant === "icon" && (
        <span className={`${currentVariant.style} ${currentSize}`}>
          {currentVariant.text}
        </span>
      )}
      <span
        className={`${currentVariant.style} ${currentSize} capitalize font-montserrat text-4xl font-thin brand`}
      >
        {variant !== "icon" ? currentVariant.text : "GoTo Tour"}
      </span>
    </div>
  );
}
