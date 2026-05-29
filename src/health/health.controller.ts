import { Controller, Get, HttpException, HttpStatus } from "@nestjs/common";

// biome-ignore lint/style/useImportType: <не тип>
import { PrismaService } from "../prisma/prisma.service";

@Controller("health")
export class HealthController {
	constructor(private readonly prisma: PrismaService) {}

	@Get()
	async check() {
		try {
			await this.prisma.$queryRaw`SELECT 1`;

			return {
				status: "ok",
				timestamp: new Date().toISOString(),
			};
		} catch {
			throw new HttpException(
				{
					status: "down",
					error: "Database connection failed",
					timestamp: new Date().toISOString(),
				},
				HttpStatus.SERVICE_UNAVAILABLE,
			);
		}
	}
}
