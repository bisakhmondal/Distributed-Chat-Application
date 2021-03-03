const router = require('express').Router()
const UserSchema= require('../models/chat')
    


router.post('/', async (req, res)=>{
    try {
        const user= req.body.user
        const room= req.body.room
        let filter = {$or: [{room:room}, {broadcast:1}, {$and: [{unicast:true}, {toUser: user} ]}]}
        if(!user)
        filter = {$or: [{room:room}, {isBroadcast:1}]}
        const data = await UserSchema.find(filter, {_id:0})
        res.status(200).send(JSON.stringify(data))
    } catch (error) {
       res.status(500).send() 
    }
})


module.exports = router;