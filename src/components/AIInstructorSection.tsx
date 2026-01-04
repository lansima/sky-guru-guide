import { useState } from "react";
import { Bot, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import airplaneSide from "@/assets/airplane-side.jpg";

export function AIInstructorSection() {
  const [question, setQuestion] = useState("");

  return (
    <section id="ai-instructor" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1">
            <img
              src={airplaneSide}
              alt="Commercial airplane in flight"
              className="w-full rounded-lg shadow-xl"
            />
          </div>

          {/* AI Chat Preview */}
          <div className="order-1 lg:order-2">
            <div className="max-w-md mx-auto lg:mx-0">
              <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center lg:text-left">
                AI Flight Instructor
              </h2>
              
              {/* Bot Icon */}
              <div className="flex justify-center lg:justify-start mb-6">
                <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
              </div>

              {/* Chat Bubble */}
              <div className="flex items-start gap-3 mb-6">
                <div className="flex-shrink-0 p-2 rounded-full bg-primary/10">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-tl-sm px-4 py-3 text-sm">
                  Ask me anything about aircraft systems, procedures, or regulations. I'm here to help!
                </div>
              </div>

              {/* Input Area */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <Textarea
                  placeholder="Ask your question here..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="min-h-[100px] border-0 resize-none focus-visible:ring-0 p-0 text-slate-700 placeholder:text-slate-400"
                />
                <div className="flex justify-end mt-3">
                  <Button size="sm" className="gap-2">
                    Send
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
