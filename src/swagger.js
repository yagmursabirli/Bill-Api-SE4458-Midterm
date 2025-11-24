// src/swagger.js
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mobile Bill Payment API",
      version: "1.0.0",
      description: "SE4458 Midterm Project - Mobile Bill Payment System",
    },
    servers: [
      {
        url: "https://yagmur-apim.azure-api.net/mobile-bill-api",
        description: "API Gateway (APIM)",
      },

      {
        url: "https://yagmur-mobile-bill-api.azurewebsites.net",
        description: "Azure App Service",
      },
      {
        url: "http://localhost:3000",
        description: "Local development",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        subscriptionKey: {
          type: "apiKey",
          in: "header",
          name: "Ocp-Apim-Subscription-Key",
        },
      },
    },
  },

  security: [{ subscriptionKey: [] }, { bearerAuth: [] }],

  // Tüm route dosyalarını tarıyor
  apis: ["./src/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);

// Normal export, özel middleware YAPMIYORUZ
export { swaggerUi };
