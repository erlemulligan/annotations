"use strict";

var chapterText = new XMLHttpRequest();
var chapterUrl = "../data/txt/ch08.txt";
var chapterFilesDirectory = "../data/txt/";
// TODO: use browserify to use the 'fs' filesystem node module client-side to find all file names within the chapter text directory and then add then to the chapterFilesList array automatically (if not a security concern)
var chapterFilesList = ["ch01.txt", "ch02.txt", "ch03.txt", "ch04.txt", "ch05.txt", "ch06.txt", "ch07.txt", "ch08.txt", "ch09.txt", "ch10.txt", "ch11.txt", "ch12.txt"];
var chapterList = [];
var annotationXML = new XMLHttpRequest();
var annotationUrl = "../data/xml/ch08.txt.xml";
var annotationList = [];
var annotationCategories = [];

// create all chapter objects
function loadChapters() {
  var _loop = function _loop() {
    var chapterName = chapterFilesList[chapter];
    var chapterText = new XMLHttpRequest();
    chapterUrl = chapterFilesDirectory + chapterFilesList[chapter];
    chapterText.addEventListener("load", function () {
      // TODO: check to make sure that the chapter with the id is not already included in the array of chapter objects before pushing it to the array
      var chapterName = chapterText.responseURL.substr(chapterText.responseURL.length - 8);
      chapterList.push(new Chapter(chapterName, chapterText.responseText));
    });
    chapterText.open("GET", chapterUrl);
    chapterText.send();
  };

  for (var chapter = 0; chapter < chapterFilesList.length; chapter++) {
    _loop();
  }
  console.log(chapterList);
}

loadChapters();

// display chapter text from file within browser
function displayChapterText() {
  var chapterArea = document.getElementById("chapter__text");
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
  var annotationXML = this.responseXML;
  var annotationArray = annotationXML.querySelectorAll('span');
  for (var annotation = 0; annotation < annotationArray.length; annotation++) {
    var annotationItem = annotationArray[annotation];
    var annotationStart = annotationItem.querySelector('charseq').getAttribute('START');
    var annotationEnd = annotationItem.querySelector('charseq').getAttribute('END');
    var annotationCategory = annotationItem.getAttribute('category');
    var annotationText = annotationItem.querySelector('charseq').innerHTML;
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