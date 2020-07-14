//this is for the functionality of the "Saved Articles page"
var articleId;
var articleTitle;
var articleLink;

//pull in data from the database for "saved articles"
getSaved();

function getSaved() {
    $.getJSON("/saved-articles", function (data) {
      console.log(data);

      for (var i = 0; i < 10; i++) {
        articleId = data[i]._id;
        articleTitle = data[i].articleTitle;
        articleLink = data[i].articleLink;
  
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
        $(articleCardHead).append(articleHeadline);
        
        //Create display for comments
        var articleCardBody = $("<div class='card-body text-center'>");
        $(articleCardBody).attr("id", "card-body-" + articleId);
        var commentForm = $("<textarea id='bodyinput' name='body' class='mt-2'>");
        //comment button and delete button
        var commentButton = $("<br><a class='btn btn-success articleComment'>");
        $(commentButton).attr("id", articleId);
        $(commentButton).attr("data-title", articleTitle);
        $(commentButton).attr("data-link", articleLink);
        $(commentButton).text("NEW COMMENT");
        $(articleCardBody).append(commentForm, commentButton);
        
        //create footer for delete button
        var articleCardFooter = $("<div class='card-footer text-center'>");
        var deleteButton = $("<a class='btn btn-danger deleteSaved ml-1'>");
        $(deleteButton).attr("id", articleId);
        $(deleteButton).attr("data-title", articleTitle);
        $(deleteButton).attr("data-link", articleLink);
        $(deleteButton).text("DELETE FROM SAVED");
        //append footer with delete button
        $(articleCardFooter).append(deleteButton);

        //append both the card-header and card-body to the full article div
        $(articleCardDiv).append(articleCardHead, articleCardBody, articleCardFooter);
        console.log(articleCardDiv);
        //append the #articles display with each new article card
        $("#articles").append(articleCardDiv);
      }
    });
  };
//display each in a card
//each card header has a title linked to the actual article
//each card header has a "delete from saved" button 
//each card has a "article comments" button that brings up a modal
//the modal displays the article ID in the card header
//the modal displays all associated notes as well as a "delete" button that destroys the note from the table
//the modal displays a text box form with a submit button for new notes

//if display is empty, show "Looks like you haven't saved any articles" with a link back the the home tab to "browse articles"

//create comment in Saved collection then prepend the card body of the associated saved article
$(document).on("click", "#articleComment", function () {
    //take the id and use it in a put
    var savedId = $(this).attr("id");
    articleTitle = $(this).attr("data-title");
    articleLink = $(this).attr("data-link");
    var commentBody = $("#bodyinput").val();
    console.log(articleTitle);
    console.log(articleLink);
    //
    $.ajax({
        method: "POST",
        url: "/articles/" + savedId,
        data: {
            // _id,
            // articleTitle,
            // articleLink,
            // savedId
            commentBody
        }
    }).then(function (res) {
        console.log(res);
        //prepend the "card-body-" + savedId div with each new comment
        $.ajax({

        }).then(function(res) {
            var commentDisplay = $("#card-body" + savedId);
            $(commentDisplay).prepend(res + "<br>");
        })
        
    });
});

