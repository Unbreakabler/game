import { Exclude, Expose } from "class-transformer";
import type { Resources, Wallet } from "../gamemodel";
import type { IIndexable } from "../td/stats_tower_modifiers";
import { Achievable } from "./achievable";
import type { MINE } from "./mines";
import type { Upgrade } from "./villagebuildings";

export class Mine extends Achievable {
  @Exclude() public display_name: string;
  @Exclude() public description: string;
  @Exclude() public upgrades: Upgrade[];

  @Exclude() public difficulty_growth_factor: number;
  @Exclude() public base_gold_per_level: number = 10;

  //Saveable Members
  @Expose() public active: boolean; // Whether the mine is enabled or not.
  @Expose() public current_timer_ms: number = 0;
  @Expose() public mine_timer_ms: number = 4_000; // time to complete a round of mining
  @Expose() public production: number; // number of resources mined each round
  @Expose() public production_multiplier: number;

  public constructor(
    short_name: MINE, 
    upgrades: Upgrade[], 
    display_name: string, 
    description: string,
    difficulty_growth_factor: number = 1,
    active: boolean = false,
    production: number = 1,
    production_multiplier: number = 2,
  ) {
    super(short_name);
    this.upgrades = upgrades;
    this.display_name = display_name;
    this.description = description;
    this.difficulty_growth_factor = difficulty_growth_factor;
    this.active = active;
    this.production = production;
    this.production_multiplier = production_multiplier
  }

  public getDisplayName() {
    return this.display_name;
  }

  public getTotalMoneyToLevel(levels_to_calc: number=1): number {
    //prettier-ignore
    let total = 0
    let starting_level = this.level;
    while (levels_to_calc > 0) {
      total += this.difficulty_growth_factor *
      (this.base_gold_per_level + 10 * Math.log(Math.pow(10, starting_level / 10)));
      levels_to_calc--;
      starting_level++;
    }
    return total;
  }

  public getMaxLevelAffordable(money: number): number {
    let level = 0;
    while (money > this.getTotalMoneyToLevel(level)) {
      level++;
    }
    return level;
  }
 
  public requestLevelUp(wallet: Wallet, level: number = 1): void {
    const cost = this.getTotalMoneyToLevel(level)
    console.log('requestLevelUp', wallet, cost)
    if (wallet.money >= cost) {
      wallet.money -= cost;
      this.level += level;
      if (this.level > 1) this.production *= this.production_multiplier;
      this.active = true;
    }
  }

  public manuallyMine(): void {
    if (!this.active) return
    // TODO(jon): instead of adding 1 second every click this should be upgradeable
    this.current_timer_ms = this.current_timer_ms + 1000
  }

  public update(resources: Resources, delta_t_ms: number): void {
    if (!this.active) return;
    
    this.current_timer_ms += delta_t_ms;
    while (this.current_timer_ms > this.mine_timer_ms) {
      // inc resource for the mine
      this.current_timer_ms -= this.mine_timer_ms;
      if ((resources as IIndexable)[this.short_name] !== undefined) {
        (resources as IIndexable)[this.short_name] = (resources as IIndexable)[this.short_name] + this.production
      }
    }    
  }
}