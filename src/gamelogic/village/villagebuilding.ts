import { Expose } from "class-transformer";
import { Achievable, Requirement } from "./achievable";
import type { Upgrade, VILLAGE_BUILDING } from "./villagebuildings";
import { Wallet } from "../gamemodel";
import { formatNumber } from "../util/utils";

export class VillageBuilding extends Achievable {
  public display_name: string;
  public description: string;
  public upgrades: Upgrade[];

  @Expose()
  public active: boolean = false;
  @Expose()
  public current_build_time: number = 0;
  @Expose()
  public is_upgrading: boolean = false;

  public constructor(short_name: VILLAGE_BUILDING, upgrades: Upgrade[], display_name: string, description: string) {
    super(short_name);
    this.upgrades = upgrades;
    this.display_name = display_name;
    this.description = description;
  }

  public getDisplayName(): string {
    return this.display_name;
  }

  public upgrade(wallet: Wallet): boolean {
    const next_upgrade = this.getNextUpgrade();

    if (wallet.money >= next_upgrade.money_cost) {
      wallet.money -= next_upgrade.money_cost;
      this.level++;
      return true;
    }
    return false;
  }

  public getNextUpgrade(): Upgrade {
    return this.upgrades[this.level];
  }

  public getUpgradeMoneyCost(): string {
    return formatNumber(this.getNextUpgrade().money_cost, 0);
  }
}
