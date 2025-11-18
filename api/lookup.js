import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { ro_number } = req.body;
    if (!ro_number) return res.json({ found: false });

    // Auth
    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/spreadsheets.readonly"]
    );

    const sheets = google.sheets({ version: "v4", auth });

    // Pull data from Schedule
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Schedule!A2:M",
    });

    const rows = result.data.values || [];

    const search = String(ro_number).trim();

    // Find by RO number (column C → index 2)
    const row = rows.find(r => String(r[2] || "").trim() === search);

    if (!row) return res.json({ found: false });

    return res.json({
      found: true,
      ro_number: row[2] || "N/A",
      shop: row[1] || "N/A",
      vehicle_year: row[4] || "N/A",
      vehicle_make: row[5] || "N/A",
      vehicle_model: row[6] || "N/A",
      system: row[7] || "N/A",
      status: row[8] || "N/A",
      notes: row[10] || "N/A"
    });

  } catch (err) {
    console.error("RO Lookup Error:", err);
    return res.json({ found: false });
  }
}
