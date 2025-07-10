const fetch = require("node-fetch");

// SHORT & SAFE PROMPT — NO BACKTICKS INSIDE!
const systemPrompt = `You are SEUbot, the official virtual assistant for Southeast University, Dhaka, Bangladesh.
You answer questions about tuition fees, payment breakdowns, schedules, admission fees, required documents, and payment modes.

Schools:
1) SSE: BSc in CSE ~Tk 777,500, EEE ~Tk 598,500, B.Pharm ~Tk 977,000.
2) SBS: BBA ~Tk 658,650, MBA Regular ~Tk 259,500, EMBA ~Tk 198,000.
3) SASS: LLB (Hons) ~Tk 729,950, BA in English ~Tk 509,300, MA in Bangla ~Tk 50,000.

Payment: 1st semester: 20% at admission, 20% at registration, 30% mid-term, 30% finals.
Admission Fee: Tk 18,100 total.

Documents: admission form, academic papers, 4 passport photos, student & guardian NID, job experience (EMBA), for foreign students: passport, clearance, NOC.

Payment: bank booth Sun–Thu 10AM–3:30PM or online (Bkash, Rocket, Nagad, Upay, Visa/Mastercard) 9AM–8PM daily.

Use only this info to answer clearly and concisely.
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

    console
