const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    "ip": {
        type: String,
        required: true
    },
    "stock": {
      type: String,
      required: true
    }
});

const likeModel = mongoose.model("Like", likeSchema)

/* Example:
    "_id": "5871dda29faedc3491ff93bb",
    "ip": "127.0.0.1" <--- needs to be hashed later on!!!
    */

module.exports = likeModel;