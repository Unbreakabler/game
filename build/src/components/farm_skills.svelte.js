import { SvelteComponent, init, safe_not_equal, element, insert, noop, detach } from '../../node_modules/svelte/internal/index.mjs.js';

/* src/components/farm_skills.svelte generated by Svelte v3.32.1 */

function create_fragment(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.textContent = "Skills Not Yet Implemented baby boy";
		},
		m(target, anchor) {
			insert(target, div, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

class Farm_skills extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, null, create_fragment, safe_not_equal, {});
	}
}

export default Farm_skills;
//# sourceMappingURL=farm_skills.svelte.js.map
