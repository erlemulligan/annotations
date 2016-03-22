let chapterText = new XMLHttpRequest();
let chapterUrl = "../data/txt/ch08.txt";
let chapterFilesDirectory = "../data/txt/";
// TODO: use browserify to use the 'fs' filesystem node module client-side to find all file names within the chapter text directory and then add then to the chapterFilesList array automatically (if not a security concern)
let chapterFilesList = ["ch01.txt", "ch02.txt", "ch03.txt", "ch04.txt", "ch05.txt", "ch06.txt", "ch07.txt", "ch08.txt", "ch09.txt", "ch10.txt", "ch11.txt", "ch12.txt"];
let chapterList = [];
let annotationXML = new XMLHttpRequest();
let annotationUrl = "../data/xml/ch08.txt.xml";
let annotationList = [];
let annotationCategories = [];

// create all chapter objects
function loadChapters() {
  for (var chapter = 0; chapter < chapterFilesList.length; chapter++) {
    let chapterName = chapterFilesList[chapter];
    let chapterText = new XMLHttpRequest();
    chapterUrl = chapterFilesDirectory + chapterFilesList[chapter];
    chapterText.addEventListener("load", function() {
      // TODO: check to make sure that the chapter with the id is not already included in the array of chapter objects before pushing it to the array
      let chapterName = chapterText.responseURL.substr(chapterText.responseURL.length - 8);
      chapterList.push(new Chapter(chapterName, chapterText.responseText));
    });
    chapterText.open("GET", chapterUrl);
    chapterText.send();
  }
  console.log(chapterList);
}

loadChapters();


// display chapter text from file within browser
function displayChapterText() {
  let chapterArea = document.getElementById("chapter__text");
  chapterArea.innerHTML = this.responseText;
}

// load chapter text from file
function loadChapterText(chapterUrl) {
  chapterText.addEventListener("load", displayChapterText);
  chapterText.open("GET", chapterUrl);
  chapterText.send();
}

// annotation object constructor class
function Annotation(_id, category, end, text) {
  this._id = _id;
  this.category = category;
  this.end = end;
  this.text = text;
  // TODO: add prototype methods to edit/update annotation objects
  // TODO: add prototype method to delete annotation object most likely using .splice()
}

// chapter object constructor class
function Chapter(_id, text) {
  this._id = _id;
  this.text = text;
  this.annotationList = [];
  // TODO: create loadChapterText function as method of object
  // TODO: create displayChapterText function as method of object
}

function displayAnnotations() {
  let annotationXML = this.responseXML;
  let annotationArray = annotationXML.querySelectorAll('span');
  for (var annotation = 0; annotation < annotationArray.length; annotation++) {
    let annotationItem = annotationArray[annotation];
    let annotationStart = annotationItem.querySelector('charseq').getAttribute('START');
    let annotationEnd = annotationItem.querySelector('charseq').getAttribute('END');
    let annotationCategory = annotationItem.getAttribute('category');
    let annotationText = annotationItem.querySelector('charseq').innerHTML;
    annotationList.push(new Annotation(annotationStart, annotationCategory, annotationEnd, annotationText));
    // add annotation category to array if not already included
    if (annotationCategories.indexOf(annotationCategory) === -1) {
      annotationCategories.push(annotationCategory);
    }
  }
  // sort annotation categories alphabetically
  annotationCategories.sort();
  console.log(annotationCategories);
  console.log(annotationList);
}

// load chapter annotations from file
function loadChapterAnnotations(annotationUrl) {
  annotationXML.addEventListener("load", displayAnnotations);
  annotationXML.open("GET", annotationUrl);
  annotationXML.send();
}

loadChapterAnnotations(annotationUrl);
loadChapterText(chapterUrl);
