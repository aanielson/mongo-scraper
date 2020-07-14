// const Handlebars = require('handlebars');
// const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
// //NOTE: expressHandlebars is the express-handlebars node package
// app.engine('handlebars', expressHandlebars({
//     //IMPORTANT
//     handlebars: allowInsecurePrototypeAccess(Handlebars)
//     //Other config goes here
// }));

var express = require("express");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

///==================Configure middleware==================
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI), { useNewUrlParser: true };

// // Set Handlebars....
// var exphbs = require("express-handlebars");
// app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");

// Import routes and give the server access to them.
//for the controller and handlebars usage
// var routes = require("./controllers/articlesController.js");
// app.use(routes);

//==================Article Scraping Routes==================

// A GET route for scraping the NEWS website
app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.deseret.com/latest").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Now, we grab every h2 within an article tag, and do the following:
        $("h2").each(function (i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)  
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");
            // result.image= $(this)
            //     .children("a")
            //     .children("div")
            //     .children("img")
            //     .attr("src");
            if (!result.title) {
                result.title = "Article title not available";
            }
            if (!result.link) {
                result.link = "Link Not Available";
            }
            console.log(result);
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
    console.log("articles route goes")
    db.Article.find({})
        .sort("-date")
        .lean()
        .then(function (dbArticles) {
            // View the added result in the console
            res.json(dbArticles);
        })
        .catch(function (err) {
            // If an error occurred, log it
            console.log(err);
        });
});

// Route for grabbing a specific Article by id, populate it with it's COMMENT
app.get("/articles/:id", function (req, res) {
    db.Saved.findOne({ where: { id: req.params.id } })
        .populate("comment")
        .then(function (dbArticles) {
            res.json(dbArticles);
        })
        .catch(function (err) {
            // If an error occurs, send it back to the client
            res.json(err);
        });
});

// Route for saving/updating an Article's associated COMMENT
app.post("/articles/:id", function (req, res) {
    // save the new comment that gets posted to the COMMENT collection
    db.Comment.create(req.body)
        // then find an article from the req.params.id
        .then(function (dbComment) {
            return db.Saved.findOneAndUpdate({}, { $push: { comment: dbComment._id } }, { new: true });
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

app.get("/saved-articles", function(req, res) {
    db.Saved.find({})
        .populate("Saved")
        .then(function (dbSaved) {
            res.json(dbSaved);
        })
        .catch(function (err) {
            res.json(err);
        });
})

app.get("/saved-articles/:id", function(req, res) {
    db.Saved.findOne({ _id: req.params.id })
    .then(function(dbSaved) {
        res.json(dbSaved);
    })
    .catch(function(err) {
        res.json(err);
    });
});

//creating a new saved article with data from the scraped articles
app.post("/saved-articles", function(req, res) {
    db.Saved.create(req.body)
        .then(function(dbSaved) {
            res.json(dbSaved);
        })
        .catch(function(err) {
            res.json(err);
        });
});

//updating a comment?
app.post("/saved-articles/:id", function(req, res) {
    if(req.body.delete) {
        db.Saved.deleteOne({ _id: req.params.id })
        .then(function (dbSaved) {
            res.json(dbSaved);
        })
        .catch(function (err) {
            res.json(err);
        });
    } else {
        db.Saved.findOneAndUpdate(
            { _id: req.params.id },
            { comment: req.body.note },
            { new: false }
        )
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
    }
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
