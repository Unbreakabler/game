import { SvelteComponent, init, safe_not_equal, element, append, text, space, attr, insert, set_data, noop, detach } from '../../node_modules/svelte/internal/index.mjs.js';
import { gameModel } from '../gamelogic/gamemodel.js';

/* src/components/wave_status.svelte generated by Svelte v3.32.1 */

function add_css() {
	var style = element("style");
	style.id = "svelte-1kaiwp6-style";
	style.textContent = ".main.svelte-1kaiwp6.svelte-1kaiwp6{display:flex;flex-direction:row;padding:0 10px;background:rgba(63, 63, 63, 0.5);border:4px solid #ffffff;border-radius:8px;max-width:400px;transform:skew(-25deg)}.main.svelte-1kaiwp6 .svelte-1kaiwp6:not(:first-child){padding-left:5px}.main.svelte-1kaiwp6 div.svelte-1kaiwp6{transform:skew(25deg)}";
	append(document.head, style);
}

function create_fragment(ctx) {
	let div6;
	let div0;
	let t0;
	let t1;
	let t2;
	let t3;
	let t4;
	let div1;
	let t5;
	let t6;
	let t7;
	let div2;
	let t8;
	let t9;
	let t10;
	let div3;
	let t11;
	let t12;
	let t13;
	let div4;
	let t14;
	let t15;
	let t16;
	let div5;
	let t17;
	let t18;

	return {
		c() {
			div6 = element("div");
			div0 = element("div");
			t0 = text("S: ");
			t1 = text(/*spawned*/ ctx[1]);
			t2 = text("/");
			t3 = text(/*total*/ ctx[0]);
			t4 = space();
			div1 = element("div");
			t5 = text("A: ");
			t6 = text(/*alive*/ ctx[2]);
			t7 = space();
			div2 = element("div");
			t8 = text("K: ");
			t9 = text(/*killed*/ ctx[3]);
			t10 = space();
			div3 = element("div");
			t11 = text("L: ");
			t12 = text(/*leaked*/ ctx[4]);
			t13 = space();
			div4 = element("div");
			t14 = text("lives: ");
			t15 = text(/*lives*/ ctx[5]);
			t16 = space();
			div5 = element("div");
			t17 = text("wave: ");
			t18 = text(/*wave*/ ctx[6]);
			attr(div0, "class", "svelte-1kaiwp6");
			attr(div1, "class", "svelte-1kaiwp6");
			attr(div2, "class", "svelte-1kaiwp6");
			attr(div3, "class", "svelte-1kaiwp6");
			attr(div4, "class", "svelte-1kaiwp6");
			attr(div5, "class", "svelte-1kaiwp6");
			attr(div6, "class", "main svelte-1kaiwp6");
		},
		m(target, anchor) {
			insert(target, div6, anchor);
			append(div6, div0);
			append(div0, t0);
			append(div0, t1);
			append(div0, t2);
			append(div0, t3);
			append(div6, t4);
			append(div6, div1);
			append(div1, t5);
			append(div1, t6);
			append(div6, t7);
			append(div6, div2);
			append(div2, t8);
			append(div2, t9);
			append(div6, t10);
			append(div6, div3);
			append(div3, t11);
			append(div3, t12);
			append(div6, t13);
			append(div6, div4);
			append(div4, t14);
			append(div4, t15);
			append(div6, t16);
			append(div6, div5);
			append(div5, t17);
			append(div5, t18);
		},
		p(ctx, [dirty]) {
			if (dirty & /*spawned*/ 2) set_data(t1, /*spawned*/ ctx[1]);
			if (dirty & /*total*/ 1) set_data(t3, /*total*/ ctx[0]);
			if (dirty & /*alive*/ 4) set_data(t6, /*alive*/ ctx[2]);
			if (dirty & /*killed*/ 8) set_data(t9, /*killed*/ ctx[3]);
			if (dirty & /*leaked*/ 16) set_data(t12, /*leaked*/ ctx[4]);
			if (dirty & /*lives*/ 32) set_data(t15, /*lives*/ ctx[5]);
			if (dirty & /*wave*/ 64) set_data(t18, /*wave*/ ctx[6]);
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div6);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let total;
	let spawned;
	let alive;
	let killed;
	let leaked;
	let lives;
	let wave;
	let gameModelInstance;
	gameModel.subscribe(m => $$invalidate(7, gameModelInstance = m));

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*gameModelInstance*/ 128) {
			 $$invalidate(0, total = gameModelInstance.tower_defense.current_wave_info.total);
		}

		if ($$self.$$.dirty & /*gameModelInstance*/ 128) {
			 $$invalidate(1, spawned = gameModelInstance.tower_defense.current_wave_info.spawned);
		}

		if ($$self.$$.dirty & /*gameModelInstance*/ 128) {
			 $$invalidate(2, alive = gameModelInstance.tower_defense.current_wave_info.alive);
		}

		if ($$self.$$.dirty & /*gameModelInstance*/ 128) {
			 $$invalidate(3, killed = gameModelInstance.tower_defense.current_wave_info.killed);
		}

		if ($$self.$$.dirty & /*gameModelInstance*/ 128) {
			 $$invalidate(4, leaked = gameModelInstance.tower_defense.current_wave_info.leaked);
		}

		if ($$self.$$.dirty & /*gameModelInstance*/ 128) {
			 $$invalidate(5, lives = gameModelInstance.tower_defense.current_wave_info.lives);
		}

		if ($$self.$$.dirty & /*gameModelInstance*/ 128) {
			 $$invalidate(6, wave = gameModelInstance.tower_defense.current_wave_info.level);
		}
	};

	return [total, spawned, alive, killed, leaked, lives, wave, gameModelInstance];
}

class Wave_status extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-1kaiwp6-style")) add_css();
		init(this, options, instance, create_fragment, safe_not_equal, {});
	}
}

export default Wave_status;
//# sourceMappingURL=wave_status.svelte.js.map
