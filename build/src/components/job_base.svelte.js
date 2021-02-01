import { SvelteComponent, init, safe_not_equal, element, append, create_component, space, text, claim_element, children, claim_component, detach, claim_space, claim_text, attr, insert, mount_component, set_data, transition_in, transition_out, destroy_component } from '../../node_modules/svelte/internal/index.mjs.js';
import { gameModel } from '../gamelogic/gamemodel.js';
import { formatNumber } from '../gamelogic/utils.js';
import Progress_bar from './progress_bar.svelte.js';

/* src/components/job_base.svelte generated by Svelte v3.32.1 */

function add_css() {
	var style = element("style");
	style.id = "svelte-7f2fy5-style";
	style.textContent = "row.svelte-7f2fy5{display:flex}div.svelte-7f2fy5{flex:1}";
	append(document.head, style);
}

function create_fragment(ctx) {
	let row;
	let div0;
	let progressbar;
	let t0;
	let div1;
	let t1;
	let t2;
	let div2;
	let t3_value = formatNumber(/*current_income*/ ctx[5], 2) + "";
	let t3;
	let t4;
	let div3;
	let t5_value = formatNumber(/*total_exp_for_level*/ ctx[4] - /*current_exp*/ ctx[2], 2) + "";
	let t5;
	let t6;
	let div4;
	let t7;
	let current;

	progressbar = new Progress_bar({
			props: {
				current: /*current_exp*/ ctx[2],
				total: /*total_exp_for_level*/ ctx[4],
				name: /*job*/ ctx[0].name
			}
		});

	return {
		c() {
			row = element("row");
			div0 = element("div");
			create_component(progressbar.$$.fragment);
			t0 = space();
			div1 = element("div");
			t1 = text(/*current_level*/ ctx[1]);
			t2 = space();
			div2 = element("div");
			t3 = text(t3_value);
			t4 = space();
			div3 = element("div");
			t5 = text(t5_value);
			t6 = space();
			div4 = element("div");
			t7 = text(/*max_level_reached*/ ctx[3]);
			this.h();
		},
		l(nodes) {
			row = claim_element(nodes, "ROW", { class: true });
			var row_nodes = children(row);
			div0 = claim_element(row_nodes, "DIV", { class: true });
			var div0_nodes = children(div0);
			claim_component(progressbar.$$.fragment, div0_nodes);
			div0_nodes.forEach(detach);
			t0 = claim_space(row_nodes);
			div1 = claim_element(row_nodes, "DIV", { class: true });
			var div1_nodes = children(div1);
			t1 = claim_text(div1_nodes, /*current_level*/ ctx[1]);
			div1_nodes.forEach(detach);
			t2 = claim_space(row_nodes);
			div2 = claim_element(row_nodes, "DIV", { class: true });
			var div2_nodes = children(div2);
			t3 = claim_text(div2_nodes, t3_value);
			div2_nodes.forEach(detach);
			t4 = claim_space(row_nodes);
			div3 = claim_element(row_nodes, "DIV", { class: true });
			var div3_nodes = children(div3);
			t5 = claim_text(div3_nodes, t5_value);
			div3_nodes.forEach(detach);
			t6 = claim_space(row_nodes);
			div4 = claim_element(row_nodes, "DIV", { class: true });
			var div4_nodes = children(div4);
			t7 = claim_text(div4_nodes, /*max_level_reached*/ ctx[3]);
			div4_nodes.forEach(detach);
			row_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(div0, "class", "svelte-7f2fy5");
			attr(div1, "class", "svelte-7f2fy5");
			attr(div2, "class", "svelte-7f2fy5");
			attr(div3, "class", "svelte-7f2fy5");
			attr(div4, "class", "svelte-7f2fy5");
			attr(row, "class", "svelte-7f2fy5");
		},
		m(target, anchor) {
			insert(target, row, anchor);
			append(row, div0);
			mount_component(progressbar, div0, null);
			append(row, t0);
			append(row, div1);
			append(div1, t1);
			append(row, t2);
			append(row, div2);
			append(div2, t3);
			append(row, t4);
			append(row, div3);
			append(div3, t5);
			append(row, t6);
			append(row, div4);
			append(div4, t7);
			current = true;
		},
		p(ctx, [dirty]) {
			const progressbar_changes = {};
			if (dirty & /*current_exp*/ 4) progressbar_changes.current = /*current_exp*/ ctx[2];
			if (dirty & /*total_exp_for_level*/ 16) progressbar_changes.total = /*total_exp_for_level*/ ctx[4];
			if (dirty & /*job*/ 1) progressbar_changes.name = /*job*/ ctx[0].name;
			progressbar.$set(progressbar_changes);
			if (!current || dirty & /*current_level*/ 2) set_data(t1, /*current_level*/ ctx[1]);
			if ((!current || dirty & /*current_income*/ 32) && t3_value !== (t3_value = formatNumber(/*current_income*/ ctx[5], 2) + "")) set_data(t3, t3_value);
			if ((!current || dirty & /*total_exp_for_level, current_exp*/ 20) && t5_value !== (t5_value = formatNumber(/*total_exp_for_level*/ ctx[4] - /*current_exp*/ ctx[2], 2) + "")) set_data(t5, t5_value);
			if (!current || dirty & /*max_level_reached*/ 8) set_data(t7, /*max_level_reached*/ ctx[3]);
		},
		i(local) {
			if (current) return;
			transition_in(progressbar.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(progressbar.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(row);
			destroy_component(progressbar);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let game_model_job;
	
	let { job } = $$props;
	let gameModelInstance;
	gameModel.subscribe(m => $$invalidate(6, gameModelInstance = m));
	let current_exp = 0;
	let max_level_reached = 0;
	let total_exp_for_level = 0;
	let current_income = 0;
	let current_level = 0;

	$$self.$$set = $$props => {
		if ("job" in $$props) $$invalidate(0, job = $$props.job);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*gameModelInstance, job*/ 65) {
			 $$invalidate(7, game_model_job = gameModelInstance.saveData.jobs[job.id]);
		}

		if ($$self.$$.dirty & /*game_model_job, job, current_level*/ 131) {
			 if (game_model_job) {
				$$invalidate(1, current_level = game_model_job.current_level);
				$$invalidate(2, current_exp = game_model_job.current_exp);
				$$invalidate(3, max_level_reached = game_model_job.max_level_reached);

				// move this calculations into functions 
				$$invalidate(4, total_exp_for_level = job.getTotalExpForLevel(job.base_exp, job.multiplier, current_level));

				$$invalidate(5, current_income = job.base_income * Math.pow(job.multiplier, current_level));
			}
		}
	};

	return [
		job,
		current_level,
		current_exp,
		max_level_reached,
		total_exp_for_level,
		current_income,
		gameModelInstance,
		game_model_job
	];
}

class Job_base extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-7f2fy5-style")) add_css();
		init(this, options, instance, create_fragment, safe_not_equal, { job: 0 });
	}
}

export default Job_base;
//# sourceMappingURL=job_base.svelte.js.map
