/* eslint-disable @typescript-eslint/no-explicit-any */
interface ILocalStorage {
  get(key: string): any | null;
  set(key: string, value: any): boolean;
}

export default class LocalStorageAdapter implements ILocalStorage {
  get(key: string) {
    try {
      const value = window.localStorage.getItem(key);

      if (!value) return null;

      const parsedValue = JSON.parse(value);

      return parsedValue;
    } catch (err) {
      return null;
    }
  }

  set(key: string, value: any) {
    try {
      localStorage.setItem(key, JSON.stringify(value));

      return true;
    } catch (err) {
      return false;
    }
  }
}
