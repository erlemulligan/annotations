"use strict";

var chapterFilesDirectory = "../data/txt/";
var annotationFilesDirectory = "../data/xml/";
// TODO: use browserify to use the 'fs' filesystem node module client-side to find all file names within the chapter text directory and then add then to the chapterFilesList array automatically (if not a security concern)
var chapterFilesList = ["ch01.txt", "ch02.txt", "ch03.txt", "ch04.txt", "ch05.txt", "ch06.txt", "ch07.txt", "ch08.txt", "ch09.txt", "ch10.txt", "ch11.txt", "ch12.txt"];
// TODO: use browserify to use the 'fs' filesystem node module client-side to find the xml file names located in the xml directory and automatically add them to the annotationFilesList array
var annotationFilesList = ["ch08.txt.xml", "ch09.txt.xml", "ch10.txt.xml", "ch11.txt.xml", "ch12.txt.xml"];
var chapterList = [];
var annotationXML = new XMLHttpRequest();
var annotationCategories = [];

loadChapters(initChapterText);

// create all chapter objects
function loadChapters(initChapterText) {
  var _loop = function _loop() {
    var chapterFileName = chapterFilesList[chapter];
    var chapterText = new XMLHttpRequest();
    var chapterUrl = chapterFilesDirectory + chapterFilesList[chapter];
    var annotationList = [];

    for (annotation = 0; annotation < annotationFilesList.length; annotation++) {

      var annotationFileName = annotationFilesList[annotation].substr(0, 8);

      // if chapter text doc name matches a annotation xml file name then import the annotation records to the chapter object
      if (chapterFileName === annotationFileName) {
        var _annotationXML = new XMLHttpRequest();
        var annotationUrl = annotationFilesDirectory + annotationFilesList[annotation];
        _annotationXML.addEventListener("load", function () {
          var annotationXML = this.responseXML;
          var docid = annotationXML.querySelector('document').getAttribute('DOCID');
          var annotationArray = annotationXML.querySelectorAll('span');
          for (var annotation = 0; annotation < annotationArray.length; annotation++) {
            var annotationItem = annotationArray[annotation];
            var annotationStart = annotationItem.querySelector('charseq').getAttribute('START');
            var annotationEnd = annotationItem.querySelector('charseq').getAttribute('END');
            var annotationCategory = annotationItem.getAttribute('category');
            var annotationText = annotationItem.querySelector('charseq').innerHTML;
            annotationList.push(new Annotation(annotationStart, docid, annotationCategory, annotationEnd, annotationText));
            // add annotation category to array if not already included
            if (annotationCategories.indexOf(annotationCategory) === -1) {
              annotationCategories.push(annotationCategory);
            }
          }
          // sort annotation categories alphabetically
          annotationCategories.sort();
        });
        _annotationXML.open("GET", annotationUrl);
        _annotationXML.send();
      }
    }

    chapterText.addEventListener("load", function () {
      // TODO: check to make sure that the chapter with the id is not already included in the array of chapter objects before pushing it to the array
      var chapterName = chapterText.responseURL.substr(chapterText.responseURL.length - 8);
      chapterList.push(new Chapter(chapterName, chapterText.responseText, annotationList));
      if (initChapterText) {
        initChapterText();
      }
    });
    chapterText.open("GET", chapterUrl);
    chapterText.send();
  };

  for (var chapter = 0; chapter < chapterFilesList.length; chapter++) {
    var annotation;

    _loop();
  }
}

// display chapter text from file within browser
function initChapterText() {
  var chapterArea = document.getElementById("chapter__text");
  if (chapterList.length > 7) {
    chapterArea.innerHTML = chapterList[7].text;
  }
}

// annotation object constructor class
function Annotation(_id, _docid, category, end, text) {
  this._id = _id;
  this._docid = _docid;
  this.category = category;
  this.end = end;
  this.text = text;
}

// chapter object constructor class
function Chapter(_id, text, annotationList) {
  this._id = _id;
  this.text = text;
  this.annotationList = annotationList;
  // TODO: add prototype methods to edit/update annotation objects
  // TODO: add prototype method to delete annotation object most likely using .splice()
}