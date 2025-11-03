import e from "express";
import { employeeRouter } from "./router.js";
import { configDotenv } from "dotenv";
configDotenv();

const app = e();
const PORT = process.env.PORT || 5000;

app.use(e.json());

app.use('/api', employeeRouter);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));