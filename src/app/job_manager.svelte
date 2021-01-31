<script lang="ts">
  import { count } from "../gamelogic/store";
  import ProgressBar from "../components/progress_bar.svelte";
</script>

<ProgressBar current={$count} />
