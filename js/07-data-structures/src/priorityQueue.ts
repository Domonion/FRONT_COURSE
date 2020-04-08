import { Queue } from './queue';

export class PriorityQueue<T> {
  private queue = [new Queue<T>(), new Queue<T>(), new Queue<T>()];

  public enqueue(element: T, priority: number): void {
    this.queue[priority - 1].enqueue(element);
  }

  public dequeue(): T | void {
    let res: T | void;

    for (let i = 2; i >= 0; --i) {
      res = this.queue[i].dequeue();
      if (res !== undefined) {
        break;
      }
    }

    return res;
  }

  public get size(): number {
    return this.queue.reduce((sum, c) => sum + c.size, 0);
  }
}
