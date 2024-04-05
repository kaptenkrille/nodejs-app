const express = require('express');
const { Pool } = require('pg');
const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // PostgreSQL connection string from environment variable
});

app.use(express.json()); // Middleware to parse JSON bodies

// Define a root path route handler
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Node.js PostgreSQL Car API</title>
    </head>
    <body>
      <h1>Welcome to the Node.js PostgreSQL Car API!</h1>
      <ul>
        <li><a href="/cars">View Cars</a> - GET /cars</li>
        <li><a href="/add-car">Add a Car</a> - POST /add-car (Use a tool like Postman or a similar HTTP client to test this route.)</li>
        <li><a href="/health">Health Check</a> - GET /health</li>
      </ul>
    </body>
    </html>
  `);
});

// Route to add a car
app.post('/add-car', async (req, res) => {
  const { name, number } = req.body;
  try {
    await pool.query('INSERT INTO cars(name, number) VALUES($1, $2)', [name, number]);
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Car Added</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .message { color: green; }
        </style>
      </head>
      <body>
        <div class="message">Car added successfully!</div>
        <a href="/add-car">Add another car</a> | <a href="/cars">View Cars</a>
      </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error Adding Car</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .error { color: red; }
        </style>
      </head>
      <body>
        <div class="error">Error adding the car to the database. Please try again.</div>
        <a href="/add-car">Go back</a>
      </body>
      </html>
    `);
  }
});


// Route to get all cars
app.get('/cars', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM cars ORDER BY id ASC');
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Cars List</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          tr:nth-child(even) { background-color: #f9f9f9; }
        </style>
      </head>
      <body>
        <h1>List of Cars</h1>
        <table>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Number</th>
          </tr>`;
    
    rows.forEach(car => {
      html += `<tr>
                 <td>${car.id}</td>
                 <td>${car.name}</td>
                 <td>${car.number}</td>
               </tr>`;
    });
    
    html += `</table>
             <a href="/add-car">Add a New Car</a>
             </body>
             </html>`;
    
    res.send(html);
  } catch (err) {
    console.error(err);
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .error { color: red; }
        </style>
      </head>
      <body>
        <div class="error">Error retrieving cars from the database. Please try again.</div>
        <a href="/cars">Try Again</a>
      </body>
      </html>
    `);
  }
});


// Health check route
app.get('/health', (req, res) => res.send('OK'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

