import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import * as fs from 'fs';

async function start() {
    const PORT = process.env.PORT || 5000;
    const httpsOptions = {
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem'),
    };

    const app = await NestFactory.create(AppModule, { httpsOptions });
    const config = new DocumentBuilder()
        .setTitle('Кинограм')
        .setDescription('Микросервис фильмы')
        .setVersion('1.0.0')
        .addTag('Films')
        .build()
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/films/docs', app, document);

    app.use(cookieParser());
    app.enableCors({
        credentials: true,
        origin: process.env.FRONTEND_URL
    });

    const filmService = app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
            urls: ['amqp://rabbitmq:5672'],
            queue: 'persons-queue',
            queueOptions: {
                durable: false
            }
        }
    });

    await app.startAllMicroservices();
    await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}

start();
