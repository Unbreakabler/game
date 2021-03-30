import { gameModel } from '../gamelogic/gamemodel.js';
import ENEMY_BASE_STATS from '../gamelogic/td/stats_base_enemies.js';
import Enemy from './entities/enemies/enemy.js';

class WaveManager {
    constructor(scene, path) {
        this.delta_to_next_enemy = 0;
        this.td_scene = scene;
        this.path = path;
        this.enemies = this.td_scene.add.group({ classType: Enemy, runChildUpdate: true });
        this.setupWaveSubscription();
    }
    setupWaveSubscription() {
        const unsubscribe_store = gameModel.subscribe((model) => {
            if (model.tower_defense !== this.tower_defense_state)
                this.tower_defense_state = model.tower_defense;
        });
        this.td_scene.events.on("destroy", function () {
            unsubscribe_store(); // TODO(jon) should this be done in preDestroy instead?
        });
    }
    update(time, delta) {
        if (this.current_wave && (this.tower_defense_state.current_wave_info.spawned < this.tower_defense_state.current_wave_info.total)) {
            this.spawnEnemy(time, delta);
        }
        else {
            this.spawnWave(time, delta);
        }
    }
    spawnEnemy(time, delta) {
        this.delta_to_next_enemy -= delta;
        if (this.delta_to_next_enemy > 0)
            return;
        const enemy = this.enemies.get();
        enemy.setName(this.current_wave.enemy_type);
        // Set enemy stats/sprite
        const stats = ENEMY_BASE_STATS[this.current_wave.enemy_type];
        enemy.setSpeed(stats?.speed);
        enemy.setHealthPoints(stats?.health_points);
        enemy.setExperience(stats?.experience);
        enemy.setValue(stats?.money);
        // Set difficulty per mob, we can show this number when selecting the mobs.
        enemy.setDifficulty(this.current_wave.mob_difficulty);
        // Set modifiers (width/height changes, colour changes, auras, effects, etc)
        enemy.setModifiers(this.current_wave.modifier_ids);
        enemy.startOnPath(this.path);
        this.tower_defense_state.current_wave_info.spawned++;
        this.tower_defense_state.current_wave_info.alive++;
        this.delta_to_next_enemy = this.current_wave.enemy_spawn_delta;
    }
    spawnWave(time, delta) {
        if (this.current_wave && (this.tower_defense_state.current_wave_info.spawned < this.tower_defense_state.current_wave_info.total || this.tower_defense_state.current_wave_info.alive))
            return;
        this.tower_defense_state.spawnNextWave();
        this.current_wave = this.tower_defense_state.getCurrentWave();
        this.tower_defense_state.current_wave_info.total = this.current_wave.mob_count;
        this.tower_defense_state.current_wave_info.spawned = 0;
        this.tower_defense_state.current_wave_info.alive = 0;
    }
    recordEnemyLeak() {
        console.log("Enemy reached end.");
        this.tower_defense_state.current_wave_info.alive--;
    }
}

export { WaveManager };
//# sourceMappingURL=wave_manager.js.map
