import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { caller_number } = req.body;
    if (!caller_number) {
      return res.json({ authorized: false });
    }

    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/spreadsheets.readonly"]
    );

    const sheets = google.sheets({ version: "v4", auth });

    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Whitelist!A2:C",
    });

    const rows = result.data.values || [];

    const incomingDigits = caller_number.replace(/[^\d]/g, "");

    const match = rows.find((row) => {
      const sheetDigits = String(row[0] || "").replace(/[^\d]/g, "");
      return sheetDigits === incomingDigits;
    });

    if (!match) {
      return res.json({ authorized: false });
    }

    return res.json({
      authorized: true,
      type: (match[1] || "").toLowerCase() === "tech" ? "tech" : "shop",
      name: match[2] || "Unknown",
    });
  } catch (err) {
    console.error("Whitelist error:", err);
    return res.json({ authorized: false });
  }
}
