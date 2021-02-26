import { classToClass, plainToClassFromExist } from '../../../node_modules/class-transformer/esm5/index.js';
import { FarmJob } from './farmjob.js';

var FARM_JOB;
(function (FARM_JOB) {
    FARM_JOB[FARM_JOB["empty_zero"] = 0] = "empty_zero";
    FARM_JOB[FARM_JOB["poopshoveler"] = 1] = "poopshoveler";
    FARM_JOB[FARM_JOB["apprenticefarmhand"] = 2] = "apprenticefarmhand";
    FARM_JOB[FARM_JOB["farmhand"] = 3] = "farmhand";
    FARM_JOB[FARM_JOB["farmer"] = 4] = "farmer";
    FARM_JOB[FARM_JOB["farmboss"] = 5] = "farmboss";
})(FARM_JOB || (FARM_JOB = {}));
const pre = "farmjob";
const arr = [
    new FarmJob(FARM_JOB.poopshoveler, [], "Poop Shoveler", "Someone has to do it.", 1),
    new FarmJob(FARM_JOB.apprenticefarmhand, [{ achievable_name: `${pre}_${FARM_JOB.poopshoveler}`, level_required: 10 }], "Apprentice Farmhand", "Just learning the ropes.", 2),
    new FarmJob(FARM_JOB.farmhand, [{ achievable_name: `${pre}_${FARM_JOB.apprenticefarmhand}`, level_required: 20 }], "Farmhand", "", 3),
    new FarmJob(FARM_JOB.farmer, [{ achievable_name: `${pre}_${FARM_JOB.farmhand}`, level_required: 50 }], "Farmer", "", 4),
    new FarmJob(FARM_JOB.farmboss, [{ achievable_name: `${pre}_${FARM_JOB.farmer}`, level_required: 100 }], "Farm Boss", "", 5),
];
const get_default_farm_jobs = () => {
    return arr.reduce(function (map, obj) {
        map.set(obj.getAchievableName(), classToClass(obj, { ignoreDecorators: true }));
        return map;
    }, new Map());
};
function farmJobTransformer(param) {
    const map = new Map(Object.entries(param.obj.farm_jobs));
    for (const [name, farm_job] of map.entries()) {
        const default_farm_job = get_default_farm_jobs().get(name);
        if (!default_farm_job)
            throw new Error(`Corrupt Save. FarmJob ${name} is invalid.`);
        map.set(name, plainToClassFromExist(default_farm_job, farm_job));
    }
    return map;
}

export { FARM_JOB, farmJobTransformer, get_default_farm_jobs };
//# sourceMappingURL=farmjobs.js.map
