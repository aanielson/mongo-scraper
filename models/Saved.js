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
    class: {
        type: String,
        required: true
    },
    note: {
        type: String
    }
});

var Saved = mongoose.model("Saved", SavedSchema);

module.exports = Saved;