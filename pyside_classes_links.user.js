// ==UserScript==
// @name        Make links to Qt docs
// @namespace   Violentmonkey Scripts
// @match       https://wiki.qt.io/Qt_for_Python_Development_Notes
// @grant       none
// @version     1.0
// @author      StSav012
// @description Make links to Qt docs for classes mentioned on https://wiki.qt.io/Qt_for_Python_Development_Notes
// ==/UserScript==

"use strict";

function qtClassLink(qtClass) {
  const a = document.createElement('A');
  a.setAttribute('class', "external text");
  a.setAttribute('rel', "nofollow");
  a.setAttribute('href', 'https://doc.qt.io/qt-6/' + qtClass.toLowerCase() + '.html');
  a.appendChild(document.createTextNode(qtClass));
  return a;
}

function makeQtClassLinks(str) {
  const qtClassPattern = /\bQ[A-Z][a-z]\w+/g;
  var qtClasses = str.match(qtClassPattern);
  if (qtClasses === null) {
    return [str];
  }
  var newNodes = [];
  if (str.startsWith(qtClasses[0])) {
    newNodes.push(qtClassLink(qtClasses.shift()));
  }
  var textParts = str.split(qtClassPattern);
  while (textParts.length || qtClasses.length) {
    var text = textParts.shift();
    if (text !== undefined && text.length) {
      newNodes.push(text);
    }
    var qtClass = qtClasses.shift();
    if (qtClass !== undefined) {
      newNodes.push(qtClassLink(qtClass));
    }
  }
  return newNodes;
}

function makeLinks(parent) {
  for (let n of parent.childNodes) {
    if (parent.tagName === 'A') {  // should be here in case `parent` changes
      return;
    }
    if (n.tagName === 'A') {
      continue;
    }
    if (n.nodeName === "#text" && n.nodeValue !== undefined) {
      n.replaceWith(...makeQtClassLinks(n.nodeValue));
    } else {
      makeLinks(n);
    }
  }
}
makeLinks(document.body);
