import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";

async function start() {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Кинограм')
        .setDescription('Микросервис авторизации')
        .setVersion('1.0.0')
        .addTag('auth-service')
        .build()
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/auth-service/docs', app, document)

    app.use(cookieParser());
    app.enableCors({
        credentials: true,
        origin: process.env.FRONTEND_URL
    });

    const authService = app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
            urls: ['amqp://rabbitmq:5672'],
            queue: 'auth-queue',
            queueOptions: {
                durable: false
            }
        }
    })

    await app.startAllMicroservices();
    await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}

start();
