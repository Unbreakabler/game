import { deserialize, Exclude, serialize, Transform, Type } from "class-transformer";
import { writable } from "svelte/store";
import type { IIndexable } from "./td/stats_tower_modifiers";
import { TowerDefense } from "./td/tower_defense";
import type { Achievable, ValidAchievableShortName } from "./village/achievable";
import { FarmJob } from "./village/farmjob";
import { farmJobTransformer, get_default_farm_jobs } from "./village/farmjobs";
import { Mine } from "./village/mine";
import { get_default_mines, MINE, MineTransformer } from "./village/mines";
import { VillageBuilding } from "./village/villagebuilding";
import { get_default_village_buildings, villageBuildingTransformer } from "./village/villagebuildings";

export class Wallet {
  public money: number = 10;
  public constructor() {
    this.money = 10;
  }
}

export class Resources {
  public dirt: integer = 0;
  public stone: integer = 0;
}

/**
 * This class holds the data the game needs to function.
 * It will be accessible from anywhere in the game using svelte stores.
 */
export class GameModel {
  public last_saved: number;

  @Type(() => Wallet)
  public wallet: Wallet;

  @Type(() => Resources)
  public resources: Resources;

  @Type(() => FarmJob)
  @Transform(farmJobTransformer, { toClassOnly: true })
  public farm_jobs: Map<string, FarmJob> = new Map();

  @Type(() => VillageBuilding)
  @Transform(villageBuildingTransformer, { toClassOnly: true })
  public village_buildings: Map<string, VillageBuilding> = new Map();

  @Type(() => Mine)
  @Transform(MineTransformer, { toClassOnly: true })
  public mines: Map<string, Mine> = new Map();

  @Exclude()
  public achievables: Map<string, Achievable> = new Map();
  
  @Type(() => TowerDefense)
  public tower_defense: TowerDefense;

  public constructor() {
    //Create new empty GameModel
    this.last_saved = Date.now();
    this.wallet = new Wallet();
    this.resources = new Resources();
    this.farm_jobs = get_default_farm_jobs();
    this.village_buildings = get_default_village_buildings();
    this.mines = get_default_mines();
    this.tower_defense = new TowerDefense();
    this.reloadAchievables();
  }

  public reloadAchievables(): void {
    this.achievables = new Map([...this.farm_jobs as Map<string, Achievable>, ...this.mines as Map<string, Achievable>]);
  }

  public update(delta_t_s: number): void {
    const delta_t_ms = delta_t_s * 1000
    for (const [key, farm_job] of this.farm_jobs.entries()) {
      farm_job.update(delta_t_s);
      farm_job.earnIncome(this.wallet, delta_t_s);
    }
    for (const [key, mine] of this.mines.entries()) {
      mine.update(this.resources, delta_t_ms);
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

  public activateMine(achievable_name: MINE): void {
    const mine = this.mines.get(achievable_name)
    if (!mine) throw new Error(`Missing mine ${achievable_name}`)
    // TODO(jon): This needs to handle purchasing the mine initially
    mine.active = true;
  }

  public levelMine(achievable_name: MINE): void {
    const mine = this.mines.get(achievable_name)
    if (!mine) throw new Error(`Missing mine ${achievable_name}`)

    mine.requestLevelUp(this.wallet);
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
