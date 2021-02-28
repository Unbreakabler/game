class TowerDefense {
    constructor() {
        this.selection = null;
    }
    selectForPlacement(tower_type) {
        // Should I check if there is a "selectable" tower of this type available first?
        this.selection = tower_type;
    }
}

export { TowerDefense };
//# sourceMappingURL=tower_defense.js.map
