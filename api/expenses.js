// A simple in-memory array to store expenses.
// NOTE: For production, you would replace this with a database (e.g., MongoDB, PostgreSQL).
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

// Helper function to send a JSON response
const sendResponse = (res, statusCode, data) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(statusCode).json(data);
};

// Main serverless function handler
module.exports = async (req, res) => {
  const { method } = req;

  // --- GET Request Handler ---
  if (method === 'GET') {
    // Respond with the list of all expenses (simulating "get all")
    sendResponse(res, 200, {
      success: true,
      data: expenses,
    });
    return;
  }

  // --- POST Request Handler ---
  if (method === 'POST') {
    // Vercel's Node.js runtime automatically parses the body for 'application/json'
    const { amount, description, category, date } = req.body;

    // 1. Error Handling: Check for required fields
    if (!amount || !description || !category || !date) {
      return sendResponse(res, 400, {
        success: false,
        message: 'Missing required fields: amount, description, category, and date are all required.',
      });
    }
    
    // 2. Error Handling: Basic type validation
    if (typeof amount !== 'number' || isNaN(new Date(date).getTime())) {
        return sendResponse(res, 400, {
            success: false,
            message: 'Invalid data types: amount must be a number and date must be a valid date string.',
        });
    }

    // 3. Create and add new expense
    const newExpense = {
      id: nextId++,
      amount: parseFloat(amount), // Ensure amount is a number
      description: String(description),
      category: String(category),
      date: String(date),
    };

    expenses.push(newExpense);

    // Respond with the newly created expense
    sendResponse(res, 201, {
      success: true,
      message: 'Expense added successfully.',
      data: newExpense,
    });
    return;
  }

  // --- Method Not Allowed Handler ---
  // For any method other than GET or POST
  sendResponse(res, 405, {
    success: false,
    message: `Method ${method} Not Allowed`,
  });
};
