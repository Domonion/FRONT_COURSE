import { LinkedList } from './linkedList';

export class RingBuffer<T> {
  private list: LinkedList<T> = new LinkedList<T>();

  constructor(public capacity: number) {}

  public get(index: number): T | void {
    return this.list.get(index);
  }

  public get size(): number {
    return this.list.size;
  }

  public push(element: T): void {
    if (this.capacity === 0) {
      return;
    }

    if (this.size === this.capacity) {
      this.list.shift();
    }

    this.list.push(element);
  }

  public shift(): T | void {
    return this.list.shift();
  }

  static concat<T>(...buffers: RingBuffer<T>[]): RingBuffer<T> {
    const capacity = buffers.reduce((sum, buffer) => sum + buffer.capacity, 0);
    const res = new RingBuffer<T>(capacity);
    for (const buffer of buffers) {
      for (let i = 0; i < buffer.size; i++) {
        res.push(buffer.get(i) as T);
      }
    }

    return res;
  }
}
