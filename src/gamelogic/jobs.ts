import { gameModel, GameModel, updateGameModel } from "./gamemodel";
import { saveSaveGame } from "./saveloadfunctions";

/**
 * Reference to the GameModel.
 * We use the subscribe function so if the store is updated our local instance will also update.
 */
let gameModelInstance: GameModel;
gameModel.subscribe((m) => (gameModelInstance = m));

export class Job {
  public id: number; // unique id
  public name: string;
  public description: string;
  public base_exp: number;
  public base_income: number;
  public base_exp_rate: number;
  public multiplier: number;

  //prettier-ignore
  public constructor(id: number, name: string, description: string, base_exp: number, base_income: number, base_exp_rate:number, multiplier: number) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.base_exp = base_exp;
      this.base_income = base_income;
      this.base_exp_rate = base_exp_rate;
      this.multiplier = multiplier;
  }

  public getCurrentLevel(): number {
    return gameModelInstance.saveData.jobs[this.id].current_level;
  }

  public getCurrentExp(): number {
    return gameModelInstance.saveData.jobs[this.id].current_exp;
  }

  public getMaxLevelReached(): number {
    return gameModelInstance.saveData.jobs[this.id].max_level_reached;
  }

  /**
   * Get the current price to buy one of these upgrades.
   * Formula to calculate the price is base_exp * (multiplier ^ bought)
   */
  // Memoize these functions
  public getTotalExpForLevel(base_exp: number, multiplier: number, current_level: number): number {
    return base_exp * Math.pow(multiplier, current_level);
  }

  public getCurrentIncome(): number {
    return this.base_exp * Math.pow(this.multiplier, this.getCurrentLevel());
  }

  public getCurrentExpRate(): number {
    //prettier-ignore
    return this.base_exp_rate 
      + (this.base_exp_rate * (0.5 * this.getCurrentLevel()) 
      + (this.base_exp_rate * (0.1 * (this.getMaxLevelReached() + 1))))
  }

  public update(delta_t: number): void {
    const current_level = this.getCurrentLevel();
    if (current_level > 0) {
      const exp_per_second = this.getCurrentExpRate();
      const income_per_second = this.getCurrentIncome();
      let current_exp = this.getCurrentExp();
      current_exp += exp_per_second * delta_t;
      const exp_for_level = this.getTotalExpForLevel(this.base_exp, this.multiplier, current_level);
      if (current_exp > exp_for_level) {
        gameModelInstance.saveData.jobs[this.id].current_level = current_level + 1;
        current_exp -= exp_for_level;
        saveSaveGame(gameModelInstance.saveData);
      }
      gameModelInstance.saveData.jobs[this.id].current_exp = current_exp;
      gameModelInstance.addMoney(income_per_second * delta_t);
      updateGameModel();
    }
  }
}

//prettier-ignore
export const jobs = [
  new Job(
    1, 
    "Starter", 
    "Starting Job", 
    100, 
    1, 
    10, 
    1.1,
  ), 
  new Job(
    2, 
    "Starter2", 
    "Starting Job", 
    1000, 
    10, 
    10, 
    2.0
  )
];
