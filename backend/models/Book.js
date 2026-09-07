const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    content: {
        type: String,
        default: "",
    },
});

const bookSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        ref: "User",
    },
    title: {
        type: String,
        required: true,
    },
    subtile: {
        type: String,
        default: true,
    },
    author: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
        default: true,
    },
    chapters: [chapterSchema],
    status: {
        type: String,
        enum: ["draft", "published"],
        default: "draft",
    }
}, {timestamps: true});

module.exports = mongoose.model("Book", bookSchema);