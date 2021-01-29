
<script>
  import 'phaser';
  import { onMount, onDestroy } from 'svelte';
  import { count } from '../store.ts';

  let canvas, game, unsubscribe_store;

  onMount(() => {
    config = {
      type: Phaser.CANVAS,
      width: 800,
      height: 600,
      canvas: canvas,
      scene: {
        create: create
      }
    };

    function create () {
      const text = this.add.text(100, 100, '', { font: '64px Courier', fill: '#00ff00' });
      
      text.setDataEnabled();
      text.data.set('count', $count)

      text.on('changedata', (game_object, key, value) => {
        text.setText([
          'Count: ' + text.data.get('count'),
        ]);
      })

      const inc_button = this.add.text(200, 200, '', { font: '64px Courier', fill: '#00ff00' });
      inc_button.setInteractive();
      inc_button.setText(['Increment'])
      inc_button.on('pointerup', pointer => {
        count.increment()
      })

      unsubscribe_store = count.subscribe(c => {
        text.data.set('count', c)
      })

    }
  
    game = new Phaser.Game(config);
  })

  onDestroy(unsubscribe_store)
</script>

<canvas bind:this={canvas} id="game-container"></canvas>
<button on:click={count.increment}>Increment</button>
<div>count: {$count}</div>