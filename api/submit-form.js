export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const G_SHEET_KEY = process.env.G_SHEET_KEY;
  const G_SHEET_TOKEN = process.env.G_SHEET_TOKEN;

  if (!G_SHEET_TOKEN) {
    return res.status(500).json({ error: "G_SHEET_TOKEN not set" });
  }
  if (!G_SHEET_KEY) {
    return res.status(500).json({ error: "G_SHEET_KEY not set" });
  }

  const GOOGLE_SCRIPT_URL = `https://script.google.com/macros/s/${G_SHEET_KEY}/exec`;

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...req.body, token: G_SHEET_TOKEN }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to forward data", details: error.toString() });
  }
}
