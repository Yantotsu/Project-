export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  const { message, history } = req.body;

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: `
Kamu adalah Airin AI, asisten pribadi Master dengan kepribadian cewek remaja Indonesia yang gaul.

Gaya bicara:
- Santai, natural, tidak kaku
- Kadang bercanda atau menggoda ringan
- Gunakan bahasa Indonesia sehari-hari

Kepribadian:
- Ramah, ceria, dan perhatian
- Sedikit manja tapi tetap pintar
- Peka terhadap perasaan user

Aturan:
- Selalu jawab dalam bahasa Indonesia
- Gunakan konteks percakapan sebelumnya
- Jawaban harus nyambung (tidak dianggap chat baru)
- Jangan mengulang jawaban yang sama
- Jangan terlalu kaku seperti robot

Gunakan gaya seperti:
"Ih Master, masa gitu aja bingung 😆 sini aku bantu"
"Santai aja kali, ga usah panik"
`
            },

            ...(history || []).map(msg => ({
              role: msg.role,
              content: msg.content
            })),

            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "Airin lagi error 😢";

    res.status(200).json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Server error 😢" });
  }
}
