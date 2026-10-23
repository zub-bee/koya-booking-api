import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import swaggerDocument from "../docs/swagger.json";

const CDN = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2";

export const setupSwagger = (app: Express) => {
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      customCssUrl: `${CDN}/swagger-ui.min.css`,
      customJs: [
        `${CDN}/swagger-ui-bundle.min.js`,
        `${CDN}/swagger-ui-standalone-preset.min.js`
      ]
    })
  );
};
