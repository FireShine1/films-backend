import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function start() {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Кинограм')
        .setDescription('Микросервис профиль')
        .setVersion('1.0.0')
        .addTag('profile')
        .build()
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/profile-service/docs', app, document)

    app.use(cookieParser())
    app.enableCors({
        credentials: true,
        origin: process.env.FRONTEND_URL
    })
    await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}

start();
