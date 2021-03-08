const router = require('express').Router()
const UserSchema= require('../models/chat')
    


router.post('/', async (req, res)=>{
    try {
        const user= req.body.user
        const room= req.body.room
        let filter = {$or: [{$and: [{room:room},{unicast:false}]}, {broadcast:1}]}
        if(!user)
        filter = {$or: [{room:room}, {isBroadcast:1}]}
        const data = await UserSchema.find(filter, {_id:0})
        res.status(200).send(JSON.stringify(data))
    } catch (error) {
       res.status(500).send() 
    }
})

router.post('/dm', async (req, res)=>{
    try {
        const user= req.body.user
        const room= req.body.room
        let filter = {$or: [{$and: [{unicast:true}, {user:user}] } ,{$and: [{unicast:true}, {toUser: user} ]}]}
        if(!user)
        filter = {$or: [{room:room}, {isBroadcast:1}]}
        const data = await UserSchema.find(filter, {_id:0})
        res.status(200).send(JSON.stringify(data))
    } catch (error) {
       res.status(500).send() 
    }
})


module.exports = router;
