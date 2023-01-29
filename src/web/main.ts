import { h, StyleValue } from './html';
import * as K from '../kit';
import { RegexEditor } from './regex-editor';
import { visualize } from './visualize';

// @ts-ignore
import raphael from 'raphael';

import './style/main.css'; // Webpack sucks!

document.addEventListener('DOMContentLoaded', main);

function main() {
  let editor = new RegexEditor();
  let editorCt = byId('editorCt');
  console.log("editorCt", editorCt)
  editor.renderTo(editorCt);

  let visualizeBtn = byId('visualizeBtn');
  visualizeBtn.onclick = () => {
    console.log(editor.getRegex());

    var paper = raphael('diagramCt', 10, 10);
    // visualize(editor.getRegex(), editor.get, pager)
  };
}

function byId(id: string): HTMLElement {
  return document.getElementById(id)!;
}
