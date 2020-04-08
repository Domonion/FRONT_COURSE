import { TextDocumentParser, TextReader } from '../src/example';

describe('задача', () => {
  it('пример 1', () => {
    const text = 'You can try, but you`ll never catch me.\nBazinga!';
    const documentParser = new TextDocumentParser(new TextReader(text));

    // console.log('Chars:', documentParser.charCount);
    // console.log('Words:', documentParser.wordCount);
    // console.log('Line:', documentParser.lineCount);

    expect(documentParser.charCount).toBe(47);
    expect(documentParser.wordCount).toBe(9);
    expect(documentParser.lineCount).toBe(2);
  });

  it('пример 2', () => {
    const text = 'Is it me, or you?';
    const documentParser = new TextDocumentParser(new TextReader(text));

    // console.log('Chars:', documentParser.charCount);
    // console.log('Words:', documentParser.wordCount);
    // console.log('Line:', documentParser.lineCount);

    expect(documentParser.charCount).toBe(17);
    expect(documentParser.wordCount).toBe(5);
    expect(documentParser.lineCount).toBe(1);
  });
  it('пример 3', () => {
    const text = 'Hello World';
    const documentParser = new TextDocumentParser(new TextReader(text));

    // console.log('Chars:', documentParser.charCount);
    // console.log('Words:', documentParser.wordCount);
    // console.log('Line:', documentParser.lineCount);

    expect(documentParser.charCount).toBe(11);
    expect(documentParser.wordCount).toBe(2);
    expect(documentParser.lineCount).toBe(1);
  });
});
