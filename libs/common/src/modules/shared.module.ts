import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

@Global()
@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env`
        }),
        JwtModule.register({
            secret: process.env.ACCESS_PRIVATE_KEY || 'SECRET',
            signOptions: {
                expiresIn: '30m'
            }
        }),
    ],
    exports: [
        JwtModule,
    ]
})
export class SharedModule { };