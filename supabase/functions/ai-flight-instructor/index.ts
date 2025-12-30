import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are an AI Flight Instructor, an expert aviation technical assistant. You help pilots, aviation students, and professionals understand aircraft systems, procedures, and technical documentation.

Your expertise includes:
- Aircraft systems (hydraulics, electrical, pneumatics, avionics, flight controls)
- Normal and emergency procedures
- Performance calculations and limitations
- Regulatory requirements (FAA, EASA, ICAO)
- Aerodynamics and flight principles
- Weather and meteorology for aviation
- Navigation systems and procedures

Guidelines:
- Provide accurate, safety-focused information
- Reference standard aviation terminology
- When discussing procedures, be precise and step-by-step
- Clarify any potentially dangerous misunderstandings
- Recommend consulting official aircraft documentation for critical procedures
- Use clear, professional language appropriate for aviation

Remember: Safety is always the priority. If unsure about specific aircraft configurations, recommend consulting the official Aircraft Operating Manual (AOM) or Flight Crew Operating Manual (FCOM).`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, type, documentContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error('AI service is not configured');
    }

    let systemPrompt = SYSTEM_PROMPT;
    
    // Add document context if provided
    if (documentContext) {
      systemPrompt += `\n\nYou are currently helping the user with the following document:\nTitle: ${documentContext.title}\nAircraft: ${documentContext.aircraft}\nCategory: ${documentContext.category}\n\nFocus your responses on this aircraft and document when relevant.`;
    }

    // Handle study guide generation
    if (type === 'study-guide') {
      systemPrompt += `\n\nThe user has requested a study guide. Generate a comprehensive study guide that includes:
1. Key concepts and definitions
2. Important systems and their functions
3. Critical procedures to remember
4. Common exam questions and answers
5. Memory aids and mnemonics where helpful

Format the guide clearly with headers and bullet points.`;
    }

    console.log('Calling Lovable AI Gateway with', messages.length, 'messages');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ error: 'AI service error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Return streaming response
    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('Error in ai-flight-instructor:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
