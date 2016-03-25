let chapterFilesDirectory = "../data/txt/";
let annotationFilesDirectory = "../data/xml/";
// TODO: use browserify to use the 'fs' filesystem node module client-side to find all file names within the chapter text directory and then add then to the chapterFilesList array automatically (if not a security concern)
let chapterFilesList = ["ch01.txt", "ch02.txt", "ch03.txt", "ch04.txt", "ch05.txt", "ch06.txt", "ch07.txt", "ch08.txt", "ch09.txt", "ch10.txt", "ch11.txt", "ch12.txt"];
// TODO: use browserify to use the 'fs' filesystem node module client-side to find the xml file names located in the xml directory and automatically add them to the annotationFilesList array
let annotationFilesList = ["ch08.txt.xml", "ch09.txt.xml", "ch10.txt.xml", "ch11.txt.xml", "ch12.txt.xml"];
let chapterList = []; // array to store chapter objects
let annotationCategories = []; // array to store annotation categories

loadChapters(initChapterText);

// create all chapter objects
function loadChapters(initChapterText) {
  for (var chapter = 0; chapter < chapterFilesList.length; chapter++) {
    let chapterFileName = chapterFilesList[chapter];
    let chapterText = new XMLHttpRequest();
    let chapterUrl = chapterFilesDirectory + chapterFilesList[chapter];
    let annotationList = [];

    for (var annotation = 0; annotation < annotationFilesList.length; annotation++) {

      let annotationFileName = annotationFilesList[annotation].substr(0, 8);

      // if chapter text doc name matches a annotation xml file name then import the annotation records to the chapter object
      if (chapterFileName === annotationFileName) {
        let annotationXML = new XMLHttpRequest();
        let annotationUrl = annotationFilesDirectory + annotationFilesList[annotation];
        annotationXML.addEventListener("load", function() {
          let annotationXML = this.responseXML;
          let docid = annotationXML.querySelector('document').getAttribute('DOCID');
          let annotationArray = annotationXML.querySelectorAll('span');
          for (var annotation = 0; annotation < annotationArray.length; annotation++) {
            let annotationItem = annotationArray[annotation];
            let annotationStart = annotationItem.querySelector('charseq').getAttribute('START');
            let annotationEnd = annotationItem.querySelector('charseq').getAttribute('END');
            let annotationCategory = annotationItem.getAttribute('category');
            let annotationText = annotationItem.querySelector('charseq').innerHTML;
            annotationList.push(new Annotation(annotationStart, docid, annotationCategory, annotationEnd, annotationText));
            // add annotation category to array if not already included
            if (annotationCategories.indexOf(annotationCategory) === -1) {
              annotationCategories.push(annotationCategory);
            }
          }
          // sort annotation categories alphabetically
          annotationCategories.sort();

        });
        annotationXML.open("GET", annotationUrl);
        annotationXML.send();
      }
    }

    chapterText.addEventListener("load", function() {
      // TODO: check to make sure that the chapter with the id is not already included in the array of chapter objects before pushing it to the array
      let chapterName = chapterText.responseURL.substr(chapterText.responseURL.length - 8);
      chapterList.push(new Chapter(chapterName, chapterText.responseText, annotationList));
      if (initChapterText) {
        initChapterText();
      }
    });
    chapterText.open("GET", chapterUrl);
    chapterText.send();
  }

}

// display chapter text from file within browser
function initChapterText() {
  let chapterArea = document.getElementById("chapter__text");
  if (chapterList.length === 8) {
    chapterArea.innerHTML = chapterList[7].text;
    addAnnotationHighlights(chapterList[7]);
  }
}

// add annotation highlighting markup to text
function addAnnotationHighlights(currentChapter) {
  let annotationList = currentChapter.annotationList;
  let rangeArray = [];
  console.log("Current Chapter Object:");
  console.log(currentChapter);
  if (annotationList.length > 0) {
    console.log("Current Chapter Annotation List:");
    console.log(annotationList);
    console.log("Current Chapter Annotation Categories");
    console.log(annotationCategories);
    let rangeStartNode = document.getElementById("chapter__text").firstChild;
    let rangeEndNode = document.getElementById("chapter__text").firstChild;
    for (var annotation = 0; annotation < annotationList.length; annotation++) {
      let range = document.createRange();
      let rangeStartNode = document.getElementById("chapter__text").firstChild;
      let rangeEndNode = document.getElementById("chapter__text").firstChild;
      let highlight = annotationList[annotation];
      let docid = highlight._docid.toLowerCase();
      let startPos = parseInt(highlight._id);
      let endPos = parseInt(highlight.end) + 1;
      let category = highlight.category.toLowerCase();
      range.setStart(rangeStartNode, startPos);
      range.setEnd(rangeEndNode, endPos);
      let wrapper = document.createElement('span');
      wrapper.className = category + " annotation__highlight";
      wrapper.title = category;
      rangeArray.push(range);
      rangeArray[annotation].wrapper = wrapper;
    }
    for (var range = 0; range < rangeArray.length; range++) {
       //console.log(rangeArray[range]);
       rangeArray[range].surroundContents(rangeArray[range].wrapper);
    }
  }
}

// annotation object constructor class
function Annotation(_id, _docid, category, end, text) {
  this._id = _id; // id of annotation (also the start value of the range of the annotation)
  this._docid = _docid; // document id of chapter related to annotation
  this.category = category; // annotation category
  this.end = end; // end of range of annotation
  this.text = text; // text of the annotation
}

// chapter object constructor class
function Chapter(_id, text, annotationList) {
  this._id = _id; // chapter id (the filename)
  this.text = text; // full text of chapter
  this.annotationList = annotationList; // array of the chapter's annotations
  // TODO: add prototype methods to edit/update annotation objects
  // TODO: add prototype method to delete annotation object most likely using .splice()
}

