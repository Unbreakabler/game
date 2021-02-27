import { SvelteComponent, init, safe_not_equal, binding_callbacks, bind, create_component, mount_component, add_flush_callback, transition_in, transition_out, destroy_component, element, attr, insert, group_outros, check_outros, detach, destroy_each, empty } from '../../node_modules/svelte/internal/index.mjs.js';
import Tab from '../../node_modules/smelte/src/components/Tabs/Tab.svelte.js';
import Tabs from '../../node_modules/smelte/src/components/Tabs/Tabs.svelte.js';
import Laboratory from '../app/laboratory.svelte.js';
import Blacksmith from '../app/blacksmith.svelte.js';
import Farm from '../app/farm.svelte.js';
import Village from '../app/village.svelte.js';
import Workshop from '../app/workshop.svelte.js';
import { gameModel } from '../gamelogic/gamemodel.js';

/* src/components/tabs.svelte generated by Svelte v3.32.1 */

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[7] = list[i];
	return child_ctx;
}

// (35:6) <Tab id={item.id} bind:selected>
function create_default_slot_1(ctx) {
	let switch_instance;
	let updating_selected;
	let switch_instance_anchor;
	let current;

	function switch_instance_selected_binding(value) {
		/*switch_instance_selected_binding*/ ctx[3].call(null, value);
	}

	var switch_value = /*item*/ ctx[7].component;

	function switch_props(ctx) {
		let switch_instance_props = {};

		if (/*selected*/ ctx[1] !== void 0) {
			switch_instance_props.selected = /*selected*/ ctx[1];
		}

		return { props: switch_instance_props };
	}

	if (switch_value) {
		switch_instance = new switch_value(switch_props(ctx));
		binding_callbacks.push(() => bind(switch_instance, "selected", switch_instance_selected_binding));
	}

	return {
		c() {
			if (switch_instance) create_component(switch_instance.$$.fragment);
			switch_instance_anchor = empty();
		},
		m(target, anchor) {
			if (switch_instance) {
				mount_component(switch_instance, target, anchor);
			}

			insert(target, switch_instance_anchor, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const switch_instance_changes = {};

			if (!updating_selected && dirty & /*selected*/ 2) {
				updating_selected = true;
				switch_instance_changes.selected = /*selected*/ ctx[1];
				add_flush_callback(() => updating_selected = false);
			}

			if (switch_value !== (switch_value = /*item*/ ctx[7].component)) {
				if (switch_instance) {
					group_outros();
					const old_component = switch_instance;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance = new switch_value(switch_props(ctx));
					binding_callbacks.push(() => bind(switch_instance, "selected", switch_instance_selected_binding));
					create_component(switch_instance.$$.fragment);
					transition_in(switch_instance.$$.fragment, 1);
					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
				} else {
					switch_instance = null;
				}
			} else if (switch_value) {
				switch_instance.$set(switch_instance_changes);
			}
		},
		i(local) {
			if (current) return;
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			current = true;
		},
		o(local) {
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(switch_instance_anchor);
			if (switch_instance) destroy_component(switch_instance, detaching);
		}
	};
}

// (34:4) {#each filtered as item}
function create_each_block(ctx) {
	let tab;
	let updating_selected;
	let current;

	function tab_selected_binding(value) {
		/*tab_selected_binding*/ ctx[4].call(null, value);
	}

	let tab_props = {
		id: /*item*/ ctx[7].id,
		$$slots: { default: [create_default_slot_1] },
		$$scope: { ctx }
	};

	if (/*selected*/ ctx[1] !== void 0) {
		tab_props.selected = /*selected*/ ctx[1];
	}

	tab = new Tab({ props: tab_props });
	binding_callbacks.push(() => bind(tab, "selected", tab_selected_binding));

	return {
		c() {
			create_component(tab.$$.fragment);
		},
		m(target, anchor) {
			mount_component(tab, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const tab_changes = {};
			if (dirty & /*filtered*/ 1) tab_changes.id = /*item*/ ctx[7].id;

			if (dirty & /*$$scope, filtered, selected*/ 1027) {
				tab_changes.$$scope = { dirty, ctx };
			}

			if (!updating_selected && dirty & /*selected*/ 2) {
				updating_selected = true;
				tab_changes.selected = /*selected*/ ctx[1];
				add_flush_callback(() => updating_selected = false);
			}

			tab.$set(tab_changes);
		},
		i(local) {
			if (current) return;
			transition_in(tab.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(tab.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(tab, detaching);
		}
	};
}

// (33:2) <div slot="content">
function create_content_slot(ctx) {
	let div;
	let current;
	let each_value = /*filtered*/ ctx[0];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div, "slot", "content");
		},
		m(target, anchor) {
			insert(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			current = true;
		},
		p(ctx, dirty) {
			if (dirty & /*filtered, selected*/ 3) {
				each_value = /*filtered*/ ctx[0];
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
						each_blocks[i].m(div, null);
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
			if (detaching) detach(div);
			destroy_each(each_blocks, detaching);
		}
	};
}

function create_fragment(ctx) {
	let tabs;
	let updating_selected;
	let current;

	function tabs_selected_binding(value) {
		/*tabs_selected_binding*/ ctx[5].call(null, value);
	}

	let tabs_props = {
		items: /*filtered*/ ctx[0],
		class: "bg-primary-500 text-white z-10",
		$$slots: { content: [create_content_slot] },
		$$scope: { ctx }
	};

	if (/*selected*/ ctx[1] !== void 0) {
		tabs_props.selected = /*selected*/ ctx[1];
	}

	tabs = new Tabs({ props: tabs_props });
	binding_callbacks.push(() => bind(tabs, "selected", tabs_selected_binding));

	return {
		c() {
			create_component(tabs.$$.fragment);
		},
		m(target, anchor) {
			mount_component(tabs, target, anchor);
			current = true;
		},
		p(ctx, [dirty]) {
			const tabs_changes = {};
			if (dirty & /*filtered*/ 1) tabs_changes.items = /*filtered*/ ctx[0];

			if (dirty & /*$$scope, filtered, selected*/ 1027) {
				tabs_changes.$$scope = { dirty, ctx };
			}

			if (!updating_selected && dirty & /*selected*/ 2) {
				updating_selected = true;
				tabs_changes.selected = /*selected*/ ctx[1];
				add_flush_callback(() => updating_selected = false);
			}

			tabs.$set(tabs_changes);
		},
		i(local) {
			if (current) return;
			transition_in(tabs.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(tabs.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(tabs, detaching);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let gameModelInstance;
	gameModel.subscribe(m => $$invalidate(2, gameModelInstance = m));

	let items = [
		{
			id: "village",
			component: Village,
			text: "Village",
			locked: false
		},
		{
			id: "farm",
			component: Farm,
			text: "Farm",
			name: "villagebuilding_farm",
			locked: false
		},
		{
			id: "workshop",
			component: Workshop,
			text: "Workshop",
			name: "villagebuilding_workshop",
			locked: false
		},
		{
			id: "blacksmith",
			component: Blacksmith,
			text: "Blacksmith",
			name: "villagebuilding_blacksmith",
			locked: false
		},
		{
			id: "laboratory",
			component: Laboratory,
			text: "Laboratory",
			name: "villagebuilding_laboratory",
			locked: false
		}
	];

	let filtered = items;
	let selected = items[0].id;

	function switch_instance_selected_binding(value) {
		selected = value;
		($$invalidate(1, selected), $$invalidate(6, items));
	}

	function tab_selected_binding(value) {
		selected = value;
		($$invalidate(1, selected), $$invalidate(6, items));
	}

	function tabs_selected_binding(value) {
		selected = value;
		($$invalidate(1, selected), $$invalidate(6, items));
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*gameModelInstance*/ 4) {
			 $$invalidate(0, filtered = items.filter(item => {
				if (!item.name) return true;
				const b = gameModelInstance.village_buildings.get(item.name);
				if (b === undefined) return true;
				if (b.level < 1) return false;
				return true;
			}));
		}
	};

	 $$invalidate(1, selected = items[0].id);

	return [
		filtered,
		selected,
		gameModelInstance,
		switch_instance_selected_binding,
		tab_selected_binding,
		tabs_selected_binding
	];
}

class Tabs_1 extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, {});
	}
}

export default Tabs_1;
//# sourceMappingURL=tabs.svelte.js.map
