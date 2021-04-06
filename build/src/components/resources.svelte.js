import { SvelteComponent, init, safe_not_equal, element, append, text, space, insert, set_data, detach, create_component, attr, mount_component, transition_in, transition_out, destroy_each, destroy_component } from '../../node_modules/svelte/internal/index.mjs.js';
import { gameModel } from '../gamelogic/gamemodel.js';
import { saveToStorage, resetSaveGame } from '../gamelogic/util/saveloadfunctions.js';
import { formatNumber } from '../gamelogic/util/utils.js';
import Button from '../../node_modules/smelte/src/components/Button/Button.svelte.js';

/* src/components/resources.svelte generated by Svelte v3.32.1 */

function add_css() {
	var style = element("style");
	style.id = "svelte-1nrd325-style";
	style.textContent = ".resource-container.svelte-1nrd325{display:flex;justify-content:space-between;padding:5px}.money.svelte-1nrd325{width:300px;padding:10px}.coin{width:15px;height:15px;background-color:rgb(221, 184, 67);display:inline-block;border-radius:100px;box-shadow:1px 1px}";
	append(document.head, style);
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[5] = list[i][0];
	child_ctx[6] = list[i][1];
	return child_ctx;
}

// (24:4) {#each resources as [key, val]}
function create_each_block(ctx) {
	let span;
	let t0_value = /*key*/ ctx[5] + "";
	let t0;
	let t1;
	let t2_value = /*val*/ ctx[6] + "";
	let t2;
	let t3;

	return {
		c() {
			span = element("span");
			t0 = text(t0_value);
			t1 = text(": ");
			t2 = text(t2_value);
			t3 = space();
		},
		m(target, anchor) {
			insert(target, span, anchor);
			append(span, t0);
			append(span, t1);
			append(span, t2);
			append(span, t3);
		},
		p(ctx, dirty) {
			if (dirty & /*resources*/ 2 && t0_value !== (t0_value = /*key*/ ctx[5] + "")) set_data(t0, t0_value);
			if (dirty & /*resources*/ 2 && t2_value !== (t2_value = /*val*/ ctx[6] + "")) set_data(t2, t2_value);
		},
		d(detaching) {
			if (detaching) detach(span);
		}
	};
}

// (29:4) <Button color="secondary" on:click={saveGame}>
function create_default_slot_1(ctx) {
	let t;

	return {
		c() {
			t = text("Save");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) detach(t);
		}
	};
}

// (30:4) <Button color="secondary" on:click={hardReset}>
function create_default_slot(ctx) {
	let t;

	return {
		c() {
			t = text("Hard Reset");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) detach(t);
		}
	};
}

function create_fragment(ctx) {
	let div3;
	let div1;
	let t0;
	let t1;
	let div0;
	let t2;
	let t3;
	let div2;
	let button0;
	let t4;
	let button1;
	let current;
	let each_value = /*resources*/ ctx[1];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	button0 = new Button({
			props: {
				color: "secondary",
				$$slots: { default: [create_default_slot_1] },
				$$scope: { ctx }
			}
		});

	button0.$on("click", /*saveGame*/ ctx[2]);

	button1 = new Button({
			props: {
				color: "secondary",
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			}
		});

	button1.$on("click", /*hardReset*/ ctx[3]);

	return {
		c() {
			div3 = element("div");
			div1 = element("div");
			t0 = text(/*money*/ ctx[0]);
			t1 = space();
			div0 = element("div");
			t2 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t3 = space();
			div2 = element("div");
			create_component(button0.$$.fragment);
			t4 = space();
			create_component(button1.$$.fragment);
			attr(div0, "class", "coin");
			attr(div1, "class", "money bg-secondary-400 svelte-1nrd325");
			attr(div3, "class", "resource-container bg-secondary-400 svelte-1nrd325");
		},
		m(target, anchor) {
			insert(target, div3, anchor);
			append(div3, div1);
			append(div1, t0);
			append(div1, t1);
			append(div1, div0);
			append(div1, t2);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div1, null);
			}

			append(div3, t3);
			append(div3, div2);
			mount_component(button0, div2, null);
			append(div2, t4);
			mount_component(button1, div2, null);
			current = true;
		},
		p(ctx, [dirty]) {
			if (!current || dirty & /*money*/ 1) set_data(t0, /*money*/ ctx[0]);

			if (dirty & /*resources*/ 2) {
				each_value = /*resources*/ ctx[1];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div1, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			const button0_changes = {};

			if (dirty & /*$$scope*/ 512) {
				button0_changes.$$scope = { dirty, ctx };
			}

			button0.$set(button0_changes);
			const button1_changes = {};

			if (dirty & /*$$scope*/ 512) {
				button1_changes.$$scope = { dirty, ctx };
			}

			button1.$set(button1_changes);
		},
		i(local) {
			if (current) return;
			transition_in(button0.$$.fragment, local);
			transition_in(button1.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(button0.$$.fragment, local);
			transition_out(button1.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div3);
			destroy_each(each_blocks, detaching);
			destroy_component(button0);
			destroy_component(button1);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let money;
	let resources;
	let gameModelInstance;
	gameModel.subscribe(m => $$invalidate(4, gameModelInstance = m));

	function saveGame() {
		saveToStorage(gameModelInstance);
	}

	function hardReset() {
		if (window.confirm("You will lose all progress. Are you sure?")) {
			resetSaveGame();
			saveGame();
		}
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*gameModelInstance*/ 16) {
			 $$invalidate(0, money = formatNumber(gameModelInstance.wallet.money, 2));
		}

		if ($$self.$$.dirty & /*gameModelInstance*/ 16) {
			 $$invalidate(1, resources = Object.entries(gameModelInstance.resources));
		}
	};

	return [money, resources, saveGame, hardReset, gameModelInstance];
}

class Resources extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-1nrd325-style")) add_css();
		init(this, options, instance, create_fragment, safe_not_equal, {});
	}
}

export default Resources;
//# sourceMappingURL=resources.svelte.js.map