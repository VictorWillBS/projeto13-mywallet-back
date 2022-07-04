import {db,objectId} from "../../dbStrategy/mongo.js"
import {transSchema} from "../../schemas/transSchemas.js";
import { validateSchema } from "../../assets/validateFunctions.js";

export async function createTrasantion (req,res){
    const transation = req.body;
    const {id,name,value,description,date} = transation
    const postEhValido = validateSchema(transSchema,transation)

    if(postEhValido){
        return res.sendStatus(422)
    }

    const {authorization} = req.headers;
    const token = authorization?.replace('Bearer ', '');
    if(!token){
        return res.status(401).send("token inválido")
    }

    const sessions = await db.collection("sessions").findOne({"id":objectId(id),token})
    if(!sessions){
        return res.status(401).send("sessão não encontrada")
    }

    const user = await db.collection("user").findOne({_id : objectId(id) })
   
   
    try {
        const transacao = await db.collection("transactions").insertOne({...transation})
        res.status(201).send("transação concluída")
    } catch (error) {
        res.sendStatus(500)
    }
}

export async function getTrasantion (req,res){
    const {authorization,id} = req.headers  
    const token = authorization?.replace('Bearer ', '');
    if(!token){
        return res.status(401).send("token inválido")
    }

    const sessions= await db.collection("sessions").findOne({"id":objectId(id),token})
    if(!sessions){
        return res.status(401).send("sessão inválido")
    }
    try {
        console.log("procurando transacoes")
        const transactions = await db.collection("transactions").find({"id":id}).toArray()
        
        console.log(transactions)
        res.status(200).send([...transactions])
    } catch (error) {
        res.sendStatus(500)
    }
    

    
}