import { Separator } from "@/components/ui/separator";
import Link from "next/link";
function NavMobileFooter() {
  return (
    <>
      <Separator className="bg-black/20 dark:bg-white/40 absolute bottom-10 right-0" />
      <Link href="https://couper.ir" className="absolute left-16 bottom-2 text-gray-500">
        ساخته شده در استدیو کوپر
      </Link>
    </>
  );
}

export default NavMobileFooter;
