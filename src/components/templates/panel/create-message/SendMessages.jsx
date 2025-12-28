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
function SendMessages() {
  const problems = [
    {
      value: "register",
      problem: "مشکل در ثبت نام",
    },
    {
      value: "addtour",
      problem: "مشکل در ثبت تور",
    },
    {
      value: "slug",
      problem: "مشکل در ایجاد صفحه",
    },
    {
      value: "editor",
      problem: "مشکل در ویرایشگر عکس",
    },
    {
      value: "contract",
      problem: "مشکل در قرارداد",
    },
    {
      value: "tour",
      problem: "مشکل در تور",
    },
  ];
  const senHandler = () => {
    toast.success("پیام با موفقیت ارسال شد");
  };
  return (
    <div className="flex flex-col gap-4 items-center">
      <h3>ارسال پیام</h3>
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="عنوان پیام" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>لطفا یک عنوان را انتخاب کنید</SelectLabel>
            {problems.map((p) => (
              <SelectItem value={p.value} key={p.value}>
                {p.problem}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Textarea
        className="h-44 resize-none"
        placeholder="پیامتان را به صورت کامل توضیح دهید..."
      />
      <Button onClick={senHandler} className="">
        ارسال پیام
      </Button>
    </div>
  );
}

export default SendMessages;
