import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function start() {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule);
    const config = new DocumentBuilder()
        .setTitle('Кинограм')
        .setDescription('Микросервис фильмы')
        .setVersion('1.0.0')
        .addTag('Films')
        .build()
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/films/docs', app, document)

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
