const router = require('express').Router()


router.post('/', (req, res)=>{
    console.log("hello")
    res.send("hello")
})


module.exports = router;