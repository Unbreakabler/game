/* eslint-disable @typescript-eslint/explicit-member-accessibility */
class BetterGroup<T extends Phaser.GameObjects.GameObject> extends Phaser.GameObjects.Group {
  /**
   *
   * @param scene The scene this group belongs to.
   * @param children Game Objects to add to this group; or the `config` argument.
   * @param config Settings for this group. If `key` is set, Phaser.GameObjects.Group#createMultiple is also called with these settings.
   */
  constructor(
    scene: Phaser.Scene,
    children?: T[] | Phaser.Types.GameObjects.Group.GroupConfig | Phaser.Types.GameObjects.Group.GroupCreateConfig,
    config?: Phaser.Types.GameObjects.Group.GroupConfig | Phaser.Types.GameObjects.Group.GroupCreateConfig,
  );

  /**
   * This scene this group belongs to.
   */
  scene: Phaser.Scene;

  /**
   * Members of this group.
   */
  children: Phaser.Structs.Set<T>;

  /**
   * A flag identifying this object as a group.
   */
  isParent: boolean;

  /**
   * A textual representation of this Game Object.
   * Used internally by Phaser but is available for your own custom classes to populate.
   */
  type: string;

  /**
   * The class to create new group members from.
   */
  classType: Function;

  /**
   * The name of this group.
   * Empty by default and never populated by Phaser, this is left for developers to use.
   */
  name: string;

  /**
   * Whether this group runs its {@link Phaser.GameObjects.Group#preUpdate} method (which may update any members).
   */
  active: boolean;

  /**
   * The maximum size of this group, if used as a pool. -1 is no limit.
   */
  maxSize: number;

  /**
   * A default texture key to use when creating new group members.
   *
   * This is used in {@link Phaser.GameObjects.Group#create}
   * but not in {@link Phaser.GameObjects.Group#createMultiple}.
   */
  defaultKey: string;

  /**
   * A default texture frame to use when creating new group members.
   */
  defaultFrame: string | number;

  /**
   * Whether to call the update method of any members.
   */
  runChildUpdate: boolean;

  /**
   * A function to be called when adding or creating group members.
   */
  createCallback: Phaser.Types.GameObjects.Group.GroupCallback;

  /**
   * A function to be called when removing group members.
   */
  removeCallback: Phaser.Types.GameObjects.Group.GroupCallback;

  /**
   * A function to be called when creating several group members at once.
   */
  createMultipleCallback: Phaser.Types.GameObjects.Group.GroupMultipleCreateCallback;

  /**
   * Creates a new Game Object and adds it to this group, unless the group {@link Phaser.GameObjects.Group#isFull is full}.
   *
   * Calls {@link Phaser.GameObjects.Group#createCallback}.
   * @param x The horizontal position of the new Game Object in the world. Default 0.
   * @param y The vertical position of the new Game Object in the world. Default 0.
   * @param key The texture key of the new Game Object. Default defaultKey.
   * @param frame The texture frame of the new Game Object. Default defaultFrame.
   * @param visible The {@link Phaser.GameObjects.Components.Visible#visible} state of the new Game Object. Default true.
   * @param active The {@link Phaser.GameObjects.GameObject#active} state of the new Game Object. Default true.
   */
  create(x?: number, y?: number, key?: string, frame?: string | number, visible?: boolean, active?: boolean): any;

  /**
   * Creates several Game Objects and adds them to this group.
   *
   * If the group becomes {@link Phaser.GameObjects.Group#isFull}, no further Game Objects are created.
   *
   * Calls {@link Phaser.GameObjects.Group#createMultipleCallback} and {@link Phaser.GameObjects.Group#createCallback}.
   * @param config Creation settings. This can be a single configuration object or an array of such objects, which will be applied in turn.
   */
  createMultiple(config: Phaser.Types.GameObjects.Group.GroupCreateConfig | Phaser.Types.GameObjects.Group.GroupCreateConfig[]): any[];

  /**
   * A helper for {@link Phaser.GameObjects.Group#createMultiple}.
   * @param options Creation settings.
   */
  createFromConfig(options: Phaser.Types.GameObjects.Group.GroupCreateConfig): any[];

