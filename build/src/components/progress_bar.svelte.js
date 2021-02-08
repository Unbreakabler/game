import { SvelteComponent, init, safe_not_equal, element, append, text, space, attr, set_style, insert, set_data, noop, detach } from '../../node_modules/svelte/internal/index.mjs.js';

/* src/components/progress_bar.svelte generated by Svelte v3.32.1 */

function add_css() {
	var style = element("style");
	style.id = "svelte-17qulq4-style";
	style.textContent = "span.svelte-17qulq4{position:absolute;padding:2px 10px;color:white}.container.svelte-17qulq4{height:1.5em;width:100%;background-color:red;display:relative}.progress.svelte-17qulq4{background-color:blue;width:var(--progress_width);height:1.5em}";
	append(document.head, style);
}

function create_fragment(ctx) {
	let div1;
	let span;
	let t0;
	let t1;
	let div0;

	return {
		c() {
			div1 = element("div");
			span = element("span");
			t0 = text(/*name*/ ctx[0]);
			t1 = space();
			div0 = element("div");
			attr(span, "class", "svelte-17qulq4");
			attr(div0, "class", "progress svelte-17qulq4");
			attr(div1, "class", "container svelte-17qulq4");
			set_style(div1, "--progress_width", /*progress_width*/ ctx[1] + "%");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, span);
			append(span, t0);
			append(div1, t1);
			append(div1, div0);
		},
		p(ctx, [dirty]) {
			if (dirty & /*name*/ 1) set_data(t0, /*name*/ ctx[0]);

			if (dirty & /*progress_width*/ 2) {
				set_style(div1, "--progress_width", /*progress_width*/ ctx[1] + "%");
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div1);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let progress_width;
	let { total = 100 } = $$props;
	let { current = 0 } = $$props;
	let { name = "Test" } = $$props;

	$$self.$$set = $$props => {
		if ("total" in $$props) $$invalidate(2, total = $$props.total);
		if ("current" in $$props) $$invalidate(3, current = $$props.current);
		if ("name" in $$props) $$invalidate(0, name = $$props.name);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*current, total*/ 12) {
			 $$invalidate(1, progress_width = current / total * 100);
		}
	};

	return [name, progress_width, total, current];
}

class Progress_bar extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-17qulq4-style")) add_css();
		init(this, options, instance, create_fragment, safe_not_equal, { total: 2, current: 3, name: 0 });
	}
}

export default Progress_bar;
//# sourceMappingURL=progress_bar.svelte.js.map
