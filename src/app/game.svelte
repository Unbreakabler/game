
<script>
  import 'phaser';
  import { onMount, onDestroy } from 'svelte';
  import { count } from '../store.ts';

  let canvas, game, unsubscribe_store;

  // $: game, console.log('test', Phaser, canvas, game, count)
  $: game, console.log($count)

  onMount(() => {
    config = {
        type: Phaser.CANVAS,
        width: 800,
        height: 600,
        canvas: canvas,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 200 }
            }
        },
        scene: {
            preload: preload,
            create: create
        }
    };
  
    function preload () {
        this.load.setBaseURL('http://labs.phaser.io');

        this.load.image('sky', 'assets/skies/space3.png');
        this.load.image('logo', 'assets/sprites/phaser3-logo.png');
        this.load.image('red', 'assets/particles/red.png');
    }
  
    function create () {
      const bg = this.add.image(400, 300, 'sky');
      
      const text = this.add.text(100, 100, '', { font: '64px Courier', fill: '#00ff00' });
      
      bg.setDataEnabled();
      bg.data.set('count', $count)

      bg.on('changedata', (game_object, key, value) => {
        text.setText([
          'Count: ' + bg.data.get('count'),
        ]);
      })

      const inc_button = this.add.text(200, 200, '', { font: '64px Courier', fill: '#00ff00' });
      inc_button.setInteractive();
      inc_button.setText(['Increment'])
      inc_button.on('pointerup', pointer => {
        count.increment()
      })

      unsubscribe_store = count.subscribe(c => {
        bg.data.set('count', c)
      })

    }
  
    game = new Phaser.Game(config);
  })

  onDestroy(unsubscribe_store)
</script>

<canvas bind:this={canvas} id="game-container"></canvas>
<button on:click={count.increment}>Increment</button>
<div>count: {$count}</div>