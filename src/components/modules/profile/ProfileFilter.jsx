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
    <div className="flex gap-4 items-center mt-4">
      <Input className="w-sm" placeholder="جستجوی پروفایل..." />
    </div>
  );
}

export default ProfileFilter;
