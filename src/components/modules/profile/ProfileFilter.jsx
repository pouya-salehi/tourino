import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
function ProfileFilter() {
  return (
    <div className="flex gap-4 items-center p-4">
      <h2>جستجوی پیشرفته</h2>
      <Input className="w-lg" placeholder="جستجوی پروفایل..." />
    </div>
  );
}

export default ProfileFilter;
