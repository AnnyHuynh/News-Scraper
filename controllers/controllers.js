const cheerio = require("cheerio");
const request = require("request");
const express = require('express');
const router = express.Router();
const axios = require("axios");
const db = require("../models");
const phantom = require("phantom");


//dnd beyond scraper and filter
router.get("/scrape", function (req, res) {
    console.log("scrape hit");
    axios.get("https://moderndogmagazine.com/articles").then(function (response) {
        var $ = cheerio.load(response.data);
        var dummyArray = [];
        $("tr").each(function(i, element){
            var result= {};
            // var url = "https://moderndogmagazine.com";
            result.site = "Dog's Articles";
            result.url = $(this)
                .find("td").find("span").children("a").attr("href");
            result.image = $(this)
                .find("td").find("a").children("img");
            result.headline = $(this)
                .find("td").children("h2").text().trim();
            result.byline = $(this)
                .find("td").find("div").find("a").find("href");
            result.summary = $(this)
                .find("td").children("views-field-nothing");
           // result.published = $(this)
            //     .children().find(".post-excerpt__published").children("time").children("abbr").text();
            dummyArray.push(result);
        db.Article.create(result)
            .then(function(newArticle){
                
            }).catch(function(err){
                console.log("Couldn't create new articles");
            })
        });
        res.redirect("/");
    });
});

//dnd beyond filter
router.get("/view", function(req, res){
     db.Article.find({ site: "Dog's Articles"}, function(err, docs){
         if (err){console.log(err)};
         let dndInfo = {
             posts: docs
         };
         res.render("index", dndInfo);
     });
 })

//dnd wizard scraper
// router.get("/wotcscrape", function(req, res){
//     console.log("wotc scrape hit");
//     axios.get("http://dnd.wizards.com/articles").then(function (response) {
//         var $ = cheerio.load(response.data);
//         var dummyArray = [];
//         $(".article-preview").each(function(i, element){
//             var result = {};
//             var url = "http://dnd.wizards.com";

//             result.site = "Wizards";
//             result.url = url + $(this)
//                 .find(".actions").children("a").attr("href");
//             result.image = $(this)
//                 .find(".image").children("img").attr("src");
//             result.headline = $(this)
//                 .find(".text").children("h4").children("a").text().trim();
//             result.summary = $(this)
//                 .find(".summary").children("p").text().trim();
//             result.published = $(this)
//                 .find(".category").children("a").text().trim();
//         db.Article.create(result)
//             .then(function(newArticle){
//                 console.log("new articles created");
//             });
//         });
//     });
//     res.redirect("/");
//     });

// // wizards filter
// router.get("/wizards", function(req, res){
//     db.Article.find({ site: "Wizards"}, function(err, docs){
//         if (err){console.log(err)};
//         let wizInfo = {
//             posts: docs
//         };
//         res.render("index", wizInfo);
//     });
// })

// main page / all articles
router.get("/", function(req, res){
    console.log("index hit");
    db.Article.find({}, function(err, docs){
        let handleInfo = {
            posts: docs
        };
        res.render("index", handleInfo);
    });
});

// route to go to comments page for article
router.get("/comments/:id", function(req, res){
    let id = req.params.id;
    console.log("comments hit", id);
    db.Article.find({_id: id}).populate("comments").then(function(docs){
        return docs;
        console.log(docs);
    }).then(function(data){
        let commentData = {
            comment: data
        };
        console.log(commentData);
        res.render("comments", commentData);
    })
    
});

//route to add comments

router.post("/addComment/:id", function(req, res){
    console.log("add comment hit");
    db.Comments.create(req.body).then(docs =>{
        console.log(docs);
        return db.Article.findOneAndUpdate({_id: req.params.id}, {$push: {comments: docs._id} }, {new: true, upsert: true});
    }).then(newArticle => {
        console.log(newArticle);
        res.redirect("/comments/" + req.params.id);
    })
});


module.exports = router;
