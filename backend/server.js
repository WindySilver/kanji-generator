import express from "express";
import cors from "cors";
import mariadb from 'mariadb';
import { loadEnvFile } from "node:process";

const app = express();

const CORS_OPTIONS = {
  origin: ["http://localhost:5173"]
};

// Loads environment variables from the default .env file
loadEnvFile();
//console.log(process.env);

app.use(cors(CORS_OPTIONS));

const pool = mariadb.createPool({
    host: 'localhost',
    port: 3306,
    user: process.env.user,
    password: process.env.password,
    database: 'kanjilist',
    connectionLimit: 5 // Adjust as needed
});

console.log("Connection pool created.");

var kanjilist = [];

async function executeDatabaseOperations() {
    let conn;
    try {
        conn = await pool.getConnection(); // Get a connection from the pool

        // --- SELECT Query ---
        // TODO: Implement request parameters once there's UI for selecting them
        const rows = await conn.query("SELECT * from kanji;");
        console.log("Selected Rows:", rows);
        kanjilist = rows;

        // --- INSERT Query (with parameters for security) ---
        // TODO: Find the easiest way to fill the database
        //const res = await conn.query("INSERT INTO your_table_name (name, status) VALUES (?, ?)", ["New Entry", "pending"]);
        //console.log("Insert Result:", res); // res will contain { affectedRows: 1, insertId: ..., warningStatus: 0 }

    } catch (err) {
        console.error("Database operation error:", err);
        throw err; // Re-throw to handle higher up
    } finally {
        if (conn) {
            conn.release(); // Release connection back to the pool
            console.log("Connection released to pool.");
        }
    }
}

app.get("/", (req, res) => {

    var selectedLevels = [req.query.one === 'true', req.query.two === 'true', req.query.three === 'true', req.query.four === 'true', req.query.five === 'true']
    console.log(selectedLevels)
    if(!selectedLevels[1] && !selectedLevels[0] && !selectedLevels[1] && !selectedLevels[2] && !selectedLevels[4]){
        res.status(400).send('No selected JLPT levels');
        return;
    }
    
  // Call the async function
  executeDatabaseOperations() //TODO: Send data from user (levels and number of kanji (which is TODO))
    .then(() => console.log("All database operations attempted."))
    .catch((err) => console.error("Overall operation failed:", err))
    .finally(() => {
    res.json(kanjilist);
    });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
