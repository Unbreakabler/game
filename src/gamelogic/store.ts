import { writable, Readable } from "svelte/store";

interface Incrementable<T> extends Readable<T> {
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

const create_count = (): Incrementable<number> => {
  const { subscribe, set, update } = writable(0);

  return {
    subscribe,
    increment: () => update((n) => n + 1),
    decrement: () => update((n) => n - 1),
    reset: () => set(0),
  };
};

export const count = create_count();
