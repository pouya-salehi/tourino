"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent } from "@/components/ui/tabs";
//modules
import SendMessages from "./SendMessages";
import ReciveMessages from "./ReciveMessages";
//components
import MessageTabs from "./MessageTabs";
function SendAndRecive() {
  return (
    <div>
      <Tabs>
        <MessageTabs />
        <div className="overflow-y-auto max-h-[60vh] px-1 pb-6">
          <TabsContent value="send">
            <SendMessages />
          </TabsContent>
          <TabsContent value="receive">
            <ReciveMessages />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export default SendAndRecive;
