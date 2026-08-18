export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    const { image, prompt } = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ answer: "再読込み開始します" }),
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ answer: "APIキーエラー" }),
        { status: 500 }
      );
    }

    // ✅ FIX: đảm bảo luôn có prefix cho ảnh
    const base64Image = image.startsWith("data:")
      ? image
      : `data:image/jpeg;base64,${image}`;

    // ✅ GỌI OPENAI (chuẩn cho ảnh)
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text:
                  prompt ||
                  "画像内の選択式問題を読み取り、必ず『問題番号の回答は番号のみ』の形式で1行だけ答えよ。説明禁止。",
              },
              {
                type: "input_image",
                image_url: base64Image,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    // 🔍 lấy câu trả lời
    const answer =
      data?.output?.[0]?.content?.[0]?.text ||
      "再読込み開始します";

    return new Response(JSON.stringify({ answer }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ answer: "再読込み開始します" }),
      { status: 500 }
    );
  }
}
