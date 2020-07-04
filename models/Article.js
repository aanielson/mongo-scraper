var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var ArticleSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true
  },
  //SUMMARY
  summary: {
    type: String,
    required: true
  },
  // `URL` is required and of type String
  link: {
    type: String,
    required: true
  },
  // `comment` is an object that stores a COMMENT id
  // The ref property links the ObjectId to the COMMENT model
  // This allows us to populate the Article with an associated COMMENT
  comment: {
    type: Schema.Types.ObjectId,
    ref: " Comment"
  }
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;