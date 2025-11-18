export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { caller_number } = req.body;
  const SPREADSHEET_ID = "1hsPuwYq0TqjarCtUr2VvR_L9E4zqsYMRund6EGfl5jQ";

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Whitelist!A2:C`;
  const response = await fetch(url);
  const data = await response.json();
  const rows = data.values || [];

  // Normalize incoming number — strip everything except digits
  const incomingDigits = caller_number.replace(/[^\d]/g, '');

  // Search sheet — compare only digits
  const match = rows.find(row => {
    const sheetDigits = String(row[0] || "").replace(/[^\d]/g, '');
    return sheetDigits === incomingDigits;
  });

  if (!match) {
    return res.json({ authorized: false });
  }

  return res.json({
    authorized: true,
    type: (match[1] || "").toLowerCase() === "tech" ? "tech" : "shop",
    name: match[2] || "Unknown"
  });
}
