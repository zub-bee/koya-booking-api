import { readFile, writeFile } from "node:fs/promises";
import swaggerAutoGen from "swagger-autogen";

const doc = {
  info: {
    title: "Clinic Booking API",
    description: "Koya Cohort 4 Assessment API",
    version: "1.0.0"
  },
  host: `localhost:3000`,
  basePath: "/api",
  schemes: ["http"],
  securityDefinitions: {
    ApiKeyAuth: {
      type: "apiKey",
      in: "header",
      name: "X-API-Key"
    }
  },
  security: [{ ApiKeyAuth: [] }]
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
