import { LinkedList } from './linkedList';

export class Queue<T> {
  private queue: LinkedList<T> = new LinkedList<T>();

  public get(index: number): T | void {
    return this.queue.get(index);
  }

  public enqueue(element: T): void {
    this.queue.unshift(element);
  }

  public dequeue(): T | void {
    return this.queue.pop();
  }

  public get size(): number {
    return this.queue.size;
  }
}
