import { readFile, writeFile } from "node:fs/promises";
import swaggerAutoGen from "swagger-autogen";

const doc = {
  info: {
    title: "Express Starter",
    description: "Express Starter",
    version: "1.0.0"
  },
  host: `localhost:3000`,
  basePath: "/api",
  schemes: ["http"]
};

const outputFile = "./src/docs/swagger.json";
const endpointsFiles = ["./src/app.ts"];

const result = await swaggerAutoGen(outputFile, endpointsFiles, doc);

if (!result.success) {
  throw new Error("Failed to generate Swagger documentation");
}

const swaggerDocument = JSON.parse(await readFile(outputFile, "utf8"));
swaggerDocument.paths = Object.fromEntries(
  Object.entries(swaggerDocument.paths)
    .filter(([path]) => path !== "/")
    .map(([path, definition]) => [
      path.replace(/^\/api/, ""),
      definition
    ])
);

await writeFile(`${outputFile}`, `${JSON.stringify(swaggerDocument, null, 2)}\n`);
