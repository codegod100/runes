import skio from "sveltekit-io";

skio.setup("http://127.0.0.1:3001", {
  cors: {
    origin: "http://127.0.0.1:5173",
    credentials: true,
  },
});
