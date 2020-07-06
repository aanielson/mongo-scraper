var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Set Handlebars....
// var exphbs = require("express-handlebars");

// app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");

// // Import routes and give the server access to them.
// var routes = require("./controllers/articlesController.js");

// Configure middleware

// Use logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

// Article Scraping Routes

// A GET route for scraping the NEWS website
app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("h#").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Now, we grab every h2 within an article tag, and do the following:
        $("article h2").each(function (i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, log it
                    console.log(err);
                });
        });

        // Send a message to the client
        res.send("Scrape Complete");
    });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
    // TODO: Finish the route so it grabs all of the articles
    db.Article.find({})
        .then(function (dbArticles) {
            // View the added result in the console
            console.log(dbArticles);
        })
        .catch(function (err) {
            // If an error occurred, log it
            console.log(err);
        });
});

// Route for grabbing a specific Article by id, populate it with it's COMMENT
app.get("/articles/:id", function (req, res) {
    // TODO
    // ====
    db.Article.findOne({ where: { id: req.params.id } })
        .populate("comment")
        .then(function (dbArticles) {
            res.json(dbArticles);
        })
        .catch(function (err) {
            // If an error occurs, send it back to the client
            res.json(err);
        });
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "comment",
    // then responds with the article with the comment included
});

// Route for saving/updating an Article's associated COMMENT
app.post("/articles/:id", function (req, res) {
    // save the new comment that gets posted to the COMMENT collection
    db.Comment.create(req.body)
        // then find an article from the req.params.id
        .then(function (dbComment) {
            return db.Article.findOneAndUpdate({}, { $push: { comment: dbComment._id } }, { new: true });
        })
        .then(function (dbArticle) {
            // If the Article was updated successfully, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurs, send it back to the client
            res.json(err);
        });
    // and update it's "COMMENT" property with the _id of the new COMMENT
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});