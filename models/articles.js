const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    site: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true,
        unique: true
    },
    headline: {
        type: String,
        required: true
    },
    summary: {
        type: String,
    },
    byline: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "comments"
    }]
});

let Article = mongoose.model("Articles", ArticleSchema);
module.exports = Article;
