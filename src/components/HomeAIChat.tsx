import { useState } from "react";
import { Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function HomeAIChat() {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    setIsLoading(true);
    setResponse(null);

    try {
      const { data, error } = await supabase.functions.invoke("ai-flight-instructor", {
        body: {
          message: question,
          context: "General aviation inquiry from homepage",
        },
      });

      if (error) throw error;
      setResponse(data.response);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
          {/* Aircraft Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop"
              alt="Aircraft in flight"
              className="w-full h-[300px] md:h-[350px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* AI Chat Widget */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">AI Flight Instructor</h2>
            </div>

            {/* Chat Bubble */}
            <div className="relative">
              <div className="bg-card border border-border rounded-2xl rounded-bl-md p-4 shadow-lg">
                <p className="text-muted-foreground">
                  {response || "Ask me anything about aircraft systems, procedures, or regulations. I'm here to help!"}
                </p>
              </div>
              {/* Bubble tail */}
              <div className="absolute -bottom-2 left-6 w-4 h-4 bg-card border-l border-b border-border transform rotate-[-45deg]" />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex gap-2 mt-6">
              <Input
                type="text"
                placeholder="Ask your question here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="flex-1 h-12 bg-background"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="lg" 
                className="h-12 px-6 gap-2"
                disabled={isLoading || !question.trim()}
              >
                Send
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
