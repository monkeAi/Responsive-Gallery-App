const express = require('express');
const app = express();
const port = 3000;
const fetch = require("node-fetch");
const rateLimit = require("express-rate-limit");

app.use(express.static('public'));

const limiter = rateLimit({
    max: 6,
    windowMs: 60 * 1000,
    message: "Too many request from this IP"
});

app.use(limiter);


app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
});


app.get('/galeryImages', async (req, res) => {
    //  Fetch data from api
    const options = {
        method: 'GET',
        headers: {Accept: '*/*', AccessKey: ''}
      };
    
    // remove the image extension to get the bare title
    function createTitle(fullString){
        var minusEnd;
        if (fullString.includes('.png') || fullString.includes('.jpg') || fullString.includes('.gif') || fullString.includes('.JPG') || fullString.includes('.PNG')){ // Check if the image name contains png, jpg or gif
            minusEnd = 4; // if so remove the last 4 letters
        }
        else if (fullString.includes('.jpeg') || fullString.includes('.JPEG') ){
            minusEnd = 5; // If it contains .jpeg remove last 5 letters
        }else{
            return;
        }
        
        const imgLength = fullString.length; // get the whole length
        const titleLength = imgLength - minusEnd; // minus the ending
        const imgTitle = fullString.substring(0 , titleLength); // get the bare title
        if(imgTitle.includes('notitle')){ // if an images includes "notitle" then it wont display the title
            return;
        }
        // else{return imgTitle};
    }
      
    await fetch('https://storage.bunnycdn.com/mojashramba/images/', options) // fetch from the storage api
        .then(data => data.json()) // convert from json
        .then(data => {
            
            const sortedArray = data.sort((a, b) => new Date(b.DateCreated) - new Date(a.DateCreated))

            let ImgArray = [];
            let i = 0
            

            sortedArray.forEach((element, index) => {  // get trought every item and add it to the front of the array
                const ImgName = element.ObjectName; // Get image name
                

                let imageObject = {
                    url: '',
                    title: '',
                    date: 'Date'
                };

                const imgDate = element.DateCreated.substring(0, 10) // get the date

                const StoragePath = 'https://mojashramba.b-cdn.net/images/';
                const ImgPath = StoragePath + ImgName; // create image url
                // create image objects with the parameters
                imageObject.url = ImgPath; 
                imageObject.title = createTitle(ImgName);
                imageObject.date = imgDate;
                ImgArray.push(imageObject); // Push the image object into image array
            });
            res.json(ImgArray); // send back json
        })
        .catch(err => console.error(err));
});

/*
    fetch imgs
    convert to obj
    go trough every array element
    for each put the ObjectName in another array
    send it to the page
    ..do more code..
*/