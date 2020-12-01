import dotenv from "dotenv";
import fastify from "fastify";
import macos from "./macos";

const port = process.env.PORT || 3000;

dotenv.config();

const server = fastify({
  logger: true,
});

macos(server);

const start = async () => {
  try {
    await server.listen(port);
    console.log("server setup finished");
  } catch (err) {
    server.log.error(err);
    console.error(err);
  }
};

start();
