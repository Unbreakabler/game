import { toggle_class } from "svelte/internal";
import { gameModel, GameModel } from "../../../../gamelogic/gamemodel";
import type { TowerInfo } from "../../../../gamelogic/td/tower_defense";
import type TD from "../../../td"
import type Enemy from "../../enemies/enemy";
import type Bullet from "../../tower_bullet";
import type Tower from "../tower"
import Projectile from "./projectile";


// Should this be passed down from td.ts instead?
let gameModelInstance: GameModel;
gameModel.subscribe((m) => (gameModelInstance = m));

function damageEnemy(enemy: Enemy, bullet: Projectile): void {
  if (enemy.active && bullet.active && bullet.last_enemy_hit !== enemy && enemy.targettable) {
    const bullet_damage = bullet.hit(enemy);
    if (!bullet_damage) return;

    bullet.last_enemy_hit = enemy;

    const still_alive = enemy.receiveDamage(bullet_damage);
    if (!still_alive) {
      gameModelInstance.tower_defense.recordTowerKill(bullet.tower_id, enemy.name)
    }
    gameModelInstance.tower_defense.recordTowerDamage(bullet.tower_id, bullet_damage)
  }
}

export default (tower_info: TowerInfo) => {
  return {
    type: 'projectile_handler',
    onInit: (parent: Tower, td_scene: TD, x: number, y:number) => {
      parent.projectiles = td_scene.physics.add.group({
        classType: Projectile,
        frameQuantity: 100,
        active: false,
        visible: false, 
        key: 'small_bullet',
        setXY: { x: -100, y: -100 },
      })

      td_scene.physics.add.overlap(td_scene.wave_manager.enemies, parent.projectiles, damageEnemy as ArcadePhysicsCallback);
      
    },
    onUpdate: (parent: Tower, time: number, delta: number) => {
      parent.time_elapsed += delta;
      if (parent.time_elapsed > parent.time_to_fire_next_shot) {
        if (parent.target) {
          const b: Projectile = parent.projectiles?.get(parent.x, parent.y, 'small_bullet', parent.tower_info.status.projectile_type);
          // Extra properties read back from bullet
          b.fire(parent, parent.tower_info.status.projectile_type);
          parent.time_to_fire_next_shot = parent.time_elapsed + parent.tower_info.attributes.attack_speed;
        }
      }
    },
  }
}