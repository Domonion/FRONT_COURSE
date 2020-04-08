interface Reader {
  getChunk(): string;
}

interface DocumentParser {
  readonly charCount: number;
  readonly wordCount: number;
  readonly lineCount: number;
}

class TextReader implements Reader {
  private index = 0;
  private chunker: IterableIterator<string>;

  constructor(private input: string) {
    this.chunker = this.generator();
  }

  private *generator(): IterableIterator<string> {
    while (true) {
      if (this.input.length === this.index) {
        yield '';
      }
      const dif = Math.min(this.input.length - this.index, 256);
      const res = this.input.substr(this.index, dif);
      this.index += dif;

      yield res;
    }
  }

  public getChunk(): string {
    return this.chunker.next().value;
  }
}

class TextDocumentParser implements DocumentParser {
  private readonly _lines = 0;
  private readonly _words = 0;
  private readonly _chars = 0;

  public get charCount() {
    return this._chars;
  }

  public get wordCount() {
    return this._words;
  }

  public get lineCount() {
    return this._lines;
  }

  constructor(private reader: TextReader) {
    let curChunk = ' \n' + reader.getChunk();
    do {
      for (let i = 1; i < curChunk.length; i++) {
        if (curChunk[i] !== '\n') {
          this._chars++;
          if (curChunk[i] !== ' ') {
            if (curChunk[i - 1] === ' ' || curChunk[i - 1] === '\n') {
              this._words++;
            }
          }
        } else {
          this._lines++;
        }
      }
      curChunk = '\n' + reader.getChunk();
    } while (curChunk.length !== 1);
  }
}

export { TextDocumentParser, TextReader };
