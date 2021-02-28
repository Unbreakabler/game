import { Exclude, Expose } from "class-transformer";
import type { Wallet } from "../gamemodel";
import { formatNumber } from "../util/utils";
import { Achievable } from "./achievable";
import type { Upgrade, VILLAGE_BUILDING } from "./villagebuildings";
import { Wallet } from "../gamemodel";

export class VillageBuilding extends Achievable {
  @Exclude() public display_name: string;
  @Exclude() public description: string;
  @Exclude() public upgrades: Upgrade[];

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
    if (!next_upgrade) return false;
    if (wallet.money >= next_upgrade.money_cost) {
      wallet.money -= next_upgrade.money_cost;
      this.level++;
      return true;
    }
    return false;
  }

  public canAffordNextUpgrade(wallet: Wallet): boolean {
    const next = this.getNextUpgrade();
    if (!next) return false;
    return wallet.money >= next.money_cost;
  }

  public getNextUpgrade(): Upgrade | undefined {
    if (this.level > this.upgrades.length) return undefined;
    return this.upgrades[this.level];
  }

  public getUpgradeMoneyCostAsString(): string {
    const next_upgrade = this.getNextUpgrade();
    if (!next_upgrade) return "Max Level Reached.";
    return formatNumber(next_upgrade.money_cost, 0);
  }
}
