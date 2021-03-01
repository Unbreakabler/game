<script lang="ts">
  export let total = 100;
  export let current = 0;
  export let name = "Test";

  $: progress_width = (current / total) * 100;
</script>

<div class="container bg-error-500" style="--progress_width: {progress_width}%">
  <span>{name}</span>
  <div class="progress bg-primary-500" />
</div>

<style>
  span {
    position: absolute;
    padding: 0.15em 10px;
    color: white;
    text-align: center;
    justify-content: center;
  }
  .container {
    height: 1.8em;
    display: relative;
    overflow: hidden;
    cursor: pointer;
  }
  .progress {
    width: var(--progress_width);
    height: 1.8em;
  }
</style>