  /**
   * Updates any group members, if {@link Phaser.GameObjects.Group#runChildUpdate} is enabled.
   * @param time The current timestamp.
   * @param delta The delta time elapsed since the last frame.
   */
  preUpdate(time: number, delta: number): void;

  /**
   * Adds a Game Object to this group.
   *
   * Calls {@link Phaser.GameObjects.Group#createCallback}.
   * @param child The Game Object to add.
   * @param addToScene Also add the Game Object to the scene. Default false.
   */
  add(child: T, addToScene?: boolean): this;

  /**
   * Adds several Game Objects to this group.
   *
   * Calls {@link Phaser.GameObjects.Group#createCallback}.
   * @param children The Game Objects to add.
   * @param addToScene Also add the Game Objects to the scene. Default false.
   */
  addMultiple(children: T[], addToScene?: boolean): this;

  /**
   * Removes a member of this Group and optionally removes it from the Scene and / or destroys it.
   *
   * Calls {@link Phaser.GameObjects.Group#removeCallback}.
   * @param child The Game Object to remove.
   * @param removeFromScene Optionally remove the Group member from the Scene it belongs to. Default false.
   * @param destroyChild Optionally call destroy on the removed Group member. Default false.
   */
  remove(child: T, removeFromScene?: boolean, destroyChild?: boolean): this;

  /**
   * Removes all members of this Group and optionally removes them from the Scene and / or destroys them.
   *
   * Does not call {@link Phaser.GameObjects.Group#removeCallback}.
   * @param removeFromScene Optionally remove each Group member from the Scene. Default false.
   * @param destroyChild Optionally call destroy on the removed Group members. Default false.
   */
  clear(removeFromScene?: boolean, destroyChild?: boolean): this;

  /**
   * Tests if a Game Object is a member of this group.
   * @param child A Game Object.
   */
  contains(child: T): boolean;

  /**
   * All members of the group.
   */
  getChildren(): T[];

  /**
   * The number of members of the group.
   */
  getLength(): number;

  /**
   * Returns all children in this Group that match the given criteria based on the `property` and `value` arguments.
   *
   * For example: `getAll('visible', true)` would return only children that have their `visible` property set.
   *
   * Optionally, you can specify a start and end index. For example if the Group has 100 elements,
   * and you set `startIndex` to 0 and `endIndex` to 50, it would return matches from only
   * the first 50.
   * @param property The property to test on each array element.
   * @param value The value to test the property against. Must pass a strict (`===`) comparison check.
   * @param startIndex An optional start index to search from.
   * @param endIndex An optional end index to search to.
   */
  getMatching(property?: string, value?: any, startIndex?: number, endIndex?: number): any[];

  /**
   * Scans the Group, from top to bottom, for the first member that has an {@link Phaser.GameObjects.GameObject#active} state matching the argument,
   * assigns `x` and `y`, and returns the member.
   *
   * If no matching member is found and `createIfNull` is true and the group isn't full then it will create a new Game Object using `x`, `y`, `key`, `frame`, and `visible`.
   * Unless a new member is created, `key`, `frame`, and `visible` are ignored.
   * @param state The {@link Phaser.GameObjects.GameObject#active} value to match. Default false.
   * @param createIfNull Create a new Game Object if no matching members are found, using the following arguments. Default false.
   * @param x The horizontal position of the Game Object in the world.
   * @param y The vertical position of the Game Object in the world.
   * @param key The texture key assigned to a new Game Object (if one is created). Default defaultKey.
   * @param frame A texture frame assigned to a new Game Object (if one is created). Default defaultFrame.
   * @param visible The {@link Phaser.GameObjects.Components.Visible#visible} state of a new Game Object (if one is created). Default true.
   */
  getFirst(state?: boolean, createIfNull?: boolean, x?: number, y?: number, key?: string, frame?: string | number, visible?: boolean): any;

  /**
   * Scans the Group, from top to bottom, for the nth member that has an {@link Phaser.GameObjects.GameObject#active} state matching the argument,
   * assigns `x` and `y`, and returns the member.
   *
   * If no matching member is found and `createIfNull` is true and the group isn't full then it will create a new Game Object using `x`, `y`, `key`, `frame`, and `visible`.
   * Unless a new member is created, `key`, `frame`, and `visible` are ignored.
   * @param nth The nth matching Group member to search for.
   * @param state The {@link Phaser.GameObjects.GameObject#active} value to match. Default false.
   * @param createIfNull Create a new Game Object if no matching members are found, using the following arguments. Default false.
   * @param x The horizontal position of the Game Object in the world.
   * @param y The vertical position of the Game Object in the world.
   * @param key The texture key assigned to a new Game Object (if one is created). Default defaultKey.
   * @param frame A texture frame assigned to a new Game Object (if one is created). Default defaultFrame.
   * @param visible The {@link Phaser.GameObjects.Components.Visible#visible} state of a new Game Object (if one is created). Default true.
   */
  getFirstNth(
    nth: number,
    state?: boolean,
    createIfNull?: boolean,
    x?: number,
    y?: number,
    key?: string,
    frame?: string | number,
    visible?: boolean,
  ): any;

  /**
   * Scans the Group for the last member that has an {@link Phaser.GameObjects.GameObject#active} state matching the argument,
   * assigns `x` and `y`, and returns the member.
   *
   * If no matching member is found and `createIfNull` is true and the group isn't full then it will create a new Game Object using `x`, `y`, `key`, `frame`, and `visible`.
   * Unless a new member is created, `key`, `frame`, and `visible` are ignored.
   * @param state The {@link Phaser.GameObjects.GameObject#active} value to match. Default false.
   * @param createIfNull Create a new Game Object if no matching members are found, using the following arguments. Default false.
   * @param x The horizontal position of the Game Object in the world.
   * @param y The vertical position of the Game Object in the world.
   * @param key The texture key assigned to a new Game Object (if one is created). Default defaultKey.
   * @param frame A texture frame assigned to a new Game Object (if one is created). Default defaultFrame.
   * @param visible The {@link Phaser.GameObjects.Components.Visible#visible} state of a new Game Object (if one is created). Default true.
   */
  getLast(state?: boolean, createIfNull?: boolean, x?: number, y?: number, key?: string, frame?: string | number, visible?: boolean): any;

  /**
   * Scans the Group for the last nth member that has an {@link Phaser.GameObjects.GameObject#active} state matching the argument,
   * assigns `x` and `y`, and returns the member.
   *
   * If no matching member is found and `createIfNull` is true and the group isn't full then it will create a new Game Object using `x`, `y`, `key`, `frame`, and `visible`.
   * Unless a new member is created, `key`, `frame`, and `visible` are ignored.
   * @param nth The nth matching Group member to search for.
   * @param state The {@link Phaser.GameObjects.GameObject#active} value to match. Default false.
   * @param createIfNull Create a new Game Object if no matching members are found, using the following arguments. Default false.
   * @param x The horizontal position of the Game Object in the world.
   * @param y The vertical position of the Game Object in the world.
   * @param key The texture key assigned to a new Game Object (if one is created). Default defaultKey.
   * @param frame A texture frame assigned to a new Game Object (if one is created). Default defaultFrame.
   * @param visible The {@link Phaser.GameObjects.Components.Visible#visible} state of a new Game Object (if one is created). Default true.
   */
  getLastNth(
    nth: number,
    state?: boolean,
    createIfNull?: boolean,
    x?: number,
    y?: number,
    key?: string,
    frame?: string | number,
    visible?: boolean,
  ): any;

  /**
   * Scans the group for the first member that has an {@link Phaser.GameObjects.GameObject#active} state set to `false`,
   * assigns `x` and `y`, and returns the member.
   *
   * If no inactive member is found and the group isn't full then it will create a new Game Object using `x`, `y`, `key`, `frame`, and `visible`.
   * The new Game Object will have its active state set to `true`.
   * Unless a new member is created, `key`, `frame`, and `visible` are ignored.
   * @param x The horizontal position of the Game Object in the world.
   * @param y The vertical position of the Game Object in the world.
   * @param key The texture key assigned to a new Game Object (if one is created). Default defaultKey.
   * @param frame A texture frame assigned to a new Game Object (if one is created). Default defaultFrame.
   * @param visible The {@link Phaser.GameObjects.Components.Visible#visible} state of a new Game Object (if one is created). Default true.
   */
  get(x?: number, y?: number, key?: string, frame?: string | number, visible?: boolean): any;

  /**
   * Scans the group for the first member that has an {@link Phaser.GameObjects.GameObject#active} state set to `true`,
   * assigns `x` and `y`, and returns the member.
   *
   * If no active member is found and `createIfNull` is `true` and the group isn't full then it will create a new one using `x`, `y`, `key`, `frame`, and `visible`.
   * Unless a new member is created, `key`, `frame`, and `visible` are ignored.
   * @param createIfNull Create a new Game Object if no matching members are found, using the following arguments. Default false.
   * @param x The horizontal position of the Game Object in the world.
   * @param y The vertical position of the Game Object in the world.
   * @param key The texture key assigned to a new Game Object (if one is created). Default defaultKey.
   * @param frame A texture frame assigned to a new Game Object (if one is created). Default defaultFrame.
   * @param visible The {@link Phaser.GameObjects.Components.Visible#visible} state of a new Game Object (if one is created). Default true.
   */
  getFirstAlive(createIfNull?: boolean, x?: number, y?: number, key?: string, frame?: string | number, visible?: boolean): any;

  /**
   * Scans the group for the first member that has an {@link Phaser.GameObjects.GameObject#active} state set to `false`,
   * assigns `x` and `y`, and returns the member.
   *
   * If no inactive member is found and `createIfNull` is `true` and the group isn't full then it will create a new one using `x`, `y`, `key`, `frame`, and `visible`.
   * The new Game Object will have an active state set to `true`.
   * Unless a new member is created, `key`, `frame`, and `visible` are ignored.
   * @param createIfNull Create a new Game Object if no matching members are found, using the following arguments. Default false.
   * @param x The horizontal position of the Game Object in the world.
   * @param y The vertical position of the Game Object in the world.
   * @param key The texture key assigned to a new Game Object (if one is created). Default defaultKey.
   * @param frame A texture frame assigned to a new Game Object (if one is created). Default defaultFrame.
   * @param visible The {@link Phaser.GameObjects.Components.Visible#visible} state of a new Game Object (if one is created). Default true.
   */
  getFirstDead(createIfNull?: boolean, x?: number, y?: number, key?: string, frame?: string | number, visible?: boolean): any;

  /**
   * {@link Phaser.GameObjects.Components.Animation#play Plays} an animation for all members of this group.
   * @param key The string-based key of the animation to play.
   * @param startFrame Optionally start the animation playing from this frame index. Default 0.
   */
  playAnimation(key: string, startFrame?: string): this;

  /**
   * Whether this group's size at its {@link Phaser.GameObjects.Group#maxSize maximum}.
   */
  isFull(): boolean;

  /**
   * Counts the number of active (or inactive) group members.
   * @param value Count active (true) or inactive (false) group members. Default true.
   */
  countActive(value?: boolean): number;

  /**
   * Counts the number of in-use (active) group members.
   */
  getTotalUsed(): number;

  /**
   * The difference of {@link Phaser.GameObjects.Group#maxSize} and the number of active group members.
   *
   * This represents the number of group members that could be created or reactivated before reaching the size limit.
   */
  getTotalFree(): number;

  /**
   * Sets the `active` property of this Group.
   * When active, this Group runs its `preUpdate` method.
   * @param value True if this Group should be set as active, false if not.
   */
  setActive(value: boolean): this;

  /**
   * Sets the `name` property of this Group.
   * The `name` property is not populated by Phaser and is presented for your own use.
   * @param value The name to be given to this Group.
   */
  setName(value: string): this;

