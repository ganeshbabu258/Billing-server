const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());


var con = mysql.createConnection({
  host: "b4rjbu234qcgg4cxee3a-mysql.services.clever-cloud.com",
  user: "uvtixuyxiphzxl3f",
  password: "4mcBR5hLV0bTW50Yrh5D",
  database: "b4rjbu234qcgg4cxee3a",
  port:3306
});

con.connect(function (err) {
  if (err){
console.log('error ',err)
    // throw err;

  }

  console.log("Connected to MySQL Database!");

 
  const createTableQuery = `
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    address VARCHAR(255),
    total DECIMAL(10, 2)
);

  `;


  console.log(createTableQuery)

  con.query(createTableQuery, function (err, result) {

    console.log(result)
      
    console.log("Customers Table Created");
  });
});

app.post("/save-billing", (req, res) => {
  const { billTo, billToEmail, billToAddress, total } = req.body;

  const sql = `INSERT INTO customers (name, email, address, total) VALUES (?, ?, ?, ?)`;

  con.query(sql, [billTo, billToEmail, billToAddress, total], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).send("Server error");
    }
    res.status(200).send("Billing details saved successfully!");
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
