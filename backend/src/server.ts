import Fastify from "fastify";

const app = Fastify();

app.get("/health", async () => {
  return {
    status: "ok",
    message: "ArtistWalks Backend Running",
  };
});

app.listen({
  port: 3001,
});

console.log("ArtistWalks Backend Running");
