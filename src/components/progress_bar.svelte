<script lang="ts">
  export let total = 100;
  export let current = 0;
  export let name = 'Test';

  $: progress_width = (current / total) * 100 + "%";
</script>

<div class="container" style="--progress_width: {progress_width}">
  <span>{name}</span>
  <div class="progress" />
</div>

<style>
  span {
    position: absolute;
    padding: 2px 10px;
    color: white;
    font-family: 'Verdana', sans-serif;
  }
  .container {
    height: 1.5em;
    width: 100%;
    background-color: red;
    display: relative;
  }
  .progress {
    background-color: blue;
    width: var(--progress_width);
    height: 1.5em;
  }
</style>
