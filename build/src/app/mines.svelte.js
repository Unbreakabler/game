import { SvelteComponent, init, safe_not_equal, element, append, empty, insert, group_outros, transition_out, check_outros, transition_in, detach, text, space, attr, listen, set_data, destroy_each, noop, create_component, mount_component, destroy_component } from '../../node_modules/svelte/internal/index.mjs.js';
import Mine from '../components/mine.svelte.js';
import { gameModel } from '../gamelogic/gamemodel.js';

/* src/app/mines.svelte generated by Svelte v3.32.1 */

function add_css() {
	var style = element("style");
	style.id = "svelte-dbnt1z-style";
	style.textContent = "button.svelte-dbnt1z{margin:5px;padding:5px 15px;font-size:30px;color:#fff;background-color:rgb(95, 95, 95);border:3px solid rgb(184, 184, 184)}";
	append(document.head, style);
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[6] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[9] = list[i];
	return child_ctx;
}

// (17:2) {:else}
function create_else_block(ctx) {
	let div;
	let t;
	let each_value_1 = /*mine*/ ctx[6].requirements;
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t = space();
		},
		m(target, anchor) {
			insert(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			append(div, t);
		},
		p(ctx, dirty) {
			if (dirty & /*mines, gameModelInstance*/ 5) {
				each_value_1 = /*mine*/ ctx[6].requirements;
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, t);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
			destroy_each(each_blocks, detaching);
		}
	};
}

// (15:2) {#if mine.areRequirementsMet(gameModelInstance.achievables)}
function create_if_block(ctx) {
	let minecomponent;
	let current;

	minecomponent = new Mine({
			props: {
				mine: /*mine*/ ctx[6],
				purchase_quantity: /*purchase_quantity*/ ctx[3]
			}
		});

	return {
		c() {
			create_component(minecomponent.$$.fragment);
		},
		m(target, anchor) {
			mount_component(minecomponent, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const minecomponent_changes = {};
			if (dirty & /*mines*/ 4) minecomponent_changes.mine = /*mine*/ ctx[6];
			if (dirty & /*purchase_quantity*/ 8) minecomponent_changes.purchase_quantity = /*purchase_quantity*/ ctx[3];
			minecomponent.$set(minecomponent_changes);
		},
		i(local) {
			if (current) return;
			transition_in(minecomponent.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(minecomponent.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(minecomponent, detaching);
		}
	};
}

// (19:6) {#each mine.requirements as r}
function create_each_block_1(ctx) {
	let t0;
	let t1_value = /*gameModelInstance*/ ctx[0].achievables.get(/*r*/ ctx[9].achievable_name)?.getDisplayName() + "";
	let t1;
	let t2;
	let t3_value = /*r*/ ctx[9].level_required + "";
	let t3;

	return {
		c() {
			t0 = text("Requires ");
			t1 = text(t1_value);
			t2 = text(" level ");
			t3 = text(t3_value);
		},
		m(target, anchor) {
			insert(target, t0, anchor);
			insert(target, t1, anchor);
			insert(target, t2, anchor);
			insert(target, t3, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*gameModelInstance, mines*/ 5 && t1_value !== (t1_value = /*gameModelInstance*/ ctx[0].achievables.get(/*r*/ ctx[9].achievable_name)?.getDisplayName() + "")) set_data(t1, t1_value);
			if (dirty & /*mines*/ 4 && t3_value !== (t3_value = /*r*/ ctx[9].level_required + "")) set_data(t3, t3_value);
		},
		d(detaching) {
			if (detaching) detach(t0);
			if (detaching) detach(t1);
			if (detaching) detach(t2);
			if (detaching) detach(t3);
		}
	};
}

// (14:0) {#each mines as mine}
function create_each_block(ctx) {
	let show_if;
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block, create_else_block];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (dirty & /*mines, gameModelInstance*/ 5) show_if = !!/*mine*/ ctx[6].areRequirementsMet(/*gameModelInstance*/ ctx[0].achievables);
		if (show_if) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx, -1);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	return {
		c() {
			if_block.c();
			if_block_anchor = empty();
		},
		m(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert(target, if_block_anchor, anchor);
			current = true;
		},
		p(ctx, dirty) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx, dirty);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				transition_in(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach(if_block_anchor);
		}
	};
}

function create_fragment(ctx) {
	let button;
	let t0;
	let t1;
	let t2;
	let each_1_anchor;
	let current;
	let mounted;
	let dispose;
	let each_value = /*mines*/ ctx[2];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	return {
		c() {
			button = element("button");
			t0 = text("BUY ");
			t1 = text(/*purchase_quantity*/ ctx[3]);
			t2 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
			attr(button, "class", "svelte-dbnt1z");
		},
		m(target, anchor) {
			insert(target, button, anchor);
			append(button, t0);
			append(button, t1);
			insert(target, t2, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert(target, each_1_anchor, anchor);
			current = true;

			if (!mounted) {
				dispose = listen(button, "click", /*click_handler*/ ctx[4]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (!current || dirty & /*purchase_quantity*/ 8) set_data(t1, /*purchase_quantity*/ ctx[3]);

			if (dirty & /*mines, purchase_quantity, gameModelInstance*/ 13) {
				each_value = /*mines*/ ctx[2];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) detach(button);
			if (detaching) detach(t2);
			destroy_each(each_blocks, detaching);
			if (detaching) detach(each_1_anchor);
			mounted = false;
			dispose();
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let purchase_quantity;
	
	let gameModelInstance;
	gameModel.subscribe(m => $$invalidate(0, gameModelInstance = m));
	let mines;
	let buy_index = 0;
	const buy_values = [1, 5, 10, 25];
	const click_handler = () => $$invalidate(1, buy_index++, buy_index);

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*gameModelInstance*/ 1) {
			 $$invalidate(2, mines = Array.from(gameModelInstance.mines.values()));
		}

		if ($$self.$$.dirty & /*buy_index*/ 2) {
			 $$invalidate(3, purchase_quantity = buy_values[buy_index % buy_values.length]);
		}
	};

	return [gameModelInstance, buy_index, mines, purchase_quantity, click_handler];
}

class Mines extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-dbnt1z-style")) add_css();
		init(this, options, instance, create_fragment, safe_not_equal, {});
	}
}

export default Mines;
//# sourceMappingURL=mines.svelte.js.map
