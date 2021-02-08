import { SvelteComponent, init, safe_not_equal, text, insert, noop, detach } from '../../node_modules/svelte/internal/index.mjs.js';

/* src/app/workshop.svelte generated by Svelte v3.32.1 */

function create_fragment(ctx) {
	let t;

	return {
		c() {
			t = text("WORKSHOP HERE");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(t);
		}
	};
}

class Workshop extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, null, create_fragment, safe_not_equal, {});
	}
}

export default Workshop;
//# sourceMappingURL=workshop.svelte.js.map
