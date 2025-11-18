export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { caller_number } = req.body;
  const SPREADSHEET_ID = "1hsPuwYq0TqjarCtUr2VvR_L9E4zqsYMRund6EGfl5jQ";

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Whitelist!A2:C`;
  const response = await fetch(url);
  const data = await response.json();
  const rows = data.values || [];

  // Normalize caller number
  const cleanCaller = caller_number.replace(/[^\d+]/g, '');
  let normalizedCaller = cleanCaller;
  if (cleanCaller.length === 10) normalizedCaller = '+1' + cleanCaller;
  else if (cleanCaller.length === 11 && cleanCaller.startsWith('1')) normalizedCaller = '+' + cleanCaller;

  // Search for match
  const match = rows.find(row => String(row[0]).trim() === normalizedCaller);
  if (!match) {
    return res.json({ authorized: false, type: 'unknown' });
  }

  return res.json({
    authorized: true,
    type: match[1]?.toLowerCase() || "shop",
    name: match[2] || "Unknown"
  });
}
