const express = require('express');
const app = express();
const mongoose = require('mongoose');
const shortUrl = require('./model/shorturl');
const port = process.env.PORT || 8000

mongoose.connect("mongodb://localhost:27017/urlshortner",{
   useCreateIndex:true,
   useUnifiedTopology:true,
   useNewUrlParser:true
}).then(()=>{
    console.log("Database connected successfully");
}).catch((error) => {
    console.log(error);
});

app.use(express.urlencoded({extended:false}));


app.set("view engine","hbs");

app.get("/", async (req, res) =>{
    const shortUrls =  await shortUrl.find();
    res.render("index",{
        shortUrls:shortUrls
    });
});

app.post("/shorturl",async (req,res) =>{
   await shortUrl.create({full:req.body.fullurl});
   res.redirect("/");
});

app.get("/:shorturl",async (req,res) =>{
    const ShortUrl = await shortUrl.findOne({short: req.params.shorturl});
    if(ShortUrl === null){
        return res.status(404).send("Please enter url")
    }

    ShortUrl.clicks++;
    ShortUrl.save();
    res.redirect(ShortUrl.full);
});



app.listen(port,  ()=>{
    console.log(`Listening to server ${port}`);
})