import { writable } from '../../node_modules/svelte/store/index.mjs.js';

const create_count = () => {
    const { subscribe, set, update } = writable(0);
    return {
        subscribe,
        increment: () => update((n) => n + 1),
        decrement: () => update((n) => n - 1),
        reset: () => set(0),
    };
};
const count = create_count();

export { count };
//# sourceMappingURL=store.js.map
