const express = require('express');
const { Pool } = require('pg');
const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // PostgreSQL connection string from environment variable
});

app.use(express.json()); // Middleware to parse JSON bodies

// Route to add a car
app.post('/add-car', async (req, res) => {
  const { name, number } = req.body;
  try {
    await pool.query('INSERT INTO cars(name, number) VALUES($1, $2)', [name, number]);
    res.send('Car added successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding the car to the database');
  }
});

// Route to get all cars
app.get('/cars', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM cars');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving cars from the database');
  }
});

// Health check route
app.get('/health', (req, res) => res.send('OK'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
