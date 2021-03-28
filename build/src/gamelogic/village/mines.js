import { classToClass, plainToClassFromExist } from '../../../node_modules/class-transformer/esm5/index.js';
import { Mine } from './mine.js';

var MINE;
(function (MINE) {
    MINE["dirt"] = "dirt";
    MINE["stone"] = "stone";
})(MINE || (MINE = {}));
const pre = 'mine';
const mine_array = [
    new Mine(MINE.dirt, [], `${pre}_${MINE.dirt}`, "Your first mine! Gather resources to build towers and ammo"),
    new Mine(MINE.stone, [], `${pre}_${MINE.stone}`, "Stone")
];
const get_default_mines = () => {
    return mine_array.reduce((map, mine) => {
        map.set(mine.getAchievableName(), classToClass(mine, { ignoreDecorators: true }));
        return map;
    }, new Map());
};
function MineTransformer(param) {
    const map = new Map(Object.entries(param.obj.mines));
    for (const [name, mine] of map.entries()) {
        const default_mine = get_default_mines().get(name);
        if (!default_mine)
            throw new Error(`Corrupt Save. Mine ${name} is invalid`);
        map.set(name, plainToClassFromExist(default_mine, mine));
    }
    return map;
}

export { MINE, MineTransformer, get_default_mines };
//# sourceMappingURL=mines.js.map
