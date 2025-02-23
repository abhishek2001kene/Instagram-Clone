import mongoose from "mongoose";


const chatSchema = new mongoose.Schema({

    participents:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    messages:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Message"
        }
    ]

})

export const Chat = mongoose.model("Chat",chatSchema )