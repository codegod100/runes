<script lang="ts">
  import type { PageData } from "../../$types";
  import { onMount } from "svelte";
  import skio from "sveltekit-io";
  let { data }: { data: PageData } = $props();
  let message = $state("");
  let messages = $state(JSON.parse(data.messages));
  onMount(() => {
    const socket = skio.get();
    socket.on("messages", (_messages) => {
      console.log({ _messages });
      messages = _messages;
    });
  });
</script>

<div class="column has-background-dark is-1">
  <div>Servers</div>
  <div>
    <img alt="test" class="image is-64x64 is-rounded" src="/duck.png" />
  </div>
</div>
<div class="column is-2 has-background-black-ter">
  <div>Channels</div>
  <div>#yolo</div>
</div>
<div class="column chat">
  <div>Chat</div>
  <div class="chat">
    {#each messages as message}
      <div>{message.author}: {message.text}</div>
    {/each}
  </div>
  <div>
    <form
      autocomplete="off"
      onsubmit={(e) => {
        e.preventDefault();
        let m2 = message;
        message = "";
        fetch("/submit", {
          method: "POST",
          body: JSON.stringify({ room: data.room, message: m2 }),
        });
      }}
    >
      <input
        class="input"
        name="message"
        type="text"
        autofocus
        bind:value={message}
      />
    </form>
  </div>
</div>

<style>
  .chat {
    /* height: 90%; */
    max-height: 100%;
  }
</style>
