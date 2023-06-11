import Lightbox from "./lightbox.js";

Lightbox.activate();
var globalData = []; 
var OriginalArray = [];
// var allreadyRendered = [];
const ScreenWidth = 1000;

var columns = document.getElementsByClassName('port-column');
 

var imgOptions = {
  rootMargin: "300px"
};

// changes the src with data-src
function preloadImage(img) {
    const src = img.getAttribute("data-src");
    if (!src) {
        return;
    } 
    img.src = src;
    img.style.minHeight = '0px'
}

// Intersection Observer observes every elemnt of the lazyImages list
const imgObserver = new IntersectionObserver((entries, imgObserver) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            preloadImage(entry.target);
            imgObserver.unobserve(entry.target);
        }
    })
}, imgOptions)

createColumn()
// MAIN SCRIPT
// Creates a new column
async function createColumn(){
  // Delete all columns
  Array.from(columns).forEach(column => {
    column.remove()
  });

  // Check the screen width
  var columnNum = checkWidth();

  // Create the columns based on the screen width
  for (let i = 0; i < columnNum; i++) {
    
    var newColumn = document.createElement('div');
    newColumn.className = 'port-column';
    document.getElementById('portfolio').append(newColumn);
  }
  await getGaleryImages();


  // Observe the last image of a column
  observeLastImg();

}

// Checks for the screen width to set the amount of collumns
function checkWidth(){
  var width = window.innerWidth
  if (width < ScreenWidth) {
    return 2;
  }else{
    return 3;
  }
}

// Everytime we resize check if 
var startState = window.innerWidth
window.onresize = resize;
function resize(){
  var curState = window.innerWidth;
  if (startState > ScreenWidth && curState < ScreenWidth){
    startState = window.innerWidth;
    // console.log('changed to smaller than 1420')
    createColumn()
  }
  if (startState < ScreenWidth && curState > ScreenWidth){
    startState = window.innerWidth;
    // console.log('changed to bigger than 1420')
    createColumn()
  }
}


// Creates an image with all the styling
function createImgBlock(ImageSrc, Title, Date, index){
  var img = document.createElement('IMG');
  // img.src
  img.className = "lazyImg"
  img.setAttribute('data-src', ImageSrc);

  // var colors = ['#FAEBEFFF', '#333D79FF'];
  // var random_color = colors[Math.floor(Math.random() * colors.length)];
  // img.style.backgroundColor = random_color;

  var imgText = document.createElement('div');
  imgText.className = "port-img-text";

  var imgTitle = document.createElement('h2');
  imgTitle.textContent = Title;
  var imgDate = document.createElement('h2');
  imgDate.textContent = Date;

  imgText.appendChild(imgTitle); // image title
  imgText.appendChild(imgDate); // image date
  
  var imgDiv = document.createElement('div');
  imgDiv.className = "port-img";

  imgDiv.appendChild(img);
  imgDiv.appendChild(imgText);
  
  columns[index].appendChild(imgDiv); // Apends the image to a column
  imgObserver.observe(img);//observe for the lazy image

  // add event listener that will open lightbox;
  imgDiv.addEventListener("click", (e) => {
    Lightbox.show(ImageSrc, Date, Title)
  })
}


// get array of images from server
async function getGaleryImages() {
  if (!globalData.length == 0){  
    setImages(globalData); // Save localy 
  }else{
    await fetch('/galeryImages') 
    .then(data => data.json())
    .then(data => {
      // setImages(data);
      
      data.forEach(imgObject => {
        globalData.push(imgObject);
      })

      OriginalArray = [].concat(globalData); // original data from server
      toBeRendered(); // Call the rendering to render new images
    })
    .catch((err) => {
      // console.error(err) //catch any errors
   })
  } 
}

// Set imgs srcs and other atributes
function setImages(imgObjects){
  var i = 0;
    var getColumns = columns.length

    // Depending on how many colums are in the page it will distribute them correctly
    // console.log(columns.length) 

    imgObjects.forEach(imgObject => {
      const imgSrc = imgObject.url
      const imgTitle = imgObject.title
      const imgDate = imgObject.date
      // allreadyRendered.push(imgObject);
      createImgBlock(imgSrc, imgTitle, imgDate, i)
      i++;
      if(i >= getColumns){i = 0;}
      
    });
}

// Detect when the last element of column is going to be shown and then generate new images
const lastImgObserver = new IntersectionObserver((entries, imgObserver) => {
  entries.forEach(entry => {
      if (!entry.isIntersecting) {
          return;
      } else {
          console.log('The last.')
          lastImgObserver.disconnect();
          toBeRendered(globalData);
        // GENERATE NEW IMAGES

      }
  })
}, imgOptions)

// Get the last elemnt of each Column
function observeLastImg(){
  Array.from(columns).forEach(column => {
    // console.log(column)
    
    var lastElement = column.lastChild
    if(!lastElement){
      return;
    }else{

    // console.log(lastElement)
    lastImgObserver.observe(lastElement)
    }
  })
}

// Extrude the toBeRendered Array from the allImages Array
function toBeRendered(){
  // console.log(OriginalArray)
  var waitingArr = OriginalArray; // the rest of images waiting to be rendered
  if (waitingArr.length == 0){ // check if the array still has any images
    return;
  }else {
    var toBeRenderedArr = waitingArr.splice(0, 18); // images ready to render
    setImages(toBeRenderedArr); // render images
    // console.log("prepared: ", toBeRenderedArr);
    // console.log("waiting: ", waitingArr);
    observeLastImg(); // resets the observer once the images are rendered
    // console.log(allreadyRendered)
  }
}
