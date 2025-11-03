import { createConnection } from "mysql2";
import { configDotenv } from "dotenv";
configDotenv();

const conn = createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    pool: 10,
    waitForConnections: true
});

conn.connect((err) => {
    if (err) console.log(err);
    else console.log("Database connected");
})

export { conn };