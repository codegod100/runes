<script lang="ts">
  import type { PageData } from "../../$types";
  import { onMount } from "svelte";
  import PocketBase from "pocketbase";
  import { PUBLIC_POCKET_BASE } from "$env/static/public";
  const pb = new PocketBase(PUBLIC_POCKET_BASE);
  // import skio from "sveltekit-io";
  let { data }: { data: PageData } = $props();
  let message = $state("");
  let items = $state([]);
  let scroller;
  async function scrollToBottom() {
    console.log("scrollin")
    scroller.scroll({ top: scroller.scrollHeight, behavior: 'smooth' });
  }
  async function getMessages() {
    const resultList = await pb
      .collection("messages")
      .getList(1, 30, { sort: "-created" });
    items = resultList.items.reverse();


    console.log({ resultList });
  }
  onMount(async () => {
    // const socket = skio.get();
    // socket.on("messages", (_messages) => {
    //   // console.log({ _messages });
    //   messages = _messages;
    // });
    await getMessages();
     scrollToBottom();
    pb.collection("messages").subscribe("*", async function (e) {
      await getMessages();
      scrollToBottom();
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
  <div>{data.room}</div>
</div>
<div class="column">
  <div>Chat</div>
  <div class="chat" id="scroller" bind:this={scroller}>
    {#each items as message}
      <div class="mb-1">
        <span class="has-text-weight-bold">{message.handle || message.did}</span
        >: {message.content}
      </div>
    {/each}
    <div id="anchor"></div>
  </div>
  <div>
      <button onclick={scrollToBottom}>Scroll to bottom</button>
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
    height: 100%;
    overflow: scroll;
  }
  .column {
    overflow-wrap: break-word;
  }


</style>
