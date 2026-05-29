import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);
	// biome-ignore lint/style/noNonNullAssertion: <port гарантируется в env-validation.ts>
	const port = configService.get<number>("PORT")!;

	app.setGlobalPrefix("api", { exclude: ["health"] });
	app.enableCors({ origin: configService.get<string>("CORS_ORIGIN") });

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	await app.listen(port);

	console.log(`🚀 Сервер успешно запущен на порту ${port}`);
}
bootstrap();
