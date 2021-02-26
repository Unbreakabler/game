import { SvelteComponent, init, safe_not_equal, element, append, space, attr, toggle_class, insert, listen, noop, detach, run_all, onMount, binding_callbacks } from '../../node_modules/svelte/internal/index.mjs.js';
import '../../node_modules/phaser/dist/phaser.js';
import { gameModel } from '../gamelogic/gamemodel.js';
import Main from '../scenes/main.js';
import TD from '../scenes/td.js';

/* src/app/game.svelte generated by Svelte v3.32.1 */

function add_css() {
	var style = element("style");
	style.id = "svelte-1br1gug-style";
	style.textContent = "canvas.svelte-1br1gug{width:800px;height:600px}div.svelte-1br1gug{display:flex;flex-direction:column;justify-content:center}button.svelte-1br1gug{border:none;height:32px;width:32px}.base-turret.svelte-1br1gug{background-image:url('static/shotgun.png')}.machine-gun.svelte-1br1gug{background-image:url('static/machine_gun.png')}.active.svelte-1br1gug{background-color:green}";
	append(document.head, style);
}

function create_fragment(ctx) {
	let div;
	let canvas_1;
	let t0;
	let button0;
	let t1;
	let button1;
	let mounted;
	let dispose;

	return {
		c() {
			div = element("div");
			canvas_1 = element("canvas");
			t0 = space();
			button0 = element("button");
			t1 = space();
			button1 = element("button");
			attr(canvas_1, "id", "game-container");
			attr(canvas_1, "class", "svelte-1br1gug");
			attr(button0, "class", "base-turret svelte-1br1gug");
			toggle_class(button0, "active", /*selection*/ ctx[1] === "basic");
			attr(button1, "class", "machine-gun svelte-1br1gug");
			toggle_class(button1, "active", /*selection*/ ctx[1] === "machine_gun");
			attr(div, "class", "svelte-1br1gug");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, canvas_1);
			/*canvas_1_binding*/ ctx[4](canvas_1);
			append(div, t0);
			append(div, button0);
			append(div, t1);
			append(div, button1);

			if (!mounted) {
				dispose = [
					listen(button0, "click", /*click_handler*/ ctx[5]),
					listen(button1, "click", /*click_handler_1*/ ctx[6])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*selection*/ 2) {
				toggle_class(button0, "active", /*selection*/ ctx[1] === "basic");
			}

			if (dirty & /*selection*/ 2) {
				toggle_class(button1, "active", /*selection*/ ctx[1] === "machine_gun");
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
			/*canvas_1_binding*/ ctx[4](null);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let selection;
	
	let canvas;
	let gameModelInstance;
	gameModel.subscribe(m => $$invalidate(3, gameModelInstance = m));

	onMount(() => {
		const config = {
			type: Phaser.CANVAS,
			width: 800,
			height: 600,
			physics: { default: "arcade" },
			canvas,
			scene: [TD, Main]
		};

		new Phaser.Game(config);
	});

	const toggleTowerSelection = tower_type => {
		if (gameModelInstance.tower_defense.selection == tower_type) {
			$$invalidate(3, gameModelInstance.tower_defense.selection = null, gameModelInstance);
		} else {
			gameModelInstance.tower_defense.selectForPlacement(tower_type);
		}
	};

	function canvas_1_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			canvas = $$value;
			$$invalidate(0, canvas);
		});
	}

	const click_handler = () => toggleTowerSelection("basic");
	const click_handler_1 = () => toggleTowerSelection("machine_gun");

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*gameModelInstance*/ 8) {
			 $$invalidate(1, selection = gameModelInstance.tower_defense.selection);
		}
	};

	return [
		canvas,
		selection,
		toggleTowerSelection,
		gameModelInstance,
		canvas_1_binding,
		click_handler,
		click_handler_1
	];
}

class Game extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-1br1gug-style")) add_css();
		init(this, options, instance, create_fragment, safe_not_equal, {});
	}
}

export default Game;
//# sourceMappingURL=game.svelte.js.map
