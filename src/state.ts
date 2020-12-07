import { browser } from "webextension-polyfill-ts";

export default class State {
  private listeners?: Array<Function>;

  constructor(private inner: Map<string, string>) {
    browser.storage.onChanged.addListener(async (changes, areaName) => {
      if (areaName !== "local") {
        return;
      }
      this.inner = await State.loadInner();
      if (this.listeners) {
        for (const listener of this.listeners) {
          listener(changes);
        }
      }
    });
  }

  addListener(handler: Function) {
    if (!this.listeners) {
      this.listeners = [];
    }
    this.listeners.push(handler);
  }

  get(key: string): string {
    const value = this.inner.get(key);
    if (!value) {
      throw new Error(`Missing key "${key}" in state`);
    }
    return value;
  }

  set(key: string, value: string) {
    this.inner.set(key, value);
  }

  get feedURL(): string {
    return `https://aggr.md/@${this.get("_githubUsername")}/`;
  }

  async save() {
    return State.saveInner(this.inner);
  }

  static async load(): Promise<State> {
    const inner = await State.loadInner();
    return new State(inner);
  }

  private static async saveInner(inner: Map<string, string>) {
    const items = Object.fromEntries(inner.entries());
    return browser.storage.local.set(items);
  }

  private static async loadInner(): Promise<Map<string, string>> {
    const items = await browser.storage.local.get(null);
    return new Map(Object.entries(items));
  }
}
