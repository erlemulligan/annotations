let chapterFilesDirectory = "../data/txt/";
let annotationFilesDirectory = "../data/xml/";
// TODO: use browserify to use the 'fs' filesystem node module client-side to find all file names within the chapter text directory and then add then to the chapterFilesList array automatically (if not a security concern)
let chapterFilesList = ["ch01.txt", "ch02.txt", "ch03.txt", "ch04.txt", "ch05.txt", "ch06.txt", "ch07.txt", "ch08.txt", "ch09.txt", "ch10.txt", "ch11.txt", "ch12.txt"];
// TODO: use browserify to use the 'fs' filesystem node module client-side to find the xml file names located in the xml directory and automatically add them to the annotationFilesList array
let annotationFilesList = ["ch08.txt.xml", "ch09.txt.xml", "ch10.txt.xml", "ch11.txt.xml", "ch12.txt.xml"];
let chapterList = [];
let annotationXML = new XMLHttpRequest();
let annotationCategories = [];

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

