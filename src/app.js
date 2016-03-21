function displayChapterText() {
  let chapterArea = document.getElementById("chapter__text");
  chapterArea.innerHTML = this.responseText;
}

let getChapterText = new XMLHttpRequest();
getChapterText.addEventListener("load", displayChapterText);
getChapterText.open("GET", "../data/txt/ch08.txt");
getChapterText.send();
