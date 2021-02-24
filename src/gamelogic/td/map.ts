/*
State for the tower defense engine.

INVENTORY:
The player can "Unlock" towers in the workshop. 
The player can "Unlock" items/powers/gems in the blacksmith.


TOWER:
- type (assuming there are multiple "types" of towers, likely the type is the "base" attack)
  - arrow (projectile)
  - fire (projectile, fire)
  - cold (projectile, cold)
  - lightning (projectile, lightning)
- is_placed FLAG
- coords of placement - 0,0 if not placed
- current_exp
- level
- kills
- list of "equipment", each piece of equipment is an equiped item/power.

ITEM(POWER/GEM/IDK):
- These are modifiers that effect the base towers, need to use a tag system similar to
poe to indicate which modifiers can effect which towers. For example an increased AOE mod
doesn't make sense on a tower that doesn't do AOE damage.


MAP: 
- tracks a list of stages that are iterated through in order
  - This could be used to create a map that changes over time ie: after level 5 the path changes
- tracks a list of turrets currently placed in the map


MAP/STAGE:
Each stage contains a set of levels and a path
  - A starting index for the stage level (0 - by default).
  - A list of coord tuples making up the path for the stage.
  - A list of obstructions on the map (rocks, trees? baby toys? idk)
  - On stage transition, if any currently placed towers are now unplaced because of the
    stage transition, they will be refunded. Can also force all towers to be refunded
    on transition.

MAP/STAGE/LEVEL:
Each level contains a list of enemies with timings to release on the track.
Enemies can be released in groups.
Structure:
[
  [200, [Enemy, Enemy, BigEnemy]],
  [1000, [BigEnemy]],
  [1000, [BigEnemy]],
]
After 200ms release 2 Enemy's and 1 BigEnemy, then release a BigEnemy after 1000ms x2.
As the enemies spawn, they are tracked by the level, when they are all spawned and all
killed, it will advance to the next level (maybe there is a button to advance).
*/ 