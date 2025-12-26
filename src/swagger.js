// src/swagger.js
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mobile Bill Payment API",
      version: "1.0.0",
      description: "SE4458 Project - Mobile Bill Payment System (Internal Gateway Mode)",
    },
    servers: [
      {
        // 1. ÖNCELİK: Render canlı linkin
        url: "https://bill-api-se4458-midterm.onrender.com", 
        description: "Production Server (Render Gateway)",
      },
      {
        url: "http://localhost:3000",
        description: "Local development",
      },
    ],

    components: {
      securitySchemes: {
        // Sadece JWT kalsın, hoca login olup token alsa yeterli
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    // Global güvenlikten subscriptionKey'i çıkardık
    security: [
      { bearerAuth: [] }
    ],
  },
  // Tüm route dosyalarını tarıyor
  apis: ["./src/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
export { swaggerUi };