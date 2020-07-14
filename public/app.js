var articleId;
var articleTitle;
var articleLink;

getArticles();

//when "Scrape new articles" button is clicked, the display pulls articles in
// <10 articles
$(document).on("click", "#scrapeNew", function () {
  //should I add an ajax "DELETE"?
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).then(function () {
    $("#articles").empty();
    getArticles();
  });
});

function getArticles() {
  $.getJSON("/articles", function (data) {
    console.log(data);
    // $("#articles").append("<p>Accessing Articles ID</p>");
    
    for (var i = 0; i < 10; i++) {
      articleId = data[i]._id;
      articleTitle = data[i].title;
      articleLink = data[i].link;

      // Display the apropos information on the page as a card
      //each display is a card
      //card header has the title linked to the actual article
      //card body is a summary

      //create a card div for each article
      var articleCardDiv = $("<div>");
      
      $(articleCardDiv).attr("class", "card mb-2");

      //create a card-header div within each article card  
      var articleCardHead = $("<div>");
      $(articleCardHead).attr("class", "card-header");

      //fill the card-header with a linked article title
      var articleHeadline = $("<h3 class='float-left'>");
      var linkedHeadline = $("<a href=" + articleLink + ">")
      $(linkedHeadline).text(articleTitle);
      $(articleHeadline).append(linkedHeadline);
      var saveButton = $("<a class='btn btn-success save float-right'>");
      $(saveButton).attr("id", articleId);
      $(saveButton).attr("data-title", articleTitle);
      $(saveButton).attr("data-link", articleLink);
      $(saveButton).text("SAVE ARTICLE")
      $(articleCardHead).append(articleHeadline, saveButton);

      //append both the card-header and card-body to the full article div
      $(articleCardDiv).append(articleCardHead);
      console.log(articleCardDiv);
      //append the #articles display with each new article card
      $("#articles").append(articleCardDiv);
    }
  });
};

$(document).on("click", ".save", function () {
  //take the id and use it in a put
  articleTitle = $(this).attr("data-title");
  articleLink = $(this).attr("data-link");
  console.log(articleId);
  console.log(articleTitle);
  console.log(articleLink);
  //
  $.ajax({
    method: "POST",
    url: "/saved-articles",
    data: {
      articleTitle,
      articleLink
    }
  }).then(function (res) {
    console.log(res);
  });
});


//when "clear articles" button is clicked, the display is empltied and replaced with two buttons
//buttons = "try scraping new articles" and "Go to saved articles"
//"try scraping new articles" will have the same class as "Scrape new articles"
//"Go to saved articles" will be the same link as the navbar to "Saved Articles"