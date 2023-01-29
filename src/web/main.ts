import { h, StyleValue } from './_html';
import * as K from '../_kit';
import { RegexEditor } from './regex-editor';
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
  };
}

function byId(id: string): HTMLElement {
  return document.getElementById(id)!;
}
