import fastify from "fastify";
import {env} from "./env";
import {azulRoutes} from "./routes/azul";
import {latamRoutes} from "./routes/latam";
import {interlineRoutes} from "./routes/interline";
import {smilesRoutes} from "./routes/smiles";

const app = fastify();

app.get('/', async () => {
    return {hello: 'world'};
})

app.register(azulRoutes, {prefix: '/azul'});
app.register(interlineRoutes, {prefix: '/interline'});
app.register(latamRoutes, {prefix: '/latam'});
app.register(smilesRoutes, {prefix: '/smiles'});


app.listen({port: env.PORT}).then(() => {
  console.log(`Server is listening on port ${env.PORT}`);
});