export const config = {
runtime: "edge",
};

export default async function handler(req) {
try {
const { image, prompt } = await req.json();

if (!image) {
return new Response(
JSON.stringify({ error: "Missing image base64" }),
{ status: 400 }
);
}

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
return new Response(
JSON.stringify({ error: "Missing OPENAI_API_KEY" }),
{ status: 500 }
);
}

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
{ type: "input_text", text: prompt || "Solve this image" },
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

return new Response(JSON.stringify(data), {
headers: { "Content-Type": "application/json" },
});
} catch (err) {
return new Response(JSON.stringify({ error: err.message }), {
status: 500,
});
}
}
