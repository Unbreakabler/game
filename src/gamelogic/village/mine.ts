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

  @Exclude() public difficulty_growth_factor: number = 1;
  @Exclude() public base_gold_per_level: number = 10;

  //Saveable Members
  @Expose() public active: boolean = false; // Whether the mine is enabled or not.
  @Expose() public current_timer_ms: number = 0;
  @Expose() public mine_timer_ms: number = 4_000; // time to complete a round of mining
  @Expose() public production: number; // number of resources mined each round
  @Expose() public production_multiplier: number;

  public constructor(
    short_name: MINE, 
    upgrades: Upgrade[], 
    display_name: string, 
    description: string,
    production: number = 1,
    production_multiplier: number = 2,
  ) {
    super(short_name);
    this.upgrades = upgrades;
    this.display_name = display_name;
    this.description = description;
    this.production = production;
    this.production_multiplier = production_multiplier
  }

  public getDisplayName() {
    return this.display_name;
  }

  public getTotalMoneyToNextLevel(): number {
    //prettier-ignore
    return this.difficulty_growth_factor *
    (this.base_gold_per_level + 10 * Math.log(Math.pow(10, this.level / 10)));
  }

  public requestLevelUp(wallet: Wallet): void {
    if (!this.active) return;

    if (wallet.money > this.getTotalMoneyToNextLevel()) {
      wallet.money -= this.getTotalMoneyToNextLevel();
      this.level++;
      this.production *= this.production_multiplier;
    }
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