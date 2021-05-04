import { gameModel } from "../gamelogic/gamemodel";
import ENEMY_BASE_STATS, { applyEnemyModifiers } from "../gamelogic/td/stats_base_enemies";
import type { EnemyWave } from "../gamelogic/td/enemy_wave_generator";
import type { TowerDefense } from "../gamelogic/td/tower_defense";
import Enemy from "./entities/enemies/enemy";
import type { Path } from "./entities/path";
import type TD from "./td";

export class WaveManager {
  private td_scene: TD;
  private path: Path;
  private tower_defense_state!: TowerDefense;
  private delta_to_next_enemy: number = 0;
  private current_wave!: EnemyWave;
  
  public enemies!: BetterGroup<Enemy>;

  constructor(scene: TD, path: Path) {
    this.td_scene = scene;
    this.path = path;
    this.enemies = this.td_scene.add.group({ classType: Enemy }) as BetterGroup<Enemy>;
    this.setupWaveSubscription()
  }

  private setupWaveSubscription() {
    const unsubscribe_store = gameModel.subscribe((model) => {
      if (model.tower_defense !== this.tower_defense_state) this.tower_defense_state = model.tower_defense
    })
    this.td_scene.events.on("destroy", function () {
      unsubscribe_store(); // TODO(jon) should this be done in preDestroy instead?
    }); 
  }

  public update(time: number, delta: number): void {
    if (!this.tower_defense_state.first_tower_is_placed) return
    for (const enemy of this.enemies.getChildren()) {
      enemy.update(time, delta);
    }
    if (this.current_wave && (this.tower_defense_state.current_wave_info.spawned < this.tower_defense_state.current_wave_info.total)) {
      this.spawnEnemy(time, delta);
    } else if (this.tower_defense_state.current_wave_info.leaked > 0) {
      // Repeat failed waves. 
      // TODO(jon): Should show an indicator that the wave is repeating.
      this.tower_defense_state.current_wave_info.leaked = 0;
      this.spawnWave(time, delta, false)
    } else {
      this.spawnWave(time, delta);
    }
  }

  private spawnEnemy(time: number, delta: number) { 
    this.delta_to_next_enemy -= delta;
    if (this.delta_to_next_enemy > 0) return;

    const enemy = this.enemies.get() as Enemy;
    enemy.setEnemyName(this.current_wave.enemy_type);

    // Set enemy stats/sprite
    const enemy_stats = ENEMY_BASE_STATS[this.current_wave.enemy_type]
    const modified_status = applyEnemyModifiers(enemy_stats, this.current_wave.modifier_ids)
    enemy.setSpeed(modified_status?.speed);
    enemy.setHealthPoints(modified_status?.health_points)
    enemy.setExperience(modified_status?.experience);
    enemy.setValue(modified_status?.money);
    
    // Set difficulty per mob, we can show this number when selecting the mobs.
    enemy.setDifficulty(this.current_wave.mob_difficulty)
    // Set modifiers (width/height changes, colour changes, auras, effects, etc)
    enemy.setModifiers(this.current_wave.modifier_ids)
    enemy.startOnPath(this.path);
    
    this.tower_defense_state.current_wave_info.spawned++;
    this.tower_defense_state.current_wave_info.alive++;

    this.delta_to_next_enemy = this.current_wave.enemy_spawn_delta;
  }

  private spawnWave(time: number, delta: number, next: boolean = true) {
    if (this.current_wave && (this.tower_defense_state.current_wave_info.spawned < this.tower_defense_state.current_wave_info.total || this.tower_defense_state.current_wave_info.alive)) return
    
    if (next) this.tower_defense_state.spawnNextWave();
    this.current_wave = this.tower_defense_state.getCurrentWave();
    this.tower_defense_state.current_wave_info.total = this.current_wave.mob_count;
    this.tower_defense_state.current_wave_info.spawned = 0;
    this.tower_defense_state.current_wave_info.alive = 0;
  }

  public recordEnemyLeak() {
    this.tower_defense_state.current_wave_info.alive--;
    this.tower_defense_state.current_wave_info.leaked++;
  }
}