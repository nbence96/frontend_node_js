/* eslint-disable class-methods-use-this */
type EventListener = (...args: any[]) => void;

/**
 * Class to manage event listeners and emit events.
 */
export class EventEmitter {
  private listeners: { [event: string]: EventListener[] } = {};

  /**
   * Adds a new listener function to the specified event.
   * @param {string} eventName - Name of the event.
   * @param {EventListener} fn - Listener function.
   * @returns {EventEmitter} - EventEmitter instance.
   */
  addListener(eventName: string, fn: EventListener): this {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(fn);
    return this;
  }

  /**
   * Alias for addListener method.
   * @param {string} eventName - Name of the event.
   * @param {EventListener} fn - Listener function.
   * @returns {EventEmitter} - Current EventEmitter instance.
   */
  on(eventName: string, fn: EventListener): this {
    return this.addListener(eventName, fn);
  }

  /**
   * Adds a one-time listener function for the event. Once invoked, it is removed.
   * @param {string} eventName - Name of the event.
   * @param {EventListener} fn - Listener function.
   * @returns {EventEmitter} - EventEmitter instance.
   */
  once(eventName: string, fn: EventListener): this {
    const onceWrapper: EventListener = (...args: any[]) => {
      fn(...args);
      this.removeListener(eventName, onceWrapper);
    };
    return this.addListener(eventName, onceWrapper);
  }

  /**
   * Removes the specified listener for the event.
   * @param {string} eventName - Name of the event.
   * @param {EventListener} fn - Listener function.
   * @returns {EventEmitter} - EventEmitter instance.
   */
  removeListener(eventName: string, fn: EventListener): this {
    if (!this.listeners[eventName]) return this;

    this.listeners[eventName] = this.listeners[eventName].filter(listener => listener !== fn);
    return this;
  }

  /**
   * Alias for removeListener method.
   * @param {string} eventName - Name of the event.
   * @param {EventListener} fn - Listener function.
   * @returns {EventEmitter} - EventEmitter instance.
   */
  off(eventName: string, fn: EventListener): this {
    return this.removeListener(eventName, fn);
  }

  /**
   * Synchronously calls each of the listeners registered for the event named eventName,
   * in the order they were registered, passing the supplied arguments to each.
   * @param {string} eventName - Name of the event.
   * @param {...any[]} args - The arguments to be passed to each listener function.
   * @returns {boolean} - True if the event had listeners, false otherwise.
   */
  emit(eventName: string, ...args: any[]): boolean {
    if (!this.listeners[eventName] || this.listeners[eventName].length === 0) {
      return false;
    }

    this.listeners[eventName].forEach(listener => listener(...args));
    return true;
  }

  /**
   * Returns the number of listeners listening to the type of event.
   * @param {string} eventName - Name of the event.
   * @returns {number} - The number of listeners for the event.
   */
  listenerCount(eventName: string): number {
    return this.listeners[eventName]?.length || 0;
  }

  /**
   * Returns a copy of the array of listeners for the event.
   * @param {string} eventName - Name of the event.
   * @returns {EventListener[]} - An array of listener functions for the event.
   */
  rawListeners(eventName: string): EventListener[] {
    return [...(this.listeners[eventName] || [])];
  }
}
