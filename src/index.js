import { 
  PREPROMPT, 
  USER_QUESTION_PREPROMPT, 
  UPDATE_RATING_PREPROMPT, 
  SELLER_QUESTION_PREPROMPT, 
  SUMMARY_PREPROMPT,
  OVERALL_VERDICT_SUMMARY,
  STRENGTHS_SUMMARY,
  RECOMMENDATIONS_SUMMARY,
  CONCERNS_SUMMARY
} from "./preprompts.js";

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    try {
      if (request.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
      }

      if (request.url.endsWith("/favicon.ico")) {
        return new Response(null, { status: 204 });
      }

      if (request.method !== "POST") {
        return new Response("Send a POST request with JSON body { prompt: '...' }", {
          status: 405, 
          headers: corsHeaders
        });
      }

      let body;
      try {
        body = await request.json();
      } catch (err) {
        return new Response("Invalid JSON", { status: 400, headers: corsHeaders });
      }

      if (body.promptType == "start") {
        body.chat_history.push(
          { role: "assistant", content: "I have read and understood the preprompt. I am ready to begin." },
          { role: "user", content: PREPROMPT + USER_QUESTION_PREPROMPT }
        )
      } else if (body.promptType == "get next user question") {
        body.chat_history.push({ role: "user", content: USER_QUESTION_PREPROMPT })
      } else if (body.promptType == "update rating") {
        body.chat_history.push({ role: "user", content: UPDATE_RATING_PREPROMPT + body.prompt })
      } else if (body.promptType == "finish questioning") {
        body.chat_history.push({ role: "user", content: SELLER_QUESTION_PREPROMPT });
      } else if (body.promptType == "get overallVerdictSummary") {
        body.chat_history.push({ role: "user", content: SUMMARY_PREPROMPT + OVERALL_VERDICT_SUMMARY });
      } else if (body.promptType == "get strengthsSummary") {
        body.chat_history.push({ role: "user", content: SUMMARY_PREPROMPT + STRENGTHS_SUMMARY });
      } else if (body.promptType == "get concernsSummary") {
        body.chat_history.push({ role: "user", content: SUMMARY_PREPROMPT + CONCERNS_SUMMARY });
      } else if (body.promptType == "get recommendationSummary") {
        body.chat_history.push({ role: "user", content: SUMMARY_PREPROMPT + RECOMMENDATIONS_SUMMARY });
      } 

      const response = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
        messages: body.chat_history
      });

      return Response.json({ response: response.response, chat_history: body.chat_history }, { headers: corsHeaders });

    } catch (err) {
      return new Response(
        JSON.stringify({ error: err.message, stack: err.stack }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }
};