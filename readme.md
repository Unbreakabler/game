# :baby: baby gifs only 

## https://unbreakabler.github.io/game/


### color scheme
https://paletton.com/#uid=72Q0u0ki6rV87JWdgxPmhnFqwj4
https://www.materialui.co/flatuicolors


### Game Design Overview

Game is an idle tower defense. The only "goal" of the game is to get to a progressively harder and harder level while making your towers/turrets/map more and more powerful

The player starts initially with 10 gold/money, viewing the "village" with nothing unlocked. Both the Mine and Workshop are available for puchase for free at the start.

The first action they take is to unlock the mine. Once the mine is unlocked, and the first "dirt" mine is purchased, the mine will automatically start to mine it's "dirt" resource.

Once the mine is unlocked and 10 dirt has been mined the player can go to the workshop to transmute 10 dirt into a dirt turret base.

After buying the turret base the player can equip it to one of their two initial slots. The player then needs to select a resource to use as a projectile, at this point the only option is "dirt". Once a turret is equipped to a slot and a projectile type is chosen the turret can be placed on the map.

The tower defense waves start once the first turret is placed. Waves advance after the entire wave has been cleared without any enemies making it to the end. If an enemy does successfully reach the end the same wave will be replayed until it is successfully cleared.

Killing an enemy in the tower defense grants the player gold/money. This money can be used to upgrade the existing mine or purchase the next level of mine. Mine upgrades cause a doubling in mining efficiency, either through a mining speed increase or a production increase.

Each new tier of resource is drastically more powerful as a projectile then the previous level, but also drastically more expensive to buy and upgrade. This means that older resources will be used for the major of your fast hiring turret projectiles and you may have a harder hitting turret in the back firing a higher tier resource for the toughest enemies. Resources may have a prestige system, either upgrading the resource once a threshold is reached or by upgrading the mine.

## Components
- Gold - Gained by killing mobs in the tower defense
- Resources - Gained through mines
- Mines - Bought/Upgraded for gold, produces resources
- Workshop - Purchase frames/mods with resources.
- Inventory - Manage slots, frames, mods and their relations.
- Prestige - ????

- Tower defense - Places towers to kill mobs, gain gold and mods from the enemies.

## Tower defense
- Enemies
- Waves
- Wave/Enemy Modifiers
- Towers
- Tower Modifiers