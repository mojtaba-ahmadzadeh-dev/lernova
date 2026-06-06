import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { SecuritySchemeObject } from "node_modules/@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export function SwaggerConfigInit(app: INestApplication): void {
  const document = new DocumentBuilder()
    .setTitle("Lernova")
    .setDescription("Backend API of Lernova educational platform")
    .setVersion("v1.0.0")
    .addBearerAuth(SwaggerAuthConfig(), "Authorization")
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, document);
  SwaggerModule.setup("/swagger", app, swaggerDocument);
}

function SwaggerAuthConfig(): SecuritySchemeObject {
  return {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    in: "header",
  };
}
