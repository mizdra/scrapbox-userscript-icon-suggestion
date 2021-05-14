import { createCursor, createEditor, createTextInput } from '../helpers/html';

const editor = createEditor();
const cursor = createCursor({ styleTop: 0, styleLeft: 0 });
const textInput = createTextInput();
document.body.appendChild(editor);
document.body.appendChild(cursor);
document.body.appendChild(textInput);
