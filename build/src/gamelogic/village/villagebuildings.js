import { classToClass, plainToClassFromExist } from '../../../node_modules/class-transformer/esm5/index.js';
import { VillageBuilding } from './villagebuilding.js';

var VILLAGE_BUILDING;
(function (VILLAGE_BUILDING) {
    VILLAGE_BUILDING["village"] = "village";
    VILLAGE_BUILDING["farm"] = "farm";
    VILLAGE_BUILDING["mine"] = "mine";
    VILLAGE_BUILDING["workshop"] = "workshop";
    VILLAGE_BUILDING["blacksmith"] = "blacksmith";
    VILLAGE_BUILDING["laboratory"] = "laboratory";
})(VILLAGE_BUILDING || (VILLAGE_BUILDING = {}));
const pre = "villagebuilding";
const farm_name = `${pre}_${VILLAGE_BUILDING.farm}`;
`${pre}_${VILLAGE_BUILDING.mine}`;
const workshop_name = `${pre}_${VILLAGE_BUILDING.workshop}`;
`${pre}_${VILLAGE_BUILDING.blacksmith}`;
`${pre}_${VILLAGE_BUILDING.laboratory}`;
const farm_upgrades = [
    { build_time: 10, money_cost: 0 },
    { build_time: 60, money_cost: 1000, requirement: { achievable_name: farm_name, level_required: 1 } },
    { build_time: 120, money_cost: 10000, requirement: { achievable_name: farm_name, level_required: 2 } },
];
const mine_upgrades = [
    { build_time: 0, money_cost: 0, requirement: { achievable_name: farm_name, level_required: 0 } },
];
const workshop_upgrades = [
    { build_time: 120, money_cost: 10000, requirement: { achievable_name: farm_name, level_required: 2 } },
];
const blacksmith_upgrades = [
    { build_time: 120, money_cost: 100000, requirement: { achievable_name: workshop_name, level_required: 2 } },
];
const laboratory_upgrades = [
    { build_time: 600, money_cost: 1000000, requirement: { achievable_name: workshop_name, level_required: 2 } },
];
const arr = [
    new VillageBuilding(VILLAGE_BUILDING.farm, farm_upgrades, "Farm", "Work here to make some money."),
    new VillageBuilding(VILLAGE_BUILDING.mine, mine_upgrades, "Mine", "Mine resources here."),
    new VillageBuilding(VILLAGE_BUILDING.workshop, workshop_upgrades, "Workshop", "Construct towers."),
    new VillageBuilding(VILLAGE_BUILDING.blacksmith, blacksmith_upgrades, "Blacksmith", "Craft tower items and equipment"),
    new VillageBuilding(VILLAGE_BUILDING.laboratory, laboratory_upgrades, "Laboratory", "Empower creeps for bonus rewards"),
];
const get_default_village_buildings = () => {
    return arr.reduce(function (map, obj) {
        map.set(obj.getAchievableName(), classToClass(obj, { ignoreDecorators: true }));
        return map;
    }, new Map());
};
function villageBuildingTransformer(param) {
    const map = new Map(Object.entries(param.obj.village_buildings));
    for (const [name, village_building] of map.entries()) {
        const default_village_buiding = get_default_village_buildings().get(name);
        if (!default_village_buiding)
            throw new Error(`Corrupt Save. Village Building ${name} is invalid.`);
        map.set(name, plainToClassFromExist(default_village_buiding, village_building));
    }
    return map;
}

export { VILLAGE_BUILDING, get_default_village_buildings, villageBuildingTransformer };
//# sourceMappingURL=villagebuildings.js.map
