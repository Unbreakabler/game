import { SvelteComponent, init, safe_not_equal, element, append, text, attr, insert, set_data, detach, destroy_each, space, null_to_empty, noop } from '../../node_modules/svelte/internal/index.mjs.js';
import { gameModel } from '../gamelogic/gamemodel.js';
import { ENEMY_MODIFIERS } from '../gamelogic/td/enemy_wave_generator.js';

/* src/components/wave_indicator.svelte generated by Svelte v3.32.1 */

function add_css() {
	var style = element("style");
	style.id = "svelte-18vyhos-style";
	style.textContent = ".main.svelte-18vyhos{display:flex;flex-direction:column}.indicator.svelte-18vyhos{display:flex;flex-direction:column;height:500px;overflow-y:scroll;min-width:200px}.wave_type.svelte-18vyhos{display:flex}.wave.svelte-18vyhos{background:rgba(202, 202, 202, 0.521);padding:5px;margin:5px}.wave_normal.svelte-18vyhos{color:#fff}.wave_magic.svelte-18vyhos{color:blue}.wave_rare.svelte-18vyhos{color:yellow}.green_knight.svelte-18vyhos{display:inline-block;width:20px;height:32px;background-image:url('static/green_knight.png')}";
	append(document.head, style);
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[4] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[7] = list[i];
	return child_ctx;
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[7] = list[i];
	return child_ctx;
}

