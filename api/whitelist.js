import { google } from "googleapis";

export default async function handler(req, res) {
  try {
    const body = req.body;

    // Load service account from env
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });

    const sheets = google.sheets({ version: "v4", auth });

    const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
    const RANGE = "Schedule!A2:K";

    const row = [
      body.date,
      body.shop,
      body.ro_number,
      body.vin || "",
      body.vehicle_year,
      body.vehicle_make,
      body.vehicle_model,
      body.system,
      body.status,
      body.tech,
      body.notes || ""
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
      valueInputOption: "RAW",
      requestBody: {
        values: [row],
      },
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.toString() });
  }
}
