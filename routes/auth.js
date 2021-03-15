const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const jwtsct = process.env.JWT_SCT;

// router.get('/', (req, res) => {
//     res.send("hello")
// })

router.post('/signup', (req, res) => {
    const {name,email,password} = req.body
    if(!email || !password || !name){
     return res.status(422).json({error: "please fill all the fields"})
    }
    User.findOne({email:email})
    .then((savedUser) => {
        if(savedUser){
            return res.status(422).json({error: "user already registered"})
        }

        bcrypt.hash(password, 12)
            .then(hashedPassword => {
                const user = new User({
                    email,
                      name,
                       password: hashedPassword
                  })
          
                  user.save()
                  .then(user=>{res.json({message: "new user created"})})
                  .catch(err=>{console.log(err)})
              })
              .catch(err=>{console.log(err)})
            })     
})

router.post('/signin', (req, res) => {
    const {email,password} = req.body

    if(!email || !password){
        res.status(422).json({message: 'enter all fields'})
    }

    User.findOne({email: email})
     .then(savedUser => {
         if(!savedUser){
           return res.status(422).json({message: 'Invalid email or password'})
         }

         bcrypt.compare(password, savedUser.password)
         .then(doMatch=>{
             if(doMatch){
                 const token = jwt.sign({
                     _id: savedUser._id
                    }, jwtsct)
                    res.json({token})
             }
             else{
                return res.status(422).json({message: 'Invalid email or password'})
             }
         })
         .catch(err=>{console.log(err)})
     })
})

module.exports = router;