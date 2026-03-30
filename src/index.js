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

function get_preprompt_placeholder(prepromptType) {
  return "You were tasked to: ${prepromptType}. This would have been the ${prepromptType}_PREPROMPT, but it has been replaced with this placeholder to improve your text parsing speeds."
}

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

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

    let chat_history_copy = body.chat_history.slice();

    if (body.promptType == "start") {
      body.chat_history.push(
        { role: "user", content: PREPROMPT },
        { role: "assistant", content: "I have read and understood the preprompt. I am ready to begin." },
        { role: "user", content: get_preprompt_placeholder("USER_QUESTION") },
      )
      chat_history_copy.push(
        { role: "user", content: PREPROMPT + USER_QUESTION_PREPROMPT },
        { role: "assistant", content: "I have read and understood the preprompt. I am ready to begin." },
        { role: "user", content: USER_QUESTION_PREPROMPT },
      )
    } else if (body.promptType == "get next user question") {
      body.chat_history.push({ role: "user", content: get_preprompt_placeholder("GET_NEXT_USER_QUESTION") })
      chat_history_copy.push({ role: "user", content: USER_QUESTION_PREPROMPT })
    } else if (body.promptType == "update rating") {
      body.chat_history.push({ role: "user", content: get_preprompt_placeholder("UPDATE_RATING") + "This is what the user responded to your previous question with:" + body.prompt })
      chat_history_copy.push({ role: "user", content: UPDATE_RATING_PREPROMPT + body.prompt })
    } else if (body.promptType == "finish questioning") {
      body.chat_history.push({ role: "user", content: get_preprompt_placeholder("GET_SELLER_QUESTIONS") });
      chat_history_copy.push({ role: "user", content: SELLER_QUESTION_PREPROMPT });
    } else if (body.promptType == "get overallVerdictSummary") {
      body.chat_history.push({ role: "user", content: SUMMARY_PREPROMPT + OVERALL_VERDICT_SUMMARY });
      chat_history_copy = body.chat_history.slice();
    } else if (body.promptType == "get strengthsSummary") {
      body.chat_history.push({ role: "user", content: SUMMARY_PREPROMPT + STRENGTHS_SUMMARY });
      chat_history_copy = body.chat_history.slice();
    } else if (body.promptType == "get concernsSummary") {
      body.chat_history.push({ role: "user", content: SUMMARY_PREPROMPT + CONCERNS_SUMMARY });
      chat_history_copy = body.chat_history.slice();
    } else if (body.promptType == "get recommendationSummary") {
      body.chat_history.push({ role: "user", content: SUMMARY_PREPROMPT + RECOMMENDATIONS_SUMMARY });
      chat_history_copy = body.chat_history.slice();
    } 

    const response = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
      messages: chat_history_copy,
    });

    return Response.json({ response: response.response, chat_history: body.chat_history }, { headers: corsHeaders });
  }
};