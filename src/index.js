import { PREPROMPT, USER_QUESTION_PREPROMPT, UPDATE_RATING_PREPROMPT, SELLER_QUESTION_PREPROMPT } from "./preprompts.js";

function getSystemPreprompt(step) {
  const map = {
    1: USER_QUESTION_PREPROMPT,
    2: UPDATE_RATING_PREPROMPT,
    3: SELLER_QUESTION_PREPROMPT
  };

  return PREPROMPT + map[step];
}

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Send a POST request with JSON body { prompt: '...' }", {
        status: 405
      });
    }

    let body;
    try {
      body = await request.json();
    } catch (err) {
      return new Response("Invalid JSON", { status: 400 });
    }

    const { prompt } = body;

    if (!prompt) {
      return new Response("Missing 'prompt' field", { status: 400 });
    }

    let chat_history = [];
    let step = 1;

    chat_history.push(
      { role: "system", content: getSystemPreprompt(step) },
    )

    const response = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
      messages: chat_history
    });

    return Response.json(response);
  }
};