import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function SwaggerConfigInit(app: INestApplication): void {
  const document = new DocumentBuilder()
    .setTitle("Lernova")
    .setDescription("Backend API of Lernova educational platform")
    .setVersion("v1.0.0")
    .addBearerAuth({
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      in: "header",
    }, "Authorization")
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, document);
  SwaggerModule.setup("/swagger", app, swaggerDocument);
}
