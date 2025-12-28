import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/toast";
function ReciveMessages() {
  return (
    <div className="flex flex-col gap-4 items-center">
      <h3>پیام های دریافتی</h3>
    </div>
  );
}

export default ReciveMessages;
