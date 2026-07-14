import Fastify from "fastify";
import { walkRoutes } from "./routes/walks";
import { bookingRoutes } from "./routes/bookings";

const app = Fastify({
  logger: true,
});

app.get("/health", async () => {
  return { status: "ok" };
});

app.register(walkRoutes);
app.register(bookingRoutes);

const start = async () => {
  try {
    await app.listen({
      host: "0.0.0.0",
      port: 3001,
    });

    console.log("🚀 Backend running on http://localhost:3001");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
