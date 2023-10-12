// ==UserScript==
// @name        Make links to PYSIDE bug reports
// @namespace   Violentmonkey Scripts
// @match       https://wiki.qt.io/Qt_for_Python_Development_Notes
// @grant       none
// @version     1.0
// @author      -
// @description 6/9/2023, 12:45:55 PM
// ==/UserScript==

"use strict";

function bugreportsLink(bug) {
  const a = document.createElement('A');
  a.setAttribute('class', "external text");
  a.setAttribute('rel', "nofollow");
  a.setAttribute('href', 'https://bugreports.qt.io/browse/' + bug);
  a.appendChild(document.createTextNode(bug));
  return a;
}

function repl(str) {
  const bugreportPattern = /PYSIDE-\d+/g;
  var bugs = str.match(bugreportPattern);
  if (bugs === null) {
    return [str];
  }
  var newNodes = [];
  if (str.startsWith(bugs[0])) {
    newNodes.push(bugreportsLink(bugs.shift()));
  }
  var textParts = str.split(bugreportPattern);
  while (textParts.length || bugs.length) {
    var text = textParts.shift();
    if (text !== undefined && text.length) {
      newNodes.push(text);
    }
    var bug = bugs.shift();
    if (bug !== undefined) {
      newNodes.push(bugreportsLink(bug));
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
      n.replaceWith(...repl(n.nodeValue));
    } else {
      makeLinks(n);
    }
  }
}
makeLinks(document.body);
