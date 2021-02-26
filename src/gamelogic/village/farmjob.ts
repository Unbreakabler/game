import { Exclude, Expose } from "class-transformer";
import type { Wallet } from "../gamemodel";
import type { Requirement } from "./achievable";
import type { FARM_JOB } from "./farmjobs";
import { Achievable } from "./achievable";

export class FarmJob extends Achievable {
  //TODO add some way to make it active  at reduced rrate when you unlock the helper

  @Exclude() private display_name: string;
  @Exclude() public description: string;

  @Exclude() public difficulty_growth_factor: number;
  //exp gained per second
  @Exclude() public base_exp_rate: number;
  //base income gained per second. affected by income growth factor
  @Exclude() public base_income: number;
  //time in seconds per level. affected by level and income growth factor
  //level 0 with income_growth_factor of 1 will take base_time_per_level seconds to level.
  @Exclude() public base_exp_per_level: number;

  //Saveable Members
  @Expose() public active: boolean = false;
  @Expose() public current_exp: number = 0;
  @Expose() public max_level: number = 0;

  public constructor(
    short_name: FARM_JOB,
    requirements: Requirement[],
    display_name: string,
    description: string,
    difficulty_growth_factor: number,
    base_exp_rate: number = 1,
    base_income: number = 1,
    base_time_per_level: number = 5,
    start_level: number = 0,
  ) {
    super(short_name, requirements, start_level);
    this.display_name = display_name;
    this.description = description;
    this.difficulty_growth_factor = difficulty_growth_factor;
    this.base_exp_rate = base_exp_rate;
    this.base_income = base_income;
    this.base_exp_per_level = base_time_per_level;
  }

  public getDisplayName(): string {
    return this.display_name;
  }
  public getCurrentLevel(): number {
    return this.level;
  }

  public getMaxLevelReached(): number {
    return this.max_level;
  }

  /**
   * https://www.desmos.com/calculator/lor4dbrqdz
   * formula 5
   **/
  public getTotalExpToNextLevel(): number {
    //prettier-ignore
    return this.difficulty_growth_factor *
    (this.base_exp_per_level + 10 * Math.log(Math.pow(10, this.level / 10))) *
    1 / ((this.max_level + 10)/ 10);
  }

  /**
   *  https://www.desmos.com/calculator/lor4dbrqdz
   *  formula 2
   */
  public getCurrentIncome(): number {
    const g = this.difficulty_growth_factor;
    //prettier-ignore
    const result = this.base_income * g + 
    0.5 * Math.pow(Math.log(Math.pow(g, g) * this.level + 1), 2) +
    2 * g * Math.pow(g - 1, 2);
    return result / 10;
  }

  public getCurrentExpRate(): number {
    return this.base_exp_rate;
  }

  public update(delta_t_s: number): void {
    if (!this.active) return;
    const exp_gained = delta_t_s * this.getCurrentExpRate();
    this.current_exp += exp_gained;

    //apply exp until no more level ups
    while (this.current_exp > this.getTotalExpToNextLevel()) {
      this.current_exp -= this.getTotalExpToNextLevel();
      this.level++;
    }
  }

  public earnIncome(wallet: Wallet, delta_t_s: number): void {
    if (!this.active) return;
    wallet.money += this.getCurrentIncome() * delta_t_s;
  }
}
