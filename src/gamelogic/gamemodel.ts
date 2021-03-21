import { deserialize, Exclude, serialize, Transform, Type } from "class-transformer";
import { writable } from "svelte/store";
import { TowerDefense } from "./td/tower_defense";
import type { Achievable } from "./village/achievable";
import { FarmJob } from "./village/farmjob";
import { farmJobTransformer, get_default_farm_jobs } from "./village/farmjobs";
import { VillageBuilding } from "./village/villagebuilding";
import { get_default_village_buildings, villageBuildingTransformer } from "./village/villagebuildings";

export class Wallet {
  public money: number = 10_000;
  public constructor() {
    this.money = 10_000;
  }
}

/**
 * This class holds the data the game needs to function.
 * It will be accessible from anywhere in the game using svelte stores.
 */
export class GameModel {
  public last_saved: number;

  @Type(() => Wallet)
  public wallet: Wallet;

  @Type(() => FarmJob)
  @Transform(farmJobTransformer, { toClassOnly: true })
  public farm_jobs: Map<string, FarmJob> = new Map();

  @Type(() => VillageBuilding)
  @Transform(villageBuildingTransformer, { toClassOnly: true })
  public village_buildings: Map<string, VillageBuilding> = new Map();

  @Exclude()
  public achievables: Map<string, Achievable> = new Map();
  
  @Type(() => TowerDefense)
  public tower_defense: TowerDefense;

  public constructor() {
    //Create new empty GameModel
    this.last_saved = Date.now();
    this.wallet = new Wallet();
    this.farm_jobs = get_default_farm_jobs();
    this.village_buildings = get_default_village_buildings();
    this.tower_defense = new TowerDefense();
    this.reloadAchievables();
  }

  public reloadAchievables(): void {
    this.achievables = new Map([...this.farm_jobs]);
  }

  public update(delta_t_s: number): void {
    for (const [key, farm_job] of this.farm_jobs.entries()) {
      farm_job.update(delta_t_s);
      farm_job.earnIncome(this.wallet, delta_t_s);
    }
  }

  public exportToSave(): string {
    this.last_saved = Date.now();
    console.log('saving', this)
    return serialize(this);
  }

  public static loadFromSave(data: string): GameModel {
    const model = deserialize(GameModel, data);
    model.reloadAchievables();
    return model;
  }

  public setActiveFarmJob(achievable_name: string): void {
    for (const [key, farm_job] of this.farm_jobs.entries()) {
      farm_job.active = false;
    }
    const job = this.farm_jobs.get(achievable_name);
    if (!job) throw new Error(`Missing FarmJob ${achievable_name}`);
    job.active = true;
  }
}

/**
 * A writable store of the gameModel that can be accessed from other parts of the application.
 */
export const gameModel = writable(new GameModel());

/**
 * A function that can be called anywhere to update the game model in the svelte store.
 * This will trigger the svelte components to re-evaluate and update their content.
 */
export function updateGameModel(): void {
  gameModel.update((m) => (m = m));
}
