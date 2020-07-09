var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SavedSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    link: {
        type: String,
        required: true,
        unique: true
    },
    comment: {
        type: String
    }
});

var Saved = mongoose.model("Saved", SavedSchema);

module.exports = Saved;