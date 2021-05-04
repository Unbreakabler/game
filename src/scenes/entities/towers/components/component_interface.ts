import type TD from "../../../td"
import type Tower from "../tower"

export interface TowerComponent {
  type: string,
  onInit?: Function,
  onUpdate?: Function,
}

const default_component = () => {
  return {
    type: 'default_component',
    onInit: (parent: Tower, td_scene: TD, x: number, y:number) => {},
    onUpdate: (parent: Tower, time: number, delta: number) => {},
  }
}