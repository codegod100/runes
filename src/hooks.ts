import skio from "sveltekit-io";

skio.setup("http://localhost:3001", {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
