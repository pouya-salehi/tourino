import { Download } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
function ContractDownload({ downloadContract, setStep, loading }) {
  return (
    <Card className="w-full max-w-2xl bg-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          دانلود تعهدنامه
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={downloadContract}
          disabled={loading}
          className="w-full"
        >
          <Download className="h-4 w-4 ml-2" />
          دریافت تعهدنامه
        </Button>
        <Button variant="outline" onClick={() => setStep(3)} className="w-full">
          ادامه به مرحله بعد
        </Button>
      </CardContent>
    </Card>
  );
}

export default ContractDownload;
