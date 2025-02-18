/* eslint-disable class-methods-use-this */
import { EventEmitter } from './task-1-event-emitter';

export type Callback = (error: Error | null, data?: any) => void;
export type AsyncFunction = (url: string, ...cbArgs: any[]) => void;

/**
 * Class that manages the execution of asynchronous operations.
 * @extends EventEmitter
 */
export class WithTime extends EventEmitter {
  /**
   * Executes a provided asynchronous function and computes the time it takes to execute it.
   * Emits event "start", event "end" and event "data" for the data received.
   * @param {AsyncFunction} asyncFunc - The asynchronous function to be executed.
   * This function should accept a callback as its last argument.
   * @param {...any[]} args - The arguments to be passed to the asyncFunc, excluding the callback.
   */
  execute(asyncFunc: AsyncFunction, url: string): void {
    const timeLabel = `execute-${Date.now()}`;

    console.time(timeLabel);
    this.emit('begin');

    const callback: Callback = (error: Error | null, data?: any) => {
      if (error) {
          this.emit('error', error);
      } else if (data !== undefined) {
          this.emit('data', data);
      }

      console.timeEnd(timeLabel);
      this.emit('end');
    };

    try {
      asyncFunc(url, callback);
    } catch (error) {
      this.emit('error', error instanceof Error ? error : new Error(String(error)));
      console.timeEnd(timeLabel);
      this.emit('end');
    }
  }
}
