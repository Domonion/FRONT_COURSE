class Node<T> {
  constructor(public value: T, public prev: Node<T> | null, public next: Node<T> | null) {}
}

export class LinkedList<T> {
  private head: Node<T> | null = null;
  private tail: Node<T> | null = null;
  private _size = 0;
  private index = 0;

  public get size(): number {
    return this._size;
  }

  private normalize(): void {
    if (this.index >= this.size) {
      this.index = this.size - 1;
    }

    if (this.index < 0) {
      this.index = 0;
    }
  }

  public prev(): T | void {
    if (this.size === 0) {
      return;
    }

    this.normalize();

    return this.get(this.index--);
  }

  public next(): T | void {
    if (this.size === 0) {
      return;
    }

    this.normalize();

    return this.get(this.index++);
  }

  public get(index: number): T | void {
    if (index < 0 || index >= this.size) {
      return;
    }

    let currentElement = this.head;
    let currentIndex = 0;

    while (currentIndex < index) {
      currentElement = currentElement?.next as Node<T>;
      ++currentIndex;
    }

    return currentElement?.value;
  }

  public push(element: T): void {
    this.normalize();
    this._size++;

    if (this?.tail) {
      this.tail.next = new Node(element, this.tail, null);
      this.tail = this.tail.next;
    } else {
      this.tail = new Node(element, null, null);
      this.head = this.tail;
    }
  }

  public pop(): T | void {
    if (this.size === 0) {
      return;
    }

    const res = this.tail;
    this.normalize();
    this._size--;

    if (this.tail?.prev) {
      this.tail = this.tail.prev;
      this.tail.next = null;
    } else {
      this.tail = null;
      this.head = null;
    }

    return res?.value;
  }

  public unshift(element: T): void {
    this.normalize();
    this._size++;

    if (this.head) {
      this.head.prev = new Node(element, null, this.head);
      this.head = this.head.prev;
      this.index++;
    } else {
      this.head = new Node(element, null, null);
      this.tail = this.head;
    }
  }

  public shift(): T | void {
    if (this.size === 0) {
      return;
    }

    const res = this.head;
    this.normalize();
    this._size--;

    if (this.head?.next) {
      this.head = this.head.next;
      this.head.prev = null;
      this.index--;
    } else {
      this.tail = null;
      this.head = null;
    }

    return res?.value;
  }
}
