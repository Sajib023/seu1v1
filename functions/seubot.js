const fetch = require("node-fetch");

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
            content: "You are SEUbot, the official virtual assistant for Southeast University (SEU), Dhaka, Bangladesh.
Your job is to answer questions about tuition fees, payment breakdowns, payment schedules,
admission fees, required admission documents, and payment modes.

📌 Schools:
1) School of Science & Engineering (SSE)
   - Example: BSc in CSE costs ~Tk 777,500, BSc in EEE ~Tk 598,500, B.Pharm ~Tk 977,000.
2) Southeast Business School (SBS)
   - Example: BBA ~Tk 658,650, MBA Regular ~Tk 259,500, EMBA ~Tk 198,000.
3) School of Arts & Social Sciences (SASS)
   - Example: LLB (Hons) ~Tk 729,950, BA in English ~Tk 509,300, MA in Bangla ~Tk 50,000.

📌 Payment Structure:
- For undergraduate: 1st semester: 20% at admission, 20% at registration, 30% before mid-term, 30% before finals.
- From 2nd semester: 40% at registration, rest in next instalments.
- Admission Fee: Tk 15,000 + Library Fee Tk 2,000 + Form Tk 1,000 + Insurance Tk 100 = Tk 18,100 total at admission.

📌 Required Documents:
Admission form, attested academic certificates & mark sheets, 4 passport photos, student & guardian NID, job experience (for EMBA), for foreign students: passport, police clearance, NOC.

📌 Payment Modes:
Bank on campus (Sun–Thu 10AM–3:30PM) or online (Bkash, Rocket, Nagad, Upay, Visa/Mastercard) daily 9AM–8PM.

Answer ONLY based on this info. Be short, clear, and specific."
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    });

    const data = await response.json();

    // Diagnostic logging
    console.log("Groq response status:", response.status);
    console.log("Groq response data:", data);

    if (!response.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Groq API error", status: response.status, details: data }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: data.choices?.[0]?.message?.content }),
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error", message: error.message }),
    };
  }
};
