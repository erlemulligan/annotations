"use strict";

var chapterText = new XMLHttpRequest();
var chapterUrl = "../data/txt/ch08.txt";
var annotationXML = new XMLHttpRequest();
var annotationUrl = "../data/xml/ch08.txt.xml";
var annotationCategories = [];

// display chapter text from file within browser
function displayChapterText() {
  var chapterArea = document.getElementById("chapter__text");
  chapterArea.innerHTML = this.responseText;
}

// get chapter text from file
function getChapterText(chapterUrl) {
  chapterText.addEventListener("load", displayChapterText);
  chapterText.open("GET", chapterUrl);
  chapterText.send();
}

function displayAnnotations() {
  console.log(this.responseText);
}

// get chapter annotations from file
function getChapterAnnotations(annotationUrl) {
  annotationXML.addEventListener("load", displayAnnotations);
  annotationXML.open("GET", annotationUrl);
  annotationXML.send();
}

getChapterAnnotations(annotationUrl);
getChapterText(chapterUrl);