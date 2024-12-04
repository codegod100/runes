<script lang="ts">
  import type { PageData } from "../../$types";
  import { onMount } from "svelte";
  import {format} from 'timeago.js'
  import PocketBase from "pocketbase";
  import anchors from "$lib/anchors"
  import channelMap from "$lib/channel_map"
  import { PUBLIC_POCKET_BASE } from "$env/static/public";

  const pb = new PocketBase(PUBLIC_POCKET_BASE);
  let { data }: { data: PageData } = $props();
  let room = $state(channelMap[data.room]);
  let did = $state("");
  let message = $state("");
  let items = $state([]);
  let input
  let scroller;
  $effect( async ()=>{
    console.log("effect",data, room)
    room = channelMap[data.room];
    await getMessages();
    scrollToBottom()
  })
  async function scrollToBottom() {
    console.log("scrollin")
    scroller.scroll({ top: scroller.scrollHeight, behavior: 'auto' });
  }
  async function getMessages() {

    const resultList = await pb
      .collection("messages")
      .getList(1, 100, { sort: "-created", filter: `room="${room}"` });
    items = resultList.items.reverse();


    console.log({ resultList });
  }
  onMount(async () => {
    console.log("mounted");
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
    {#if !data.logged_in}
  <div data-sveltekit-reload class="mb-3">
      <input class="input" type="text" placeholder="DID" bind:value={did} />
    <a href={`/oauth/${did}`} class="button is-primary">Login</a>
  </div>
  {:else}
  <div data-sveltekit-reload class="mb-3">
    <a href={`/logout`} class="button is-primary">Logout</a>
  </div>
  {/if}
  <div>Servers</div>
  <div>
    <img alt="test" class="image is-64x64 is-rounded" src="/duck.png" />
  </div>
</div>
<div   class="column is-2 has-background-black-ter" >
  <div>Channels</div>
  <div><a href="/main/default" >default</a></div>
  <div><a href="/main/test" >test</a></div>
</div>
<div class="column">
  <div>Chat</div>
  <div class="chat" id="scroller" bind:this={scroller}>
    {#each items as m}
      <div class="mb-1">
        <span class={m.content.includes(data.handle) && "has-text-weight-bold is-large is-italic"}>({format(m.created)}) <span class="grab" onclick={()=>{
          message = message +(m.handle || m.did)+" "
          input.focus()
        }}>{m.handle || m.did}</span></span
        >: {@html anchors(m.content)}
      </div>
    {/each}
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
          body: JSON.stringify({ room, message: m2 }),
        });
      }}
    >
      <input
        class="input"
        name="message"
        type="text"
        autofocus
        bind:value={message}
        bind:this={input}
      />
    </form>
  </div>
</div>
<style>
  .chat {
    height: 100%;
    overflow: scroll;
    overflow-x: hidden;
  }
  .column {
    overflow-wrap: break-word;
  }
  .grab{
      cursor: pointer;
  }


</style>