  /**
   * Sets the property as defined in `key` of each group member to the given value.
   * @param key The property to be updated.
   * @param value The amount to set the property to.
   * @param step This is added to the `value` amount, multiplied by the iteration counter. Default 0.
   * @param index An optional offset to start searching from within the items array. Default 0.
   * @param direction The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning. Default 1.
   */
  propertyValueSet(key: string, value: number, step?: number, index?: number, direction?: number): this;

  /**
   * Adds the given value to the property as defined in `key` of each group member.
   * @param key The property to be updated.
   * @param value The amount to set the property to.
   * @param step This is added to the `value` amount, multiplied by the iteration counter. Default 0.
   * @param index An optional offset to start searching from within the items array. Default 0.
   * @param direction The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning. Default 1.
   */
  propertyValueInc(key: string, value: number, step?: number, index?: number, direction?: number): this;

  /**
   * Sets the x of each group member.
   * @param value The amount to set the property to.
   * @param step This is added to the `value` amount, multiplied by the iteration counter. Default 0.
   */
  setX(value: number, step?: number): this;

  /**
   * Sets the y of each group member.
   * @param value The amount to set the property to.
   * @param step This is added to the `value` amount, multiplied by the iteration counter. Default 0.
   */
  setY(value: number, step?: number): this;

  /**
   * Sets the x, y of each group member.
   * @param x The amount to set the `x` property to.
   * @param y The amount to set the `y` property to. If `undefined` or `null` it uses the `x` value. Default x.
   * @param stepX This is added to the `x` amount, multiplied by the iteration counter. Default 0.
   * @param stepY This is added to the `y` amount, multiplied by the iteration counter. Default 0.
   */
  setXY(x: number, y?: number, stepX?: number, stepY?: number): this;

  /**
   * Adds the given value to the x of each group member.
   * @param value The amount to be added to the `x` property.
   * @param step This is added to the `value` amount, multiplied by the iteration counter. Default 0.
   */
  incX(value: number, step?: number): this;

  /**
   * Adds the given value to the y of each group member.
   * @param value The amount to be added to the `y` property.
   * @param step This is added to the `value` amount, multiplied by the iteration counter. Default 0.
   */
  incY(value: number, step?: number): this;

  /**
   * Adds the given value to the x, y of each group member.
   * @param x The amount to be added to the `x` property.
   * @param y The amount to be added to the `y` property. If `undefined` or `null` it uses the `x` value. Default x.
   * @param stepX This is added to the `x` amount, multiplied by the iteration counter. Default 0.
   * @param stepY This is added to the `y` amount, multiplied by the iteration counter. Default 0.
   */
  incXY(x: number, y?: number, stepX?: number, stepY?: number): this;

  /**
   * Iterate through the group members changing the position of each element to be that of the element that came before
   * it in the array (or after it if direction = 1)
   *
   * The first group member position is set to x/y.
   * @param x The x coordinate to place the first item in the array at.
   * @param y The y coordinate to place the first item in the array at.
   * @param direction The iteration direction. 0 = first to last and 1 = last to first. Default 0.
   */
  shiftPosition(x: number, y: number, direction?: number): this;

  /**
   * Sets the angle of each group member.
   * @param value The amount to set the angle to, in degrees.
   * @param step This is added to the `value` amount, multiplied by the iteration counter. Default 0.
   */
  angle(value: number, step?: number): this;

  /**
   * Sets the rotation of each group member.
   * @param value The amount to set the rotation to, in radians.
   * @param step This is added to the `value` amount, multiplied by the iteration counter. Default 0.
   */
  rotate(value: number, step?: number): this;

  /**
   * Rotates each group member around the given point by the given angle.
   * @param point Any object with public `x` and `y` properties.
   * @param angle The angle to rotate by, in radians.
   */
  rotateAround(point: Phaser.Types.Math.Vector2Like, angle: number): this;

  /**
   * Rotates each group member around the given point by the given angle and distance.
   * @param point Any object with public `x` and `y` properties.
   * @param angle The angle to rotate by, in radians.
   * @param distance The distance from the point of rotation in pixels.
   */
  rotateAroundDistance(point: Phaser.Types.Math.Vector2Like, angle: number, distance: number): this;

  /**
   * Sets the alpha of each group member.
   * @param value The amount to set the alpha to.
   * @param step This is added to the `value` amount, multiplied by the iteration counter. Default 0.
   */
  setAlpha(value: number, step?: number): this;

  /**
   * Sets the tint of each group member.
   * @param topLeft The tint being applied to top-left corner of item. If other parameters are given no value, this tint will be applied to whole item.
   * @param topRight The tint to be applied to top-right corner of item.
   * @param bottomLeft The tint to be applied to the bottom-left corner of item.
   * @param bottomRight The tint to be applied to the bottom-right corner of item.
   */
  setTint(topLeft: number, topRight?: number, bottomLeft?: number, bottomRight?: number): this;

  /**
   * Sets the originX, originY of each group member.
   * @param originX The amount to set the `originX` property to.
   * @param originY The amount to set the `originY` property to. If `undefined` or `null` it uses the `originX` value.
   * @param stepX This is added to the `originX` amount, multiplied by the iteration counter. Default 0.
   * @param stepY This is added to the `originY` amount, multiplied by the iteration counter. Default 0.
   */
  setOrigin(originX: number, originY?: number, stepX?: number, stepY?: number): this;

  /**
   * Sets the scaleX of each group member.
   * @param value The amount to set the property to.
   * @param step This is added to the `value` amount, multiplied by the iteration counter. Default 0.
   */
  scaleX(value: number, step?: number): this;

  /**
   * Sets the scaleY of each group member.
   * @param value The amount to set the property to.
   * @param step This is added to the `value` amount, multiplied by the iteration counter. Default 0.
   */
  scaleY(value: number, step?: number): this;

  /**
   * Sets the scaleX, scaleY of each group member.
   * @param scaleX The amount to be added to the `scaleX` property.
   * @param scaleY The amount to be added to the `scaleY` property. If `undefined` or `null` it uses the `scaleX` value.
   * @param stepX This is added to the `scaleX` amount, multiplied by the iteration counter. Default 0.
   * @param stepY This is added to the `scaleY` amount, multiplied by the iteration counter. Default 0.
   */
  scaleXY(scaleX: number, scaleY?: number, stepX?: number, stepY?: number): this;

  /**
   * Sets the depth of each group member.
   * @param value The amount to set the property to.
   * @param step This is added to the `value` amount, multiplied by the iteration counter. Default 0.
   */
  setDepth(value: number, step?: number): this;

  /**
   * Sets the blendMode of each group member.
   * @param value The amount to set the property to.
   */
  setBlendMode(value: number): this;

  /**
   * Passes all group members to the Input Manager to enable them for input with identical areas and callbacks.
   * @param hitArea Either an input configuration object, or a geometric shape that defines the hit area for the Game Object. If not specified a Rectangle will be used.
   * @param hitAreaCallback A callback to be invoked when the Game Object is interacted with. If you provide a shape you must also provide a callback.
   */
  setHitArea(hitArea: any, hitAreaCallback: Phaser.Types.Input.HitAreaCallback): this;

  /**
   * Shuffles the group members in place.
   */
  shuffle(): this;

  /**
   * Deactivates a member of this group.
   * @param gameObject A member of this group.
   */
  kill(gameObject: Phaser.GameObjects.GameObject): void;

  /**
   * Deactivates and hides a member of this group.
   * @param gameObject A member of this group.
   */
  killAndHide(gameObject: Phaser.GameObjects.GameObject): void;

  /**
   * Sets the visible of each group member.
   * @param value The value to set the property to.
   * @param index An optional offset to start searching from within the items array. Default 0.
   * @param direction The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning. Default 1.
   */
  setVisible(value: boolean, index?: number, direction?: number): this;

  /**
   * Toggles (flips) the visible state of each member of this group.
   */
  toggleVisible(): this;

  /**
   * Empties this group and removes it from the Scene.
   *
   * Does not call {@link Phaser.GameObjects.Group#removeCallback}.
   * @param destroyChildren Also {@link Phaser.GameObjects.GameObject#destroy} each group member. Default false.
   */
  destroy(destroyChildren?: boolean): void;
}
