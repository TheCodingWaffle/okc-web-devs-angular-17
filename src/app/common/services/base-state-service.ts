import { Signal, computed, signal } from '@angular/core';

/**
 * A reusable base Class to give any service state.
 * Helper classes provide access to said state.
 *
 * @class
 */
export abstract class BaseStateService<T extends Object> {
  readonly state = signal({} as T);

  constructor() {
    this.initializeState();
  }

  /**
   * Initialize the state to avoid undefined being passed
   * initially.
   */
  abstract initializeState(): void;

  /**
   * Returns a reactive value for a property on the state.
   * This is used when the consumer needs the signal for
   * specific part of the state.
   *
   * @param key - the key of the property to be retrieved
   */
  public select<K extends keyof T>(key: K): Signal<T[K]> {
    return computed(() => this.state()[key]);
  }

  /**
   * This is used to set a new value for a property
   *
   * @param key - the key of the property to be set
   * @param data - the new data to be saved
   */
  protected set<K extends keyof T>(key: K, data: T[K]) {
    this.state.update((currentValue) => ({ ...currentValue, [key]: data }));
  }

  /**
   * Sets values for multiple properties on the store
   * This is used when there is a need to update multiple
   * properties in the store
   *
   * @param partialState - the partial state that includes the new value to be saved
   *
   * @example
   * this.setState({ propertyInState });
   */
  protected setState(partialState: Partial<T>): void {
    this.state.update((currentValue) => ({ ...currentValue, ...partialState }));
  }
}