// (20:4) {#if current_wave.modifier_ids.length}
function create_if_block_1(ctx) {
	let span;
	let t;
	let each_value_2 = /*current_wave*/ ctx[1].modifier_ids;
	let each_blocks = [];

	for (let i = 0; i < each_value_2.length; i += 1) {
		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
	}

	return {
		c() {
			span = element("span");
			t = text("mods:\n        ");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(span, "class", "modifiers");
		},
		m(target, anchor) {
			insert(target, span, anchor);
			append(span, t);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(span, null);
			}
		},
		p(ctx, dirty) {
			if (dirty & /*getMod, current_wave*/ 6) {
				each_value_2 = /*current_wave*/ ctx[1].modifier_ids;
				let i;

				for (i = 0; i < each_value_2.length; i += 1) {
					const child_ctx = get_each_context_2(ctx, each_value_2, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_2(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(span, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_2.length;
			}
		},
		d(detaching) {
			if (detaching) detach(span);
			destroy_each(each_blocks, detaching);
		}
	};
}

// (23:8) {#each current_wave.modifier_ids as mod_id}
function create_each_block_2(ctx) {
	let t_value = /*getMod*/ ctx[2](/*mod_id*/ ctx[7])?.name + "";
	let t;

	return {
		c() {
			t = text(t_value);
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*current_wave*/ 2 && t_value !== (t_value = /*getMod*/ ctx[2](/*mod_id*/ ctx[7])?.name + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(t);
		}
	};
}

// (40:8) {#if wave.modifier_ids.length}
function create_if_block(ctx) {
	let span;
	let t;
	let each_value_1 = /*wave*/ ctx[4].modifier_ids;
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	return {
		c() {
			span = element("span");
			t = text("mods:\n            ");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(span, "class", "modifiers");
		},
		m(target, anchor) {
			insert(target, span, anchor);
			append(span, t);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(span, null);
			}
		},
		p(ctx, dirty) {
			if (dirty & /*getMod, waves*/ 5) {
				each_value_1 = /*wave*/ ctx[4].modifier_ids;
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(span, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}
		},
		d(detaching) {
			if (detaching) detach(span);
			destroy_each(each_blocks, detaching);
		}
	};
}

// (43:12) {#each wave.modifier_ids as mod_id}
function create_each_block_1(ctx) {
	let t_value = /*getMod*/ ctx[2](/*mod_id*/ ctx[7])?.name + "";
	let t;

	return {
		c() {
			t = text(t_value);
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*waves*/ 1 && t_value !== (t_value = /*getMod*/ ctx[2](/*mod_id*/ ctx[7])?.name + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(t);
		}
	};
}

// (35:4) {#each waves as wave}
function create_each_block(ctx) {
	let div3;
	let div1;
	let t0_value = /*wave*/ ctx[4].enemy_type + "";
	let t0;
	let t1;
	let div0;
	let div0_class_value;
	let t2;
	let t3_value = /*wave*/ ctx[4].mob_count + "";
	let t3;
	let div1_class_value;
	let t4;
	let t5;
	let div2;
	let span0;
	let t6;
	let t7_value = /*wave*/ ctx[4].wave_difficulty + "";
	let t7;
	let t8;
	let span1;
	let t9;
	let t10_value = /*wave*/ ctx[4].mob_difficulty + "";
	let t10;
	let t11;
	let if_block = /*wave*/ ctx[4].modifier_ids.length && create_if_block(ctx);

	return {
		c() {
			div3 = element("div");
			div1 = element("div");
			t0 = text(t0_value);
			t1 = text(" - ");
			div0 = element("div");
			t2 = text(" x ");
			t3 = text(t3_value);
			t4 = space();
			if (if_block) if_block.c();
			t5 = space();
			div2 = element("div");
			span0 = element("span");
			t6 = text("wave: ");
			t7 = text(t7_value);
			t8 = space();
			span1 = element("span");
			t9 = text("mob: ");
			t10 = text(t10_value);
			t11 = space();
			attr(div0, "class", div0_class_value = "" + (null_to_empty(/*wave*/ ctx[4].enemy_type) + " svelte-18vyhos"));
			attr(div1, "class", div1_class_value = "wave_type wave_" + /*wave*/ ctx[4].wave_type + " svelte-18vyhos");
			attr(span0, "class", "modifiers");
			attr(span1, "class", "modifiers");
			attr(div3, "class", "wave svelte-18vyhos");
		},
		m(target, anchor) {
			insert(target, div3, anchor);
			append(div3, div1);
			append(div1, t0);
			append(div1, t1);
			append(div1, div0);
			append(div1, t2);
			append(div1, t3);
			append(div3, t4);
			if (if_block) if_block.m(div3, null);
			append(div3, t5);
			append(div3, div2);
			append(div2, span0);
			append(span0, t6);
			append(span0, t7);
			append(div2, t8);
			append(div2, span1);
			append(span1, t9);
			append(span1, t10);
			append(div3, t11);
		},
		p(ctx, dirty) {
			if (dirty & /*waves*/ 1 && t0_value !== (t0_value = /*wave*/ ctx[4].enemy_type + "")) set_data(t0, t0_value);

			if (dirty & /*waves*/ 1 && div0_class_value !== (div0_class_value = "" + (null_to_empty(/*wave*/ ctx[4].enemy_type) + " svelte-18vyhos"))) {
				attr(div0, "class", div0_class_value);
			}

			if (dirty & /*waves*/ 1 && t3_value !== (t3_value = /*wave*/ ctx[4].mob_count + "")) set_data(t3, t3_value);

			if (dirty & /*waves*/ 1 && div1_class_value !== (div1_class_value = "wave_type wave_" + /*wave*/ ctx[4].wave_type + " svelte-18vyhos")) {
				attr(div1, "class", div1_class_value);
			}

			if (/*wave*/ ctx[4].modifier_ids.length) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					if_block.m(div3, t5);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*waves*/ 1 && t7_value !== (t7_value = /*wave*/ ctx[4].wave_difficulty + "")) set_data(t7, t7_value);
			if (dirty & /*waves*/ 1 && t10_value !== (t10_value = /*wave*/ ctx[4].mob_difficulty + "")) set_data(t10, t10_value);
		},
		d(detaching) {
			if (detaching) detach(div3);
			if (if_block) if_block.d();
		}
	};
}

function create_fragment(ctx) {
	let div5;
	let t0;
	let div3;
	let div1;
	let t1_value = /*current_wave*/ ctx[1].enemy_type + "";
	let t1;
	let t2;
	let div0;
	let div0_class_value;
	let t3;
	let t4_value = /*current_wave*/ ctx[1].mob_count + "";
	let t4;
	let div1_class_value;
	let t5;
	let t6;
	let div2;
	let span0;
	let t7;
	let t8_value = /*current_wave*/ ctx[1].wave_difficulty + "";
	let t8;
	let t9;
	let span1;
	let t10;
	let t11_value = /*current_wave*/ ctx[1].mob_difficulty + "";
	let t11;
	let t12;
	let div4;
	let if_block = /*current_wave*/ ctx[1].modifier_ids.length && create_if_block_1(ctx);
	let each_value = /*waves*/ ctx[0];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			div5 = element("div");
			t0 = text("Current wave:\n  ");
			div3 = element("div");
			div1 = element("div");
			t1 = text(t1_value);
			t2 = text(" - ");
			div0 = element("div");
			t3 = text(" x ");
			t4 = text(t4_value);
			t5 = space();
			if (if_block) if_block.c();
			t6 = space();
			div2 = element("div");
			span0 = element("span");
			t7 = text("wave: ");
			t8 = text(t8_value);
			t9 = space();
			span1 = element("span");
			t10 = text("mob: ");
			t11 = text(t11_value);
			t12 = text("\n  Upcoming waves:\n  ");
			div4 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div0, "class", div0_class_value = "" + (null_to_empty(/*current_wave*/ ctx[1].enemy_type) + " svelte-18vyhos"));
			attr(div1, "class", div1_class_value = "wave_type wave_" + /*current_wave*/ ctx[1].wave_type + " svelte-18vyhos");
			attr(span0, "class", "modifiers");
			attr(span1, "class", "modifiers");
			attr(div3, "class", "wave svelte-18vyhos");
			attr(div4, "class", "indicator svelte-18vyhos");
			attr(div5, "class", "main svelte-18vyhos");
		},
		m(target, anchor) {
			insert(target, div5, anchor);
			append(div5, t0);
			append(div5, div3);
			append(div3, div1);
			append(div1, t1);
			append(div1, t2);
			append(div1, div0);
			append(div1, t3);
			append(div1, t4);
			append(div3, t5);
			if (if_block) if_block.m(div3, null);
			append(div3, t6);
			append(div3, div2);
			append(div2, span0);
			append(span0, t7);
			append(span0, t8);
			append(div2, t9);
			append(div2, span1);
			append(span1, t10);
			append(span1, t11);
			append(div5, t12);
			append(div5, div4);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div4, null);
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*current_wave*/ 2 && t1_value !== (t1_value = /*current_wave*/ ctx[1].enemy_type + "")) set_data(t1, t1_value);

			if (dirty & /*current_wave*/ 2 && div0_class_value !== (div0_class_value = "" + (null_to_empty(/*current_wave*/ ctx[1].enemy_type) + " svelte-18vyhos"))) {
				attr(div0, "class", div0_class_value);
			}

			if (dirty & /*current_wave*/ 2 && t4_value !== (t4_value = /*current_wave*/ ctx[1].mob_count + "")) set_data(t4, t4_value);

			if (dirty & /*current_wave*/ 2 && div1_class_value !== (div1_class_value = "wave_type wave_" + /*current_wave*/ ctx[1].wave_type + " svelte-18vyhos")) {
				attr(div1, "class", div1_class_value);
			}

			if (/*current_wave*/ ctx[1].modifier_ids.length) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_1(ctx);
					if_block.c();
					if_block.m(div3, t6);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*current_wave*/ 2 && t8_value !== (t8_value = /*current_wave*/ ctx[1].wave_difficulty + "")) set_data(t8, t8_value);
			if (dirty & /*current_wave*/ 2 && t11_value !== (t11_value = /*current_wave*/ ctx[1].mob_difficulty + "")) set_data(t11, t11_value);

			if (dirty & /*waves, getMod*/ 5) {
				each_value = /*waves*/ ctx[0];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div4, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div5);
			if (if_block) if_block.d();
			destroy_each(each_blocks, detaching);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let waves;
	let current_wave;
	let gameModelInstance;
	gameModel.subscribe(m => $$invalidate(3, gameModelInstance = m));

	const getMod = mod_id => {
		return ENEMY_MODIFIERS[mod_id];
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*gameModelInstance*/ 8) {
			 $$invalidate(0, waves = [...gameModelInstance.tower_defense.waves]);
		}

		if ($$self.$$.dirty & /*waves*/ 1) {
			 if (waves) waves.splice(0, 1);
		}

		if ($$self.$$.dirty & /*gameModelInstance*/ 8) {
			 $$invalidate(1, current_wave = gameModelInstance.tower_defense.getCurrentWave());
		}
	};

	return [waves, current_wave, getMod, gameModelInstance];
}

class Wave_indicator extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-18vyhos-style")) add_css();
		init(this, options, instance, create_fragment, safe_not_equal, {});
	}
}

export default Wave_indicator;
//# sourceMappingURL=wave_indicator.svelte.js.map
