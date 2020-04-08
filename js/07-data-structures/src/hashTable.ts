type Key = number | string | object;

class Node<T> {
  public key: Key = 0;
  public value?: T;
  public hasValue = false;
}

export class HashTable<T> {
  private loadFactor = 0.66;
  private _size = 0;
  private data: Array<Node<T>> = new Array<Node<T>>(2);

  public get(key: Key): T | void {
    const hash: number = this.getHash(key);

    for (let i = 0; i < this.data.length; i++) {
      const index = (i + hash) % this.data.length;

      if (!this.data[index].hasValue) {
        return;
      } else if (this.data[index].key === key) {
        return this.data[index].value;
      }
    }

    return;
  }

  constructor() {
    for (let i = 0; i < this.data.length; i++) {
      this.data[i] = new Node<T>();
    }
  }

  public get size(): number {
    return this._size;
  }

  private getHash(key: Key): number {
    if (typeof key !== 'string') {
      return this.getHash(JSON.stringify(key));
    }

    let res = 0;

    for (let i = 0; i < key.length; i++) {
      res *= 107;
      res += key.charCodeAt(i);
      res %= 1e9 + 7;
    }

    return res;
  }

  private reload(): void {
    let newData = new Array<Node<T>>(this.data.length * 2);

    for (let i = 0; i < newData.length; i++) {
      newData[i] = new Node<T>();
    }

    [newData, this.data] = [this.data, newData];
    this._size = 0;

    for (let index = 0; index < newData.length; index++) {
      if (newData[index].hasValue) {
        this.put(newData[index].key, newData[index].value as T);
      }
    }
  }

  public put(key: Key, element: T): void {
    if (this._size >= this.loadFactor * this.data.length) {
      this.reload();
    }

    this._size++;
    const shouldBeReplaced = this.get(key) !== undefined;
    const hash: number = this.getHash(key);

    for (let i = 0; i < this.data.length; i++) {
      const index = (i + hash) % this.data.length;

      if (shouldBeReplaced) {
        if (this.data[index].key === key) {
          this.data[index].value = element;
          break;
        }
      } else {
        if (!this.data[index].hasValue) {
          this.data[index].hasValue = true;
          this.data[index].key = key;
          this.data[index].value = element;
          break;
        }
      }
    }
  }

  public clear(): void {
    this._size = 0;
    this.data = new Array<Node<T>>(2);
  }
}
