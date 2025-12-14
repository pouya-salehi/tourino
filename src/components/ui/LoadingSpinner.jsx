// src/components/ui/LoadingSpinner.jsx
export default function LoadingSpinner({
  size = "md",
  text = "در حال بارگذاری...",
}) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-b-2 border-blue-600`}
      ></div>
      {text && <p className="mt-4 text-gray-600 font-medium">{text}</p>}
    </div>
  );
}
