



// In-memory storage for expenses
// Note: This resets on each deployment. Use a database for production.
const expenses = [
  {
    id: 1,
    amount: 50.75,
    description: "Groceries",
    category: "Food",
    date: "2025-12-01",
  },
  {
    id: 2,
    amount: 12.00,
    description: "Bus fare",
    category: "Transport",
    date: "2025-12-02",
  },
];

let nextId = 3;

module.exports = (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GET: Return all expenses
  if (req.method === 'GET') {
    res.status(200).json({
      success: true,
      data: expenses,
    });
    return;
  }

  // POST: Add a new expense
  if (req.method === 'POST') {
    const { amount, description, category, date } = req.body || {};

    // Validate required fields
    if (!amount || !description || !category || !date) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: amount, description, category, and date are all required.',
      });
      return;
    }

    // Validate data types
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      res.status(400).json({
        success: false,
        message: 'Invalid amount: must be a positive number.',
      });
      return;
    }

    if (isNaN(new Date(date).getTime())) {
      res.status(400).json({
        success: false,
        message: 'Invalid date: must be a valid date string.',
      });
      return;
    }

    // Create new expense
    const newExpense = {
      id: nextId++,
      amount: numAmount,
      description: String(description).trim(),
      category: String(category).trim(),
      date: String(date),
    };

    expenses.push(newExpense);

    res.status(201).json({
      success: true,
      message: 'Expense added successfully.',
      data: newExpense,
    });
    return;
  }

  // Method not allowed
  res.status(405).json({
    success: false,
    message: `Method ${req.method} not allowed.`,
  });
};
