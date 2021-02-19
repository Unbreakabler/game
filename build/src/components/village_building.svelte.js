import { SvelteComponent, init, safe_not_equal, element, create_component, attr, insert, mount_component, transition_in, transition_out, detach, destroy_component, text, append, set_data, is_function, space, noop } from '../../node_modules/svelte/internal/index.mjs.js';
import Card from '../../node_modules/smelte/src/components/Card/index.js';
import Button from '../../node_modules/smelte/src/components/Button/Button.svelte.js';
import { gameModel, updateGameModel } from '../gamelogic/gamemodel.js';

/* src/components/village_building.svelte generated by Svelte v3.32.1 */

function create_title_slot(ctx) {
	let div;
	let card_title;
	let current;

	card_title = new Card.Title({
			props: {
				title: /*building*/ ctx[1].getDisplayName(),
				subheader: /*subheader*/ ctx[2]
			}
		});

	return {
		c() {
			div = element("div");
			create_component(card_title.$$.fragment);
			attr(div, "slot", "title");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			mount_component(card_title, div, null);
			current = true;
		},
		p(ctx, dirty) {
			const card_title_changes = {};
			if (dirty & /*building*/ 2) card_title_changes.title = /*building*/ ctx[1].getDisplayName();
			if (dirty & /*subheader*/ 4) card_title_changes.subheader = /*subheader*/ ctx[2];
			card_title.$set(card_title_changes);
		},
		i(local) {
			if (current) return;
			transition_in(card_title.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(card_title.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			destroy_component(card_title);
		}
	};
}

// (25:4) <div slot="text" class="pb-0 pt-0 p-5">
function create_text_slot(ctx) {
	let div;
	let t0;
	let t1_value = /*building*/ ctx[1].getUpgradeMoneyCost() + "";
	let t1;

	return {
		c() {
			div = element("div");
			t0 = text("Cost to upgrade: ");
			t1 = text(t1_value);
			attr(div, "slot", "text");
			attr(div, "class", "pb-0 pt-0 p-5");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);
		},
		p(ctx, dirty) {
			if (dirty & /*building*/ 2 && t1_value !== (t1_value = /*building*/ ctx[1].getUpgradeMoneyCost() + "")) set_data(t1, t1_value);
		},
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

// (28:8) <Button           text           disabled={building.level == 0}           on:click={() => {             selected = building.short_name;           }}>
function create_default_slot_2(ctx) {
	let t;

	return {
		c() {
			t = text("Visit");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) detach(t);
		}
	};
}

// (35:8) <Button disabled={!canAfford()} text on:click={upgrade(building)}>
function create_default_slot_1(ctx) {
	let t;

	return {
		c() {
			t = text("Upgrade");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) detach(t);
		}
	};
}

// (26:4) <div slot="actions">
function create_actions_slot(ctx) {
	let div0;
	let div1;
	let button0;
	let t;
	let button1;
	let current;

	button0 = new Button({
			props: {
				text: true,
				disabled: /*building*/ ctx[1].level == 0,
				$$slots: { default: [create_default_slot_2] },
				$$scope: { ctx }
			}
		});

	button0.$on("click", /*click_handler*/ ctx[5]);

	button1 = new Button({
			props: {
				disabled: !/*canAfford*/ ctx[4](),
				text: true,
				$$slots: { default: [create_default_slot_1] },
				$$scope: { ctx }
			}
		});

	button1.$on("click", function () {
		if (is_function(/*upgrade*/ ctx[3](/*building*/ ctx[1]))) /*upgrade*/ ctx[3](/*building*/ ctx[1]).apply(this, arguments);
	});

	return {
		c() {
			div0 = element("div");
			div1 = element("div");
			create_component(button0.$$.fragment);
			t = space();
			create_component(button1.$$.fragment);
			attr(div1, "class", "p-2");
			attr(div0, "slot", "actions");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			append(div0, div1);
			mount_component(button0, div1, null);
			append(div1, t);
			mount_component(button1, div1, null);
			current = true;
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			const button0_changes = {};
			if (dirty & /*building*/ 2) button0_changes.disabled = /*building*/ ctx[1].level == 0;

			if (dirty & /*$$scope*/ 256) {
				button0_changes.$$scope = { dirty, ctx };
			}

			button0.$set(button0_changes);
			const button1_changes = {};

			if (dirty & /*$$scope*/ 256) {
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
			if (detaching) detach(div0);
			destroy_component(button0);
			destroy_component(button1);
		}
	};
}

// (23:2) <Card.Card class="bg-white">
function create_default_slot(ctx) {
	let t0;
	let t1;

	return {
		c() {
			t0 = space();
			t1 = space();
		},
		m(target, anchor) {
			insert(target, t0, anchor);
			insert(target, t1, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(t0);
			if (detaching) detach(t1);
		}
	};
}

function create_fragment(ctx) {
	let div;
	let card_card;
	let current;

	card_card = new Card.Card({
			props: {
				class: "bg-white",
				$$slots: {
					default: [create_default_slot],
					actions: [create_actions_slot],
					text: [create_text_slot],
					title: [create_title_slot]
				},
				$$scope: { ctx }
			}
		});

	return {
		c() {
			div = element("div");
			create_component(card_card.$$.fragment);
			attr(div, "class", "my-card");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			mount_component(card_card, div, null);
			current = true;
		},
		p(ctx, [dirty]) {
			const card_card_changes = {};

			if (dirty & /*$$scope, building, selected, subheader*/ 263) {
				card_card_changes.$$scope = { dirty, ctx };
			}

			card_card.$set(card_card_changes);
		},
		i(local) {
			if (current) return;
			transition_in(card_card.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(card_card.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			destroy_component(card_card);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let subheader;
	
	
	let { building } = $$props;
	let { selected } = $$props;
	let gameModelInstance;
	gameModel.subscribe(m => gameModelInstance = m);
	const next_upgrade = building.getNextUpgrade();

	function upgrade(building) {
		building.upgrade(gameModelInstance.wallet);
		updateGameModel();
	}

	function canAfford() {
		return gameModelInstance.wallet.money >= next_upgrade.money_cost;
	}

	const click_handler = () => {
		$$invalidate(0, selected = building.short_name);
	};

	$$self.$$set = $$props => {
		if ("building" in $$props) $$invalidate(1, building = $$props.building);
		if ("selected" in $$props) $$invalidate(0, selected = $$props.selected);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*building*/ 2) {
			 $$invalidate(2, subheader = `Lv. ${building.level}`);
		}
	};

	return [selected, building, subheader, upgrade, canAfford, click_handler];
}

class Village_building extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { building: 1, selected: 0 });
	}
}

export default Village_building;
//# sourceMappingURL=village_building.svelte.js.map
