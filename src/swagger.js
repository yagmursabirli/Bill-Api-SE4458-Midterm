// src/swagger.js
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mobile Bill Payment API",
      version: "1.0.0",
      description: "SE4458 Midterm Project - Mobile Bill Payment System"
    },
    servers: [
      {
        url: "http://localhost:3000",  // local
        description: "Local development server"
      }
      // App Service ve API Gateway URL’lerini deploy sonrası ekleyeceğiz
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },

  // Tüm route dosyalarını tarıyor
  apis: ["./src/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);

// Swagger UI export
export const swaggerUiMiddleware = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerSpec)
};
