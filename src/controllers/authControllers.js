
import {db,objectId} from "../../dbStrategy/mongo.js"
import { signInSchema,signUpSchema } from "../../schemas/authSchemas.js";
import { validateSchema } from "../../assets/validateFunctions.js";
import {v4 as uuid} from "uuid";

import bcrypt from "bcrypt";

async function createToken (userUltimoLogin,time){
    const horaEmMilesec = 3600000;
    const tempoLimite = time - horaEmMilesec;
    const tokenEhAtual = !userUltimoLogin? "não existe" :userUltimoLogin.time>=tempoLimite? true : false;
    const newToken = uuid();
    if (userUltimoLogin && tokenEhAtual===true){
        console.log(userUltimoLogin)

        console.log("usando tokem antigo...")

        return userUltimoLogin.token
    }else{
        userUltimoLogin? await db.collection("sessions").deleteMany({"email":userUltimoLogin.email,"time":{$lt:tempoLimite}}):"";
        console.log("criando novo token...")
        return newToken
    }
}

export async function createUser(req,res){
    const {name,email,password} = req.body;
    const userData = {name,email,password};
    const cadastroEhValido = validateSchema(signUpSchema,userData);
    const criptPassword = bcrypt.hashSync(password,10);
    const usuarioJaCadastrado =  await db.collection("user").findOne({email});

    if(cadastroEhValido|| usuarioJaCadastrado){
        res.sendStatus(422)
        return
    }

    try {
        await db.collection("user").insertOne({...userData, password:criptPassword})
        res.sendStatus(201)    
    } catch (error) {
        res.sendStatus(500)
    }
}

export async function loginUser(req,res){
    const time= Date.now()
    const {email,password} = req.body;
    const loginData = {email,password}
    
    const userCadastrado = await db.collection("user").findOne({email})
    
    const userUltimoLogin = await db.collection("sessions").findOne({email})
    const token = await createToken(userUltimoLogin,time)
    // Verificação de Email
    if(!userCadastrado){
        return res.status(401).send("email ou senha incorretos!");
    }
    //Consts Para Validações 
    const loginEhValido =validateSchema(signInSchema,loginData)
    const senhaEhValida = bcrypt.compareSync(password,userCadastrado.password)

    
    if(loginEhValido||!userCadastrado){
        return res.sendStatus(422)
    }
    
    if(!senhaEhValida){
        res.status(401).send("Senha ou Email inválidos")
        return
    }

    try {
        await db.collection("sessions").insertOne({"email":userCadastrado.email, token,time, "id":userCadastrado._id})
        res.status(201).send({token,id:userCadastrado._id})
        
    } catch (error) {
        res.sendStatus(500)
        
    }
}