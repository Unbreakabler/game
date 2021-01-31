import { writable } from "svelte/store";

const create_count = (): Record<string, unknown> => {
  const { subscribe, set, update } = writable(0);

  return {
    subscribe,
    increment: () => update((n) => n + 1),
    decrement: () => update((n) => n - 1),
    reset: () => set(0),
  } as Record<string, unknown>;
};

export const count = create_count();
