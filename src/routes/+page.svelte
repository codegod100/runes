<script>
    let server = "";
    const enc = encodeURIComponent;
</script>
<div><form onsubmit={(e) => {e.preventDefault(); 
//redirect to the server page
window.location.href = `/${enc(server)}`

}}>
    <input type="text" class="input" bind:value={server} />
</form></div>