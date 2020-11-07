import fastify from "fastify";
import macos from "./macos";

const server = fastify({
  logger: true,
});

macos(server);

const start = async () => {
  try {
    await server.listen(3000);
  } catch (err) {
    server.log.error(err);
    console.error(err);
  }
};

start();
