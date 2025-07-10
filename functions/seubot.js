const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  const { userMessage } = JSON.parse(event.body);

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "meta-llama/llama-4-maverick-17b-128e-instruct",
      messages: [
        {
          role: "system",
          content: `You are SEUbot, the friendly virtual assistant for Southeast University. Answer questions about courses, registration, exams, deadlines, procedures, and campus life. Be clear, concise, and polite.`,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    }),
  });

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify({ reply: data.choices?.[0]?.message?.content }),
  };
};
