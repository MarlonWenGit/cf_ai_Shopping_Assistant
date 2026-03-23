import { PREPROMPT, USER_QUESTION_PREPROMPT, UPDATE_RATING_PREPROMPT, SELLER_QUESTION_PREPROMPT } from "./preprompts.js";

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
    }

    const response = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
      messages: body.chat_history,
      system: PREPROMPT
    });

    return Response.json({ response: response.response, chat_history: body.chat_history }, { headers: corsHeaders });
  }
};