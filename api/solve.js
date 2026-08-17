export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    const { image, prompt } = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ error: "Missing image" }),
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text:
                  prompt ||
                  "画像内の問題を読み取り、必ず『問題番号の回答は番号のみ』の形式で1行だけ返答せよ。",
              },
              {
                type: "input_image",
                image_url: `data:image/jpeg;base64,${image}`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    console.log(JSON.stringify(data));

const answer =
  data?.output?.[0]?.content?.[0]?.text || "不明";

    return new Response(JSON.stringify({ answer }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
