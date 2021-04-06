<script lang="ts">
  export let total = 100;
  export let current = 0;
  export let name = "";

  $: progress_width = (current / total) * 100;
</script>

<div class="container bg-error-500" style="--progress_width: {progress_width}%">
  <span>{name}</span>
  <div class="progress bg-primary-500" />
</div>

<style>
  span {
    position: absolute;
    padding: 2px 10px;
    color: white;
  }
  .container {
    height: 1.5em;
    width: 100%;

    display: relative;
  }
  .progress {
    width: var(--progress_width);
    height: 1.5em;
  }
</style>
