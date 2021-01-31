<script lang="ts">
  import { count } from "../gamelogic/store.ts";
  import ProgressBar from "../components/progress_bar.svelte";
</script>

<ProgressBar current={$count} />
