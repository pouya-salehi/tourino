import { Instagram, TentTree, Mail, Phone, MapPin, Youtube } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
export default function Footer() {
  const socialLinks = [
    {
      icon: Instagram,
      href: "https://www.instagram.com/couper.ir/",
      label: "Instagram",
      title: "instagram",
    },
    {
      icon: Youtube,
      href: "https://www.instagram.com/couper.ir/",
      label: "Youtube",
      title: "Youtube",
    },
  ];

  const quickLinks = [
    { label: "درباره ما", href: "/about" },
    { label: "رویداد", href: "/blog" },
  ];

  const contactInfo = [{ icon: Mail, text: "cooperstudio2024@gmail.com" }];

  return (
    <footer className="relative overflow-hidden">
      <div className="relative z-10 mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                <TentTree className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <Link href="/" className="font-black text-2xl text-indigo-600">
                  GotoTour
                </Link>
                <Link href="https://couper.ir" className="text-xs text-gray-700 dark:text-white font-semibold tracking-widest">
                  By CouperStudio
                </Link>
              </div>
            </div>
            <p className="text-gray-600 dark:text-white text-sm leading-relaxed mb-6">
              تبدیل رویایت به واقعیت
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  title={social.title}
                  className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-300 group shadow-sm"
                >
                  <social.icon className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors duration-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-gray-800 dark:text-white mb-6 text-lg">لینک ها</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-600 dark:text-white/80 hover:text-indigo-600 transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <div className="w-1 h-1 rounded-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-gray-800 mb-6 text-lg dark:text-white">
              با ما در تماس باشید
            </h3>
            <ul className="space-y-4">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <info.icon className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-white">{info.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex">
            <img src="./images/enmad.png" alt="enmad" className="" />
          </div>
        </div>
        <Separator className="my-4 dark:bg-white/50" />
        {/* Bottom bar */}
        <div className="pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm dark:text-white">
              © 2025 Couper studio. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a
                href="https://couper.ir"
                className="text-gray-500 dark:text-white hover:text-indigo-600 transition-colors duration-300"
              >
                ساخته شده در استدیو کوپر
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* گرادینت‌های هماهنگ با layout */}
      <div className="absolute w-[400px] h-[400px] bg-gradient-to-br from-indigo-200 via-purple-200 to-blue-200 rounded-full blur-[120px] opacity-20 bottom-[-100px] left-[-100px] z-0 dark:opacity-0"></div>
      <div className="absolute w-[300px] h-[300px] bg-gradient-to-tr from-blue-200 via-indigo-200 to-sky-200 rounded-full blur-[100px] opacity-15 bottom-[-50px] right-[-50px] z-0 dark:opacity-0"></div>
    </footer>
  );
}
