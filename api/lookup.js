export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { ro_number } = req.body;

  // Your ADAS_Schedule spreadsheet ID
  const SPREADSHEET_ID = "1hsPuwVq0TqjarCtUr2VvR_L9E4zqsYMRund6EGfl5jQ";

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Schedule!A2:M`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const rows = data.values || [];

    const row = rows.find(r => r[2] === ro_number); // column C = ro_number

    if (!row) {
      return res.json({ found: false });
    }

    return res.json({
      found: true,
      ro_number: row[2],
      shop: row[1],
      vehicle_year: row[4],
      vehicle_make: row[5],
      vehicle_model: row[6],
      system: row[7],
      status: row[8],
      notes: row[10] || "N/A"
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch data" });
  }
}
