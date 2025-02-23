 import { Chat } from "../models/chat.model.js";
 import { Message } from "../models/mesaage.model.js";
 import { asyncHandler } from "../utiles/asynHandler.js";
 import { ApiError } from "../utiles/apiError.js";
 import { apiResponse } from "../utiles/apiResponse.js";



 const sendMessage = asyncHandler(async (req, res) => {
    try {
        const senderId = req.user.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        if (!message) {
            throw new ApiError(400, "Message content is required");
        }

        let chat = await Chat.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!chat) {
            chat = await Chat.create({
                participants: [senderId, receiverId],
                messages: []
            });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });

        chat.messages.push(newMessage._id); 

        await Promise.all([chat.save(), newMessage.save()]);

        return res.status(200).json(
            new apiResponse(200, newMessage, "Message sent successfully")
        );
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Something went wrong while sending the message");
    }
});


const getMessage = asyncHandler(async (req, res) => {
    try {
        const senderId = req.user.id;
        const receiverId = req.params.id;

        const chat = await Chat.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("messages"); 

        if (!chat) {
            return res.status(200).json(
                new apiResponse(200, [], "No chat found")
            );
        }

        return res.status(200).json(
            new apiResponse(200, chat.messages, "Messages retrieved successfully")
        );
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Something went wrong while fetching messages");
    }
});



export {
    sendMessage,
    getMessage
}