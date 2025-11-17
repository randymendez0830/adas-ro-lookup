export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { ro_number } = req.body;
  const SPREADSHEET_ID = "1hsPuwVq0TqjarCtUr2VvR_L9E4zqsYMRund6EGfl5jQ";

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Schedule!A2:M`;
  const response = await fetch(url);
  const data = await response.json();
  const rows = data.values || [];

  const search = String(ro_number).trim();

  // Find by string comparison (works even if Google Sheets stored it as number)
  const row = rows.find(r => String(r[2]).trim() === search);

  if (!row) return res.json({ found: false });

  return res.json({
    found: true,
    ro_number: row[2],
    shop: row[1] || "N/A",
    vehicle_year: row[4] || "N/A",
    vehicle_make: row[5] || "N/A",
    vehicle_model: row[6] || "N/A",
    system: row[7] || "N/A",
    status: row[8] || "N/A",
    notes: row[10] || "N/A"
  });
}
