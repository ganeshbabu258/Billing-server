const express = require("express");
const { Client } = require("pg");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());


const client = new Client({
  connectionString: process.env.DATABASE_URL, 
  ssl: {
    rejectUnauthorized: false,
  },
});


client.connect((err) => {
  if (err) {
    console.log("Error connecting to PostgreSQL:", err);
  } else {
    console.log("Connected to PostgreSQL Database!");

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        address VARCHAR(255),
        total NUMERIC(10, 2)
      );
    `;

    client.query(createTableQuery, (err, result) => {
      if (err) {
        console.log("Error creating table:", err);
      } else {
        console.log("Customers Table Created:", result);
      }
    });
  }
});

app.post("/save-billing", (req, res) => {
  const { billTo, billToEmail, billToAddress, total } = req.body;

  const sql = `INSERT INTO customers (name, email, address, total) VALUES ($1, $2, $3, $4)`;

  client.query(sql, [billTo, billToEmail, billToAddress, total], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).send("Server error");
    }
    res.status(200).send("Billing details saved successfully!");
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(Server is running on port ${PORT});
});
