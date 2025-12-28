"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function AboutPage() {
  const aboutContent = [
    {
      id: "about",
      title: "درباره GotoTour",
      des: "این وب اپلیکیشن در سال ۱۴۰۴ توسط شرکت کوپر استدیو طراحی، کدنویسی و اجرا شد. این پلتفرم به‌صورت اختصاصی برای تورهای گردشگری طراحی شده و هر تور قابلیت ساخت و مدیریت صفحه اختصاصی خود مانند شبکه‌های اجتماعی را دارد.",
    },
    {
      id: "license",
      title: "درباره مجوز",
      des: "مجوزها کاملاً انحصاری، اختصاصی و مطابق با قوانین رسمی کشور صادر می‌شوند.",
    },
    {
      id: "register",
      title: "چطور ثبت نام کنم؟",
      des: "ثبت‌نام کاملاً خودکار است. پس از احراز هویت، وارد پنل اختصاصی خود می‌شوید و اطلاعات شما طبق قرارداد رسمی و قانونی ثبت می‌شود.",
    },
  ];

  return (
    <div className="flex w-full min-h-screen justify-center items-center px-4">
      <Accordion
        type="single"
        collapsible
        defaultValue={aboutContent[0].id}
        className="w-full max-w-xl rounded-xl border bg-background p-4 shadow-sm"
      >
        {aboutContent.map((acc) => (
          <AccordionItem key={acc.id} value={acc.id}>
            <AccordionTrigger className="text-right font-semibold text-md cursor-pointer hover:no-underline bg-gradient-to-l from-indigo-500 to-blue-500 bg-clip-text text-transparent dark:text-white">
              {acc.title}
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
              {acc.des}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default AboutPage;
