import { classToClass, plainToClassFromExist, TransformFnParams } from "class-transformer";
import type { Requirement } from "./achievable";
import { VillageBuilding } from "./villagebuilding";

export enum VILLAGE_BUILDING {
  village = "village",
  farm = "farm",
  workshop = "workshop",
  blacksmith = "blacksmith",
  laboratory = "laboratory",
  mine = "mine",
}

export interface Upgrade {
  requirement?: Requirement;
  money_cost: number;
  build_time: number;
}

const pre = "villagebuilding";
const farm_name = `${pre}_${VILLAGE_BUILDING.farm}`;
const workshop_name = `${pre}_${VILLAGE_BUILDING.workshop}`;
const blacksmith_name = `${pre}_${VILLAGE_BUILDING.blacksmith}`;
const laboratory_name = `${pre}_${VILLAGE_BUILDING.laboratory}`;
const mine_name = `${pre}_${VILLAGE_BUILDING.mine}`;

const farm_upgrades: Upgrade[] = [
  { build_time: 10, money_cost: 0 },
  { build_time: 60, money_cost: 1_000, requirement: { achievable_name: farm_name, level_required: 1 } },
  { build_time: 120, money_cost: 10_000, requirement: { achievable_name: farm_name, level_required: 2 } },
];

const mine_upgrades: Upgrade[] = [
  { build_time: 10, money_cost: 1_000, requirement: { achievable_name: farm_name, level_required: 1 } },
  { build_time: 60, money_cost: 10_000, requirement: { achievable_name: farm_name, level_required: 2 } },
  { build_time: 120, money_cost: 100_000, requirement: { achievable_name: farm_name, level_required: 3 } },
];

const workshop_upgrades: Upgrade[] = [
  { build_time: 120, money_cost: 10_000, requirement: { achievable_name: farm_name, level_required: 2 } },
];

const blacksmith_upgrades: Upgrade[] = [
  { build_time: 120, money_cost: 100_000, requirement: { achievable_name: workshop_name, level_required: 2 } },
];

const laboratory_upgrades: Upgrade[] = [
  { build_time: 600, money_cost: 1_000_000, requirement: { achievable_name: workshop_name, level_required: 2 } },
];

const arr: VillageBuilding[] = [
  new VillageBuilding(VILLAGE_BUILDING.farm, farm_upgrades, "Farm", "Work here to make some money."),
  new VillageBuilding(VILLAGE_BUILDING.workshop, workshop_upgrades, "Workshop", "Construct towers."),
  new VillageBuilding(VILLAGE_BUILDING.blacksmith, blacksmith_upgrades, "Blacksmith", "Craft tower items and equipment"),
  new VillageBuilding(VILLAGE_BUILDING.laboratory, laboratory_upgrades, "Laboratory", "Empower creeps for bonus rewards"),
];

export const get_default_village_buildings = (): Map<string, VillageBuilding> => {
  return arr.reduce(function (map, obj) {
    map.set(obj.getAchievableName(), classToClass(obj, { ignoreDecorators: true }));
    return map;
  }, new Map());
};

export function villageBuildingTransformer(param: TransformFnParams): Map<string, VillageBuilding> {
  const map = new Map(Object.entries(param.obj.village_buildings));
  for (const [name, village_building] of map.entries()) {
    const default_village_buiding = get_default_village_buildings().get(name);
    if (!default_village_buiding) throw new Error(`Corrupt Save. Village Building ${name} is invalid.`);
    map.set(name, plainToClassFromExist(default_village_buiding, village_building));
  }
  return map as Map<string, VillageBuilding>;
}
