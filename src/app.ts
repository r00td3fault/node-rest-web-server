import { envs } from "./config/envs";
import { Server } from "./presentation/server";

(async () => {
    main();
})();


async function main() {
    const server = new Server({
        port: envs.PORT,
        publicPath: envs.PUBLIC_PATH
    });
    await server.start();
}