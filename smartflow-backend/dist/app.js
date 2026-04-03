import express from "express";
import "dotenv/config";
import controller from './router/controller.js';
import cookieParser from "cookie-parser";
import { Connect_MongoDB } from "./db/connection.js";
await Connect_MongoDB();
const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api', controller);
app.listen(PORT, () => { console.log('server started'); });
//# sourceMappingURL=app.js.map