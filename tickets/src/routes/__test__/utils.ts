import mongoose from "mongoose";
export function getInvalidId() {
    return new mongoose.Types.ObjectId().toHexString();
}