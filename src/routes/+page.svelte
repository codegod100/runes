<script lang="ts">
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
  const messages = JSON.parse(data.messages);
</script>

<div class="column has-background-dark is-1">
  <div>Servers</div>
  <div>
    <img alt="test" class="image is-64x64 is-rounded" src="/duck.png" />
  </div>
</div>
<div class="column is-3">
  <div>Channels</div>
  <div>#yolo</div>
</div>
<div class="column">
  <div>Chat</div>
  {#each messages as message}
    <div>{message.text}</div>
  {/each}
  <div>
    <form method="POST" autocomplete="off">
      <input class="input" name="message" type="text" />
    </form>
  </div>
</div>
