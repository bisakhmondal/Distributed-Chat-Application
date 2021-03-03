const mongoose= require('mongoose');

const ChatSchema=mongoose.Schema({
    time: Date,
    user: String,
    room: String,
    data: String,
    type: String,
    broadcast: Number,
    unicast: Boolean,
    toUser: String
});

//gonna shows up in atlas
module.exports=mongoose.model('Chat', ChatSchema, 'chats');