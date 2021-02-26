import { classToClass, plainToClassFromExist, TransformFnParams } from "class-transformer";
import { FarmJob } from "./farmjob";

export enum FARM_JOB {
  empty_zero,
  poopshoveler,
  apprenticefarmhand,
  farmhand,
  farmer,
  farmboss,
}

const pre = "farmjob";

const arr: FarmJob[] = [
  new FarmJob(FARM_JOB.poopshoveler, [], "Poop Shoveler", "Someone has to do it.", 1),
  new FarmJob(
    FARM_JOB.apprenticefarmhand,
    [{ achievable_name: `${pre}_${FARM_JOB.poopshoveler}`, level_required: 10 }],
    "Apprentice Farmhand",
    "Just learning the ropes.",
    2,
  ),
  new FarmJob(FARM_JOB.farmhand, [{ achievable_name: `${pre}_${FARM_JOB.apprenticefarmhand}`, level_required: 20 }], "Farmhand", "", 3),
  new FarmJob(FARM_JOB.farmer, [{ achievable_name: `${pre}_${FARM_JOB.farmhand}`, level_required: 50 }], "Farmer", "", 4),
  new FarmJob(FARM_JOB.farmboss, [{ achievable_name: `${pre}_${FARM_JOB.farmer}`, level_required: 100 }], "Farm Boss", "", 5),
];

export const get_default_farm_jobs = (): Map<string, FarmJob> => {
  return arr.reduce(function (map, obj) {
    map.set(obj.getAchievableName(), classToClass(obj, { ignoreDecorators: true }));
    return map;
  }, new Map<string, FarmJob>());
};

export function farmJobTransformer(param: TransformFnParams): Map<string, FarmJob> {
  const map = new Map(Object.entries(param.obj.farm_jobs));
  for (const [name, farm_job] of map.entries()) {
    const default_farm_job = get_default_farm_jobs().get(name);
    if (!default_farm_job) throw new Error(`Corrupt Save. FarmJob ${name} is invalid.`);
    map.set(name, plainToClassFromExist(default_farm_job, farm_job));
  }
  return map as Map<string, FarmJob>;
}
