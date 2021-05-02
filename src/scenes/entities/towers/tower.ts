/**
 * Second attempt a writing a tower class. The goal of the rewrite is to add a component system to towers that can used for extension.
 * I also want an easier way to manage multiple sprites related to a single tower, and manage post processing effects on any set of those sprites.
 */

import type { TargetingMode, TowerId, TowerInfo } from "../../../gamelogic/td/tower_defense";
import type TD from "../../td";
import rotating_turret from "./components/tower_rotating_turret";
import tower_base from "./components/tower_base";
import type { TowerComponent } from "./components/component_interface";
import type Enemy from "../enemies/enemy";
import target_handler from "./components/target_handler";
import target_indicator from "./components/target_indicator";
import range_indicator from "./components/range_indicator";
import projectile_handler from "./components/projectile_handler";
import placement_handler from "./placement_handler";
import selection_handler from "./components/selection_handler";

type TowerSelection = 'selected' | 'hovered' | undefined;

export default class Tower extends Phaser.GameObjects.GameObject {
  public tower_id: TowerId;
  public tower_info: TowerInfo;
  public td_scene: TD;

  public is_placed: boolean = false;
  public is_placeable: boolean = true;
  
  public x: number;
  public y: number;

  public range: number;
  public range_indicator?: Phaser.GameObjects.Arc;
  
  public width?: number;
  public height?: number;

  public rotating_sprites?: Phaser.GameObjects.Container;
  public static_sprites?: Phaser.GameObjects.Container;
  public selection: TowerSelection;
  private components: TowerComponent[];

  public targeting_mode: TargetingMode = 'first'
  public target?: Enemy;
  public target_angle: number = 0;
  public targeting_indicator?: Phaser.GameObjects.Arc;
  private targeting_components: TowerComponent[];

  public projectiles?: BetterGroup<any>;

  public attack_speed: number = 100;

  public time_elapsed: number = 0;
  public time_to_fire_next_shot: number = 0;
  private projectile_components: TowerComponent[];
  private placement_components: TowerComponent[];

  public constructor(
    td_scene: TD,
    tower: TowerInfo,
    components = (tower: TowerInfo) => ([ tower_base(), rotating_turret(tower.status.type) ]),
    targeting_components = (tower: TowerInfo) => ([target_handler(tower), target_indicator()]),
    projectile_components = (tower: TowerInfo) => ([projectile_handler(tower)]),
    placement_components = (tower: TowerInfo) => ([placement_handler(), range_indicator(), selection_handler()]),
    range: number = 300,
  ) {
    super(td_scene, 'tower');
    td_scene.add.existing(this)
    this.td_scene = td_scene;
    this.x = tower.status.x;
    this.y = tower.status.y;
    this.range = range;

    
    // use tower_id to fetch attributes
    // calculate attributes with modifiers
    this.tower_id = tower.status.id;
    this.tower_info = tower;
    console.log("INITIALIZING TOWER", this.tower_info)
    
    // fetch linked components? For now components are hardcoded in td.ts
    this.components = components(this.tower_info);
    this.targeting_components = targeting_components(this.tower_info);
    this.projectile_components = projectile_components(this.tower_info);
    this.placement_components = placement_components(this.tower_info);

    // call component initializers
    this.components.forEach(c => {
      if (c.onInit) c.onInit(this, td_scene, this.x, this.y)
    })

    this.targeting_components.forEach(c => {
      if (c.onInit) c.onInit(this, td_scene, this.x, this.y)
    })

    this.projectile_components.forEach(c => {
      if (c.onInit) c.onInit(this, td_scene, this.x, this.y)
    })

    this.placement_components.forEach(c => {
      console.log('INIT PLACEMENT COMP')
      if (c.onInit) c.onInit(this, td_scene, this.x, this.y)
    })

    this.setVisible(false);
    this.targeting_indicator?.setVisible(false);
    this.selection = undefined;
  }

  public place(x: number, y: number) {
    this.x = x; 
    this.y = y;
    this.is_placed = true;
    this.is_placeable = false;
    this.setActive(true);
    this.setVisible(true);
    console.log('TOWER WAS PLACED AT', x, y, this.td_scene.game.input.activePointer)
  }

  public setVisible(flag: boolean = true) { 
    this.rotating_sprites?.setVisible(flag);
    this.static_sprites?.setVisible(flag); 
    this.range_indicator?.setVisible(flag);
  }

  public setPosition(x: number, y: number) {
    this.rotating_sprites?.setPosition(x, y);
    this.static_sprites?.setPosition(x, y);
    this.range_indicator?.setPosition(x, y);
  }

  public update(time: number, delta: number) {
    // console.log("tower_info", this.tower_info.status.is_selected)
    // if (this.tower_info.status.is_selected) {
    //   this.selection = 'selected';
    // } else {
    //   this.selection = undefined;
    // }


    this.placement_components.forEach(c => {
      // console.log('calling placement components')
      if (typeof c?.onUpdate == 'function') c.onUpdate(this, time, delta)
    })

    if (!this.is_placed) return;
    // call update methods in components;
    this.components.forEach(c => {
      if (typeof c?.onUpdate == 'function') c.onUpdate(this, time, delta)
    })

    this.targeting_components.forEach(c => {
      if (typeof c?.onUpdate == 'function') c.onUpdate(this, time, delta)
    })

    this.projectile_components.forEach(c => {
      if (typeof c?.onUpdate == 'function') c.onUpdate(this, time, delta)
    })

  }
  // public add_component(component: any) {
  //   // if component is not already present, add component, and initialize.
  //   // If there is already a matching component, return an error code.
  // }

  // public remove_component(component: any) {
  //   // if component is present, uninitialize, and remove.
  //   // if there is no matching component, return an error code.
  // }
}