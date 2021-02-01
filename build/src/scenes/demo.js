import '../../node_modules/phaser/dist/phaser.js';
import { count } from '../gamelogic/store.js';

class Demo extends Phaser.Scene {
    constructor() {
        super("demo");
    }
    create() {
        const scoreboard = this.add.text(100, 100, "", {
            font: "64px Courier",
            backgroundColor: "#00ff00",
        });
        scoreboard.setDataEnabled();
        scoreboard.on("changedata", (game_object, key, value) => {
            scoreboard.setText(["Count: " + scoreboard.data.get("count")]);
        });
        scoreboard.data.set("count", 1);
        // This is a memory leak, we need to destroy this subscription when the scene unmounts
        const unsub = count.subscribe((c) => {
            scoreboard.data.set("count", c);
        });
        this.events.addListener("destroy", () => {
            unsub();
        });
        const inc_button = this.add.text(200, 200, "", {
            font: "64px Courier",
            backgroundColor: "#00ff00",
        });
        inc_button.setInteractive();
        inc_button.setText(["Increment"]);
        inc_button.on("pointerup", () => {
            count.increment();
        });
    }
}

export default Demo;
//# sourceMappingURL=demo.js.map
