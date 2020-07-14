var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SavedSchema = new Schema({
    savedId: {
        type: String,
        required: true,
        unique: true
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
});

var Saved = mongoose.model("Saved", SavedSchema);

module.exports = Saved;