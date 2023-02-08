import express from "express"
import { z } from "zod"
export const router = express.Router()
import prisma from "./db/prisma"


 

router.post("/signup",(req,res)=>{

   /*  const signupSchema = z.object({
        firstName: z.string().min(2).max(50),
        
    }) */

    const {firstName,lastName,email,password,confirmPassword } = req.body
    res.json(req.body)
})
router.post("/login", (req,res)=>{
    const {email,password} = req.body
    res.json({
        status:"success",
        email:email,
        role: "USER"
        // token: token,
    })
})