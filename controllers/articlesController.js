var express = require("express");
var router = express.Router();
var axios = require("axios");
// Create the router for the app, and export the router at the end of your file.

// A GET route for scraping the NEWS website
router.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("#").then(function (response) {
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
router.get("/articles", function (req, res) {
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

// Route for grabbing a specific Article by id, populate it with it's comment
router.get("/articles/:id", function (req, res) {
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
    // and run the populate method with "commment",
    // then responds with the article with the comment included
});

// Route for saving/updating an Article's associated comment
router.post("/articles/:id", function (req, res) {
    // save the new comment that gets posted to the Comments collection
    db.Comment.create(req.body)
        // then find an article from the req.params.id
        .then(function (Comment) {
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
    // and update it's "comment" property with the _id of the new comment
});

// Export routes for server.js to use.
module.exports = router;