"use client";
import { DottedMap } from "@/components/ui/dotted-map";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const markers = [
  {
    lat: 35.3219, // سنندج
    lng: 46.9862,
    size: 1,
    title: "Sanandaj",
  },
  {
    lat: 40.7128,
    lng: -74.006,
    size: 1,
    title: "New York",
  },
  {
    lat: 34.0522,
    lng: -118.2437,
    size: 1,
    title: "Los Angeles",
  },
  {
    lat: 51.5074,
    lng: -0.1278,
    size: 1,
    title: "London",
  },
  {
    lat: -33.8688,
    lng: 151.2093,
    size: 1,
    title: "Sydney",
  },
  {
    lat: 48.8566,
    lng: 2.3522,
    size: 1,
    title: "Paris",
  },
  {
    lat: 35.6762,
    lng: 139.6503,
    size: 1,
    title: "Tokyo",
  },
  {
    lat: 55.7558,
    lng: 37.6176,
    size: 1,
    title: "Moscow",
  },
  {
    lat: 39.9042,
    lng: 116.4074,
    size: 1,
    title: "Beijing",
  },
  {
    lat: 28.6139,
    lng: 77.209,
    size: 1,
    title: "New Delhi",
  },
  {
    lat: -23.5505,
    lng: -46.6333,
    size: 1,
    title: "São Paulo",
  },
  {
    lat: 1.3521,
    lng: 103.8198,
    size: 1,
    title: "Singapore",
  },
  {
    lat: 25.2048,
    lng: 55.2708,
    size: 1,
    title: "Dubai",
  },
  {
    lat: 52.52,
    lng: 13.405,
    size: 1,
    title: "Berlin",
  },
  {
    lat: 19.4326,
    lng: -99.1332,
    size: 1,
    title: "Mexico City",
  },
  {
    lat: -26.2041,
    lng: 28.0473,
    size: 1,
    title: "Johannesburg",
  },
];

export default function HeroBanner() {
  return (
    <section className="relative w-full h-100 md:h-[750px] flex items-center justify-center overflow-hidden">
      {/* نقشه در بک‌گراند */}
      <div className="absolute inset-0">
        <div className="to-background absolute inset-0 bg-radial from-transparent to-70%" />
        <DottedMap markers={markers} className="opacity-40 hidden md:block" />
      </div>

      {/* محتوای متنی - حالا روی نقشه قرار می‌گیره */}
      <div className="relative z-10 text-center max-w-xl px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-snug md:leading-tight mb-6 text-gray-700 dark:text-white">
          کوله‌پشتیتو ببند؛
          <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-400 text-transparent bg-clip-text">
            همسفرهاشو من پیدا می‌کنم!
          </span>
        </h1>

        <p className="text-gray-800 text-sm sm:text-base md:text-lg leading-relaxed mb-8 dark:text-white">
          از همین‌جا سفر واقعی شروع میشه؛ مسیرتو پیدا کن، همراهاتو بشناس، و
          تجربه‌های جدید بساز.
        </p>

        <Button className="transition ease-in">
          <Link href="/tours">شروع کن</Link>
        </Button>
      </div>
    </section>
  );
}
