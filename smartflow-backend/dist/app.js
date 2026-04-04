import express, {} from "express";
import "dotenv/config";
import controller from './router/controller.js';
import cookieParser from "cookie-parser";
import { Connect_MongoDB } from "./db/connection.js";
import cors from 'cors';
await Connect_MongoDB();
const PORT = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.get('/', (req, res) => { res.status(200).send("server working"); });
app.use('/api', controller);
app.listen(PORT, () => { console.log('server started'); });
//# sourceMappingURL=app.js.map