<script lang="ts">
  let { data } = $props();
  console.log({ data });
</script>

<div class="container mt-5">
  <div>Server page</div>
  <div>
    <a href={`/${data.server}/${data.room}`}>ROOM</a>
  </div>
  <div>
    <form
      onsubmit={(e) => {
        e.preventDefault();
        fetch("/api/new-server", {
          method: "POST",
          body: JSON.stringify({
            rooms: [
              "at://did:plc:bpmiiiabnbf2hf7uuqdbjne6/social.psky.chat.room/3l6k3isiuzb2j",
            ],
          }),
        });
      }}
    >
      <input type="text" class="input" />
    </form>
  </div>
</div>
