import { classToClass, plainToClassFromExist, TransformFnParams } from 'class-transformer';
import { Mine } from './mine'

export enum MINE {
  dirt = "dirt",
  stone = "stone",
}

const pre = 'mine'

const mine_array: Mine[] = [
  new Mine(MINE.dirt, [], `${pre}_${MINE.dirt}`, "Your first mine! Gather resources to build towers and ammo"),
  new Mine(MINE.stone, [], `${pre}_${MINE.stone}`, "Stone")
]

export const get_default_mines = (): Map<string, Mine> => {
  return mine_array.reduce((map, mine) => {
    map.set(mine.getAchievableName(), classToClass(mine, { ignoreDecorators: true}))
    return map;
  }, new Map<string, Mine>());
}

export function MineTransformer(param: TransformFnParams): Map<string, Mine> {
  const map = new Map(Object.entries(param.obj.mines));
  for (const [name, mine] of map.entries()) {
    const default_mine = get_default_mines().get(name);
    if (!default_mine) throw new Error(`Corrupt Save. Mine ${name} is invalid`)
    map.set(name, plainToClassFromExist(default_mine, mine))
  }
  return map as Map<string, Mine>;
}
