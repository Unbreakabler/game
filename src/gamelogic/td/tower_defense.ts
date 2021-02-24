export type TowerType = 'basic'

export class TowerDefense {
  public selection: string | null = null;
  public constructor() {}

  public selectForPlacement(tower_type: TowerType) {
    // Should I check if there is a "selectable" tower of this type available first?
    this.selection = tower_type;
  }
}