const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));

const port = 3522;

const cors = require("cors");
app.use(cors());

const { Pool } = require("pg");
const pool = new Pool({
  user: "user_3522", // PostgreSQLのユーザー名に置き換えてください
  host: "db",
  database: "crm_3522", // PostgreSQLのデータベース名に置き換えてください
  password: "pass_3522", // PostgreSQLのパスワードに置き換えてください
  port: 5432,
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get("/customers", async (req, res) => {
  try {
    const customerData = await pool.query("SELECT * FROM customers");
    res.send(customerData.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/add-customer", async (req, res) => {
  try {
    const { companyName, industry, contact, location } = req.body;
    const newCustomer = await pool.query(
      "INSERT INTO customers (company_name, industry, contact, location) VALUES ($1, $2, $3, $4) RETURNING *",
      [companyName, industry, contact, location]
    );
    res.json({ success: true, customer: newCustomer.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

///customer/:customerId：顧客詳細画面にデータを持ってくる（特定の顧客IDに対する顧客情報を取得。）
app.get("/customer/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;
    const customerData = await pool.query("SELECT * FROM customers WHERE customer_id = $1", [customerId]);
    if (customerData.rows.length > 0) {
      res.send(customerData.rows[0]);
    } else {
      res.status(404).send("Customer not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
});
//削除（Delete）機能の追加
app.delete("/customer/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;
    const deleteResult = await pool.query("DELETE FROM customers WHERE customer_id = $1 RETURNING *", [customerId]);
    if (deleteResult.rowCount > 0) {
      res.json({ success: true, message: "Customer deleted" });
    } else {
      res.status(404).send("Customer not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
});
//編集（Update）機能の追加
app.put("/customer/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;
    const { companyName, industry, contact, location } = req.body; // 修正前のコードに戻る場合は、company_name に変更してください

    console.log('Received data:', companyName, industry, contact, location, customerId); // ログ出力

    const updateResult = await pool.query(
      "UPDATE customers SET company_name = $1, industry = $2, contact = $3, location = $4 WHERE customer_id = $5 RETURNING *",
      [companyName, industry, contact, location, customerId] // 修正前のコードに戻る場合は、company_name に変更してください
    );
    if (updateResult.rowCount > 0) {
      res.json({ success: true, customer: updateResult.rows[0] });
    } else {
      res.status(404).send("Customer not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err.message);
  }
});



app.use(express.static("public"));
