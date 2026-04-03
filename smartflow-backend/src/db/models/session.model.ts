import mongoose from "mongoose";

const sessionModel = new mongoose.Schema({
    accessToken: String,
    refreshToken: String
})

export const session = mongoose.model('session', sessionModel)