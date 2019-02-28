const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let CommentSchema = new Schema({
    title: {
        type: String,
        trim: true,
    },
    comment: {
        type: String,
        trim: true,
        required: true
    },
    author: {
        type: String,
        required: true,
        trim: true,
    }
})

let Comments = mongoose.model("comments", CommentSchema);

module.exports = Comments;