import "phaser";
import { count } from "../gamelogic/store";

export default class Demo extends Phaser.Scene {
  constructor (){
    super('demo');
  }

  create(): void {
    Phaser.GameObjects.Text
    const scoreboard: Phaser.GameObjects.Text = this.add.text(100, 100, "", {
      font: "64px Courier",
      backgroundColor: "#00ff00",
    });

    scoreboard.setDataEnabled();
    scoreboard.on("changedata", (game_object: any, key: any, value: any) => {
      scoreboard.setText(["Count: " + scoreboard.data.get("count")]);
    });
    const inc_button = this.add.text(200, 200, "", {
      font: "64px Courier",
      backgroundColor: "#00ff00",
    });
    inc_button.setInteractive();
    inc_button.setText(["Increment"]);
    inc_button.on("pointerup", (pointer: any) => {
      count.increment();
    });

    // This is a memory leak, we need to destroy this subscription when the scene unmounts
    const unsubscribe_store = count.subscribe((c) => {
      scoreboard.data.set("count", c);
    });
  }

}