import "phaser";
import { count } from "../gamelogic/store";
import { svelte_game_loop } from '../gamelogic/gameloop'

export default class Main extends Phaser.Scene {
  constructor (){
    super('main');
  }

  create(): void {
    const scoreboard: Phaser.GameObjects.Text = this.add.text(10, 10, "", {
      font: "64px Courier",
      backgroundColor: "#00ff00",
    });

    scoreboard.setDataEnabled();
    scoreboard.on("changedata", (game_object: any, key: any, value: any) => {
      scoreboard.setText(["Count: " + scoreboard.data.get("count")]);
    });
    scoreboard.data.set('count', 0)

    // This is a memory leak, we need to destroy this subscription when the scene unmounts
    const unsubscribe_store = count.subscribe((c) => {
      scoreboard.data.set("count", c);
    });

    const inc_button = this.add.text(10, 110, "", {
      font: "64px Courier",
      backgroundColor: "#00ff00",
    });
    inc_button.setInteractive();
    inc_button.setText(["Increment"]);
    inc_button.on("pointerup", (pointer: any) => {
      count.increment();
    });


    // GAME LOOP INTEGRATION TO SVELTE
    this.game.events.on('step', function(time: number, delta_t: number) {
      svelte_game_loop(time, delta_t)
      // console.log(time, delta)
      // call update in svelte land
    })
  }

}