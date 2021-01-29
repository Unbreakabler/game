<script>
  import { count } from "../gamelogic/store.ts";
  import ProgressBar from "../components/progress_bar.svelte";
</script>

<div>test</div>

<ProgressBar current={$count} />
