import { SvelteComponent, init, safe_not_equal, element, append, attr, toggle_class, insert, listen, noop, detach, text, space, null_to_empty, set_data } from '../../node_modules/svelte/internal/index.mjs.js';
import { gameModel } from '../gamelogic/gamemodel.js';

/* src/components/tower_slot.svelte generated by Svelte v3.32.1 */

function add_css() {
	var style = element("style");
	style.id = "svelte-1rezg55-style";
	style.textContent = "div.svelte-1rezg55{display:flex;flex-direction:column;justify-content:center;align-items:center;cursor:pointer}button.svelte-1rezg55{border:none;height:32px;width:32px}.basic.svelte-1rezg55{background-image:url(\"static/shotgun.png\")}.machine_gun.svelte-1rezg55{background-image:url(\"static/machine_gun.png\")}.active.svelte-1rezg55{background-color:green}.bb.svelte-1rezg55::before,.bb.svelte-1rezg55::after{position:absolute;top:0;bottom:0;left:0;right:0}.item.svelte-1rezg55{position:relative;width:75px;height:75px;margin:auto;color:#b9b9b9;box-shadow:inset 0 0 0 1px rgba(185, 185, 185, 0.5)}.bb.svelte-1rezg55{color:#69ca62;box-shadow:inset 0 0 0 1px rgba(105, 202, 98, 0.5)}.bb.svelte-1rezg55::before,.bb.svelte-1rezg55::after{content:\"\";z-index:-1;margin:-5%;box-shadow:inset 0 0 0 2px;animation:svelte-1rezg55-clipMe 8s linear infinite}.bb.svelte-1rezg55::before{animation-delay:-4s}@keyframes svelte-1rezg55-clipMe{0%,100%{clip:rect(0px, 82.5px, 2px, 0px)}25%{clip:rect(0px, 2px, 82.5px, 0px)}50%{clip:rect(80.5px, 82.5px, 82.5px, 0px)}75%{clip:rect(0px, 82.5px, 82.5px, 80.5px)}}";
	append(document.head, style);
}

// (28:2) {:else}
function create_else_block(ctx) {
	let t;

	return {
		c() {
			t = text("BUSTED REEQUIP");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(t);
		}
	};
}

// (26:32) 
function create_if_block_1(ctx) {
	let t;

	return {
		c() {
			t = text("X");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(t);
		}
	};
}

// (23:2) {#if isTower(tower_info)}
function create_if_block(ctx) {
	let span;
	let t0;
	let t1_value = /*tower_info*/ ctx[0].tier + "";
	let t1;
	let t2;
	let button;
	let button_class_value;

	return {
		c() {
			span = element("span");
			t0 = text("Tier: ");
			t1 = text(t1_value);
			t2 = space();
			button = element("button");
			attr(button, "class", button_class_value = "" + (null_to_empty(/*tower_info*/ ctx[0].type) + " svelte-1rezg55"));
		},
		m(target, anchor) {
			insert(target, span, anchor);
			append(span, t0);
			append(span, t1);
			insert(target, t2, anchor);
			insert(target, button, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*tower_info*/ 1 && t1_value !== (t1_value = /*tower_info*/ ctx[0].tier + "")) set_data(t1, t1_value);

			if (dirty & /*tower_info*/ 1 && button_class_value !== (button_class_value = "" + (null_to_empty(/*tower_info*/ ctx[0].type) + " svelte-1rezg55"))) {
				attr(button, "class", button_class_value);
			}
		},
		d(detaching) {
			if (detaching) detach(span);
			if (detaching) detach(t2);
			if (detaching) detach(button);
		}
	};
}

function create_fragment(ctx) {
	let div;
	let show_if;
	let mounted;
	let dispose;

	function select_block_type(ctx, dirty) {
		if (show_if == null || dirty & /*tower_info*/ 1) show_if = !!isTower(/*tower_info*/ ctx[0]);
		if (show_if) return create_if_block;
		if (/*tower_info*/ ctx[0] === null) return create_if_block_1;
		return create_else_block;
	}

	let current_block_type = select_block_type(ctx, -1);
	let if_block = current_block_type(ctx);

	return {
		c() {
			div = element("div");
			if_block.c();
			attr(div, "class", "item svelte-1rezg55");
			toggle_class(div, "bb", /*tower_id*/ ctx[1] && /*selection_id*/ ctx[2] === /*tower_id*/ ctx[1]);
		},
		m(target, anchor) {
			insert(target, div, anchor);
			if_block.m(div, null);

			if (!mounted) {
				dispose = listen(div, "click", /*click_handler*/ ctx[5]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (current_block_type === (current_block_type = select_block_type(ctx, dirty)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(div, null);
				}
			}

			if (dirty & /*tower_id, selection_id*/ 6) {
				toggle_class(div, "bb", /*tower_id*/ ctx[1] && /*selection_id*/ ctx[2] === /*tower_id*/ ctx[1]);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
			if_block.d();
			mounted = false;
			dispose();
		}
	};
}

function isTower(tower) {
	return tower ? tower.tier !== undefined : false;
}

function instance($$self, $$props, $$invalidate) {
	let selection_id;
	
	let gameModelInstance;
	gameModel.subscribe(m => $$invalidate(4, gameModelInstance = m));

	const toggleTowerSelection = tower_id => {
		if (tower_id && gameModelInstance.tower_defense.selection?.id != tower_id) {
			gameModelInstance.tower_defense.setSelection(tower_id);
		} else {
			$$invalidate(4, gameModelInstance.tower_defense.selection = null, gameModelInstance);
		}
	};

	let { tower_info } = $$props;
	let { tower_id } = $$props;
	const click_handler = () => toggleTowerSelection(tower_id);

	$$self.$$set = $$props => {
		if ("tower_info" in $$props) $$invalidate(0, tower_info = $$props.tower_info);
		if ("tower_id" in $$props) $$invalidate(1, tower_id = $$props.tower_id);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*gameModelInstance*/ 16) {
			 $$invalidate(2, selection_id = gameModelInstance.tower_defense.selection?.id || null);
		}
	};

	return [
		tower_info,
		tower_id,
		selection_id,
		toggleTowerSelection,
		gameModelInstance,
		click_handler
	];
}

class Tower_slot extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-1rezg55-style")) add_css();
		init(this, options, instance, create_fragment, safe_not_equal, { tower_info: 0, tower_id: 1 });
	}
}

export default Tower_slot;
//# sourceMappingURL=tower_slot.svelte.js.map
