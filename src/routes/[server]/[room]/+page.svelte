<script lang="ts">
  import type { PageData } from "../../$types";
  import { onMount } from "svelte";
  import PocketBase from "pocketbase";
  import { PUBLIC_POCKET_BASE } from "$env/static/public";
  const pb = new PocketBase(PUBLIC_POCKET_BASE);
  // import skio from "sveltekit-io";
  let { data }: { data: PageData } = $props();
  let message = $state("");
  let messages = $state(JSON.parse(data.messages));
  let items = $state([]);
  async function getMessages() {
    const resultList = await pb.collection("messages").getList(1, 50, {});
    items = resultList.items;
    console.log({ resultList });
  }
  onMount(async () => {
    // const socket = skio.get();
    // socket.on("messages", (_messages) => {
    //   // console.log({ _messages });
    //   messages = _messages;
    // });
    await getMessages();
  });
  pb.collection("messages").subscribe("*", function (e) {
    getMessages();
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
  <div>{data.room}</div>
</div>
<div class="column chat">
  <div>Chat</div>
  <div class="chat">
    {#each items as message}
      <div>{message.did}: {message.content}</div>
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
  .column {
    overflow-wrap: break-word;
  }
</style>
