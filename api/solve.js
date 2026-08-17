export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    const { image } = await req.json();

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

    // 🔥 GỌI OPENAI (ĐÚNG FORMAT CHO IMAGE)
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
                  "画像内の選択式問題を読み取り、必ず次の形式だけで答えよ：『問題番号の回答は番号のみ』。例：問題2の回答は3。説明禁止。1行のみ。",
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

    // 🔍 DEBUG (nếu cần xem log trên Vercel)
    console.log(JSON.stringify(data));

    const answer =
      data?.output?.[0]?.content?.[0]?.text || "再読込み開始します";

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
