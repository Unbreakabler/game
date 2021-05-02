import type { TargetingMode } from "../../../../gamelogic/td/tower_defense";
import type TD from "../../../td"
import type Enemy from "../../enemies/enemy";
import type Tower from "../tower"

export function findFirstEnemyInRange(parent: Tower, td_scene: TD, range: number = 0, ignore_list: Enemy[] = []): Enemy | undefined {
  const enemies = td_scene.wave_manager.enemies;
  let first_enemy: Enemy | undefined;
  let first_distance = Number.MIN_VALUE;
  for (const e of enemies.getMatching('targettable', true)) {
    if (ignore_list.indexOf(e) !== -1) continue;
    const d = Phaser.Math.Distance.Between(parent.x, parent.y, e.x, e.y);
    if (d < range) {
      if (e.follower.t > first_distance) {
        first_distance = e.follower.t;
        first_enemy = e;
      }
    }
  }
  return first_enemy;
}

export function findClosestEnemyInRange(parent: Tower, td_scene: TD, range: number = 0, ignore_list: Enemy[] = []): Enemy | undefined {
  const enemies = td_scene.wave_manager.enemies;
  let closest_enemy: Enemy | undefined;
  let closest_distance = Number.MAX_VALUE;
  for (const e of enemies.getMatching('targettable', true)) {
    if (ignore_list.indexOf(e) !== -1) continue;
    const d = Phaser.Math.Distance.Squared(parent.x, parent.y, e.x, e.y);
    if (d < (range) * (range)) {
      if (d < closest_distance) {
        closest_distance = d;
        closest_enemy = e;
      }
    }
  }
  return closest_enemy;
}

export function findLastEnemyInRange(parent: Tower, td_scene: TD, range: number = 0, ignore_list: Enemy[] = []): Enemy | undefined {
  const enemies = td_scene.wave_manager.enemies;
  let furthest_enemy: Enemy | undefined;
  let furthest_distance = Number.MAX_VALUE;
  for (const e of enemies.getMatching('targettable', true)) {
    if (ignore_list.indexOf(e) !== -1) continue;
    const d = Phaser.Math.Distance.Between(parent.x, parent.y, e.x, e.y);
    if (d < range) {
      if (e.follower.t < furthest_distance) {
        furthest_distance = e.follower.t;
        furthest_enemy = e;
      }
    }
  }
  return furthest_enemy;
}

export function findStrongestEnemyInRange(parent: Tower, td_scene: TD, range: number = 0, ignore_list: Enemy[] = []): Enemy | undefined {
  const enemies = td_scene.wave_manager.enemies;
  let strongest_enemy: Enemy | undefined;
  let heightest_hp = Number.MIN_VALUE;
  for (const e of enemies.getMatching('targettable', true)) {
    if (ignore_list.indexOf(e) !== -1) continue;
    const d = Phaser.Math.Distance.Between(parent.x, parent.y, e.x, e.y);
    if (d < range) {
      if (e.health_points > heightest_hp) {
        heightest_hp = e.health_points;
        strongest_enemy = e;
      }
    }
  }
  return strongest_enemy;
}

export default (target_types: TargetingMode[] = ['first', 'last', 'closest', 'strongest']) => {
  return {
    type: 'target_handler',
    onUpdate: (parent: Tower, time: number, delta: number) => {
      let e;
      if (parent.targeting_mode === 'first') e = findFirstEnemyInRange(parent, parent.td_scene, parent.range);
      if (parent.targeting_mode === 'closest') e = findClosestEnemyInRange(parent, parent.td_scene, parent.range);
      if (parent.targeting_mode === 'last') e = findLastEnemyInRange(parent, parent.td_scene, parent.range);
      if (parent.targeting_mode === 'strongest') e = findStrongestEnemyInRange(parent, parent.td_scene, parent.range);
      parent.target_angle = Phaser.Math.Angle.Between(parent.x, parent.y, e?.x || parent.target?.x || 0, e?.y || parent.target?.y || 0);
      parent.target = e;
    }
  }
}