import { gameModel } from "../gamelogic/gamemodel";
import enemy_base_stats from "../gamelogic/td/stats_base_enemies";
import type { EnemyWave } from "../gamelogic/td/enemy_wave_generator";
import type { TowerDefense } from "../gamelogic/td/tower_defense";
import Enemy from "./entities/enemies/enemy";
import GreenKnight from "./entities/enemies/green_knight";
import type { Path } from "./entities/path";
import type TD from "./td";

interface WaveInfo {
  total: number,
  spawned: number,
  alive: number,
}

export class WaveManager {
  private td_scene: TD;
  private path: Path;
  private tower_defense_state!: TowerDefense;
  private delta_to_next_enemy: number = 0;
  private current_wave!: EnemyWave;
  
  // public wave_info: WaveInfo = { total: 0, spawned: 0, alive: 0 };
  public enemies!: BetterGroup<Enemy>;

  constructor(scene: TD, path: Path) {
    this.td_scene = scene;
    this.path = path;
    // TODO(jon): When using Enemy as classType "speed" is not set as the consutructor is not called ???
    this.enemies = this.td_scene.add.group({ classType: Enemy, runChildUpdate: true }) as BetterGroup<Enemy>;
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
    // If it's been X time since last spawn, spawn a new enemy
    // If there are no enemies remaining from the previously spawn wave, start the next wave.
    // If there are less then 10 waves avaiable, create a new wave.
    // When a new wave is created, difficulty should be automatically incremented.

    if (this.current_wave && (this.tower_defense_state.current_wave_info.spawned < this.tower_defense_state.current_wave_info.total)) {
      this.spawnEnemy(time, delta);
    } else {
      this.spawnWave(time, delta);
    }
  }

  private spawnEnemy(time: number, delta: number) { 
    this.delta_to_next_enemy -= delta;
    if (this.delta_to_next_enemy > 0) return;

    const enemy = this.enemies.get() as Enemy;
    enemy.setName(this.current_wave.enemy_type);

    // TODO(jon): Set enemy stats/sprite - need to create a library/map of enemy type ids to their base stats
    const stats = enemy_base_stats[this.current_wave.enemy_type]
    enemy.setSpeed(stats?.speed);
    enemy.setHealthPoints(stats?.health_points)
    // if (stats) {
    // }
    
    // Set difficulty per mob, we can show this number when selecting the mobs.
    enemy.setDifficulty(this.current_wave.mob_difficulty)
    // TODO(jon): Set modifiers (width/height changes, colour changes, auras, effects, etc)
    enemy.setModifiers(this.current_wave.modifier_ids)
    enemy.startOnPath(this.path);
    
    this.tower_defense_state.current_wave_info.spawned++;
    this.tower_defense_state.current_wave_info.alive++;

    console.log('this.current_wave.enemy_spawn_delta', this.current_wave.enemy_spawn_delta)
    this.delta_to_next_enemy = this.current_wave.enemy_spawn_delta;
  }

  private spawnWave(time: number, delta: number) {
    if (this.current_wave && (this.tower_defense_state.current_wave_info.spawned < this.tower_defense_state.current_wave_info.total || this.tower_defense_state.current_wave_info.alive)) return
    
    this.tower_defense_state.spawnNextWave();
    this.current_wave = this.tower_defense_state.getCurrentWave();
    this.tower_defense_state.current_wave_info.total = this.current_wave.mob_count;
    this.tower_defense_state.current_wave_info.spawned = 0;
    this.tower_defense_state.current_wave_info.alive = 0;
  }

  public recordEnemyLeak() {
    console.log("Enemy reached end.");
    this.tower_defense_state.current_wave_info.alive--;
  }
}