import { Exclude, Expose } from "class-transformer";
import type { FARM_JOB } from "./farmjobs";
import type { MINE } from "./mines";
import type { VILLAGE_BUILDING } from "./villagebuildings";

export interface Requirement {
  achievable_name: string;
  level_required: number;
}

export type ValidAchievableShortName = FARM_JOB | VILLAGE_BUILDING | MINE;

/**
 * Achievables would be Jobs, Skills, Talents that have or are
 * a requirement before being unlocked
 **/

export abstract class Achievable {
  @Expose() public short_name: ValidAchievableShortName;
  @Expose() public level: number = 0;
  //TODO: what  do we want to track to help with achievments??
  //  money earned? etc.
  // do we need to track per prestige level reset
  //public amount_earned: number = 0;
  @Exclude() public requirements: Requirement[] = [];

  protected constructor(short_name: ValidAchievableShortName, requirements: Requirement[] = [], level: number = 0) {
    this.short_name = short_name;
    this.requirements = requirements;
    this.level = level;
  }

  /**
   * Returns name in the form classname_shortname lowercase
   */
  public getAchievableName(): string {
    return `${this.constructor.name}_${this.short_name}`.toLowerCase();
  }

  public abstract getDisplayName(): string;

  public isAcquired(): boolean {
    return this.level >= 1;
  }
  public areRequirementsMet(global_achievables: Map<string, Achievable>): boolean {
    for (const requirement of this.requirements) {
      const a = global_achievables.get(requirement.achievable_name);
      if (!a) throw new Error(`Missing achievable ${requirement.achievable_name}`);
      if (!a.isAcquired()) return false;
      if (a.level < requirement.level_required) return false;
    }
    return true;
  }
}
