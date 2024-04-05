const express = require('express');
const { Pool } = require('pg');
const app = express();

// Connect to the PostgreSQL database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use environment variable to store connection info
});

// Middleware to parse JSON bodies
app.use(express.json());

// Route to add a car
app.post('/add-car', async (req, res) => {
  const { name, number } = req.body;
  await pool.query('INSERT INTO cars(name, number) VALUES($1, $2)', [name, number]);
  res.send('Car added successfully!');
});

// Route to get all cars
app.get('/cars', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM cars');
  res.json(rows);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
