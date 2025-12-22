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
        url: "https://mobile-bill-apim.azure-api.net/api",
        description: "API Gateway (APIM)",
      },

      {
        url: "https://mobile-bill-payment.azurewebsites.net",
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
