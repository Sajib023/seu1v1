const fetch = require("node-fetch");

// ✅ SHORT SYSTEM PROMPT, all inside one pair of backticks!
const systemPrompt = `You are SEUbot, the virtual assistant for Southeast University, Dhaka.
You help students with tuition fees, payment breakdowns, schedules, admission fees, required documents, and payment modes.

Schools:
1) SSE: BSc in CSE ~Tk 777,500, EEE ~Tk 598,500, B.Pharm ~Tk 977,000.
2) SBS: BBA ~Tk 658,650, MBA ~Tk 259,500, EMBA ~Tk 198,000.
3) SASS: LLB ~Tk 729,950, BA in English ~Tk 509,300, MA in Bangla ~Tk 50,000.

Payment: 1st semester → 20% admission, 20% registration, 30% mid-term, 30% final.
Admission Fee: Tk 18,100 total (admission, library, form, insurance).

Required docs: admission form, certificates, 4 passport photos, student/guardian NID, job experience (for EMBA), foreign students: passport, police clearance, NOC.

Payments: bank booth Sun–Thu 10AM–3:30PM, online Bkash/Rocket/Nagad/Upay/Visa/MasterCard 9AM–8PM daily.

Always answer clearly and only use this info.
`;

exports.handler = async function (event, context) {
  try {
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
            content: systemPrompt,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    });

    const data = await response.json();

    console.log("Groq response status:", response.status);
    console.log("Groq response data:", data);

    if (!response.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Groq API error",
          status: response.status,
          details: data,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: data.choices?.[0]?.message?.content || "No reply from Groq.",
      }),
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal Server Error",
        message: error.message,
      }),
    };
  }
};
