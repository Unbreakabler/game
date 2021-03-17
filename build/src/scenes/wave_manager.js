import { gameModel } from '../gamelogic/gamemodel.js';
import Enemy from './entities/enemies/enemy.js';

class WaveManager {
    constructor(scene, path) {
        this.delta_to_next_enemy = 0;
        this.td_scene = scene;
        this.path = path;
        // TODO(jon): When using Enemy as classType "speed" is not set as the consutructor is not called ???
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
        // If it's been X time since last spawn, spawn a new enemy
        // If there are no enemies remaining from the previously spawn wave, start the next wave.
        // If there are less then 10 waves avaiable, create a new wave.
        // When a new wave is created, difficulty should be automatically incremented.
        if (this.tower_defense_state.current_wave_info.spawned < this.tower_defense_state.current_wave_info.total) {
            this.spawnEnemy(time, delta);
        }
        else {
            this.spawnWave(time, delta);
        }
    }
    spawnEnemy(time, delta) {
        this.delta_to_next_enemy -= delta;
        if (!this.current_wave || this.delta_to_next_enemy > 0)
            return;
        const enemy = this.enemies.get();
        // enemy.sprite_name = this.current_wave.enemy_type;
        // enemy.name = enemy.sprite_name;
        enemy.setName(this.current_wave.enemy_type);
        enemy.setSpeed(0.1);
        console.log('enemy??', enemy);
        enemy.startOnPath(this.path);
        this.tower_defense_state.current_wave_info.spawned++;
        this.tower_defense_state.current_wave_info.alive++;
        // TODO(jon): Set enemy stats/sprite - need to create a library/map of enemy type ids to their base stats
        // TODO(jon): Set modifiers (width/height changes, colour changes, auras, effects, etc)
        this.delta_to_next_enemy = this.current_wave.enemy_spawn_delta;
    }
    spawnWave(time, delta) {
        if (this.tower_defense_state.current_wave_info.spawned < this.tower_defense_state.current_wave_info.total || this.tower_defense_state.current_wave_info.alive)
            return;
        this.current_wave = this.tower_defense_state.getWave();
        this.tower_defense_state.current_wave_info.total = this.current_wave.mob_count;
        this.tower_defense_state.current_wave_info.spawned = 0;
        this.tower_defense_state.current_wave_info.alive = 0;
    }
}

export { WaveManager };
//# sourceMappingURL=wave_manager.js.map
