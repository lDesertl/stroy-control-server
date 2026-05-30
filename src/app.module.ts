import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { envValidationSchema } from "./config/env-validation";
import { HealthController } from "./health/health.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { UnitsModule } from './units/units.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			validationSchema: envValidationSchema,
			isGlobal: true,
		}),
		PrismaModule,
		UnitsModule,
	],
	controllers: [AppController, HealthController],
	providers: [AppService],
})
export class AppModule {}
