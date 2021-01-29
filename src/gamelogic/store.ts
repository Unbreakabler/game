import { writable } from "svelte/store";

function createCount() {
  const { subscribe, set, update } = writable(0);

  let test: any = 1

  console.log('ts', test)

  return {
    subscribe,
    increment: () => update((n) => n + 1),
    decrement: () => update((n) => n - 1),
    reset: () => set(0),
  };
}

export const count = createCount();
