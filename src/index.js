import express,{json}from "express";
import cors from "cors";
import dotenv from "dotenv";
import chalk from "chalk"
import {createUser,loginUser} from "./controllers/authControllers.js"
import {createTrasantion,getTrasantion} from "./controllers/transationsControllers.js"
dotenv.config()
const app = express();
app.use(json());
app.use(cors());


// Auth Route 
app.post("/sign-up",createUser)
app.post("/sign-in",loginUser)

// Transaçõe Route
app.post("/transactions", createTrasantion)
app.get("/transactions", getTrasantion)

app.listen(5000,()=>{
    console.log(chalk.green("Servidor Funcionando"))
})