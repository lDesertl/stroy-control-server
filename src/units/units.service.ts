import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from "@nestjs/common";

import type { CreateUnitDto } from "./dto/create-unit.dto";
import type { UpdateUnitDto } from "./dto/update-unit.dto";
// biome-ignore lint/style/useImportType: не тип
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "../../generated/prisma/client";

@Injectable()
export class UnitsService {
	private readonly logger = new Logger(UnitsService.name);
	constructor(private readonly prisma: PrismaService) {}

	async create(createUnitDto: CreateUnitDto) {
		try {
			const unit = await this.prisma.unit.create({
				data: createUnitDto,
			});
			return unit;
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === "P2002"
			) {
				throw new ConflictException("Юнит с таким именем уже существует");
			}
			this.logger.error("Ошибка при создании юнита:", error.stack);
			throw new InternalServerErrorException("Ошибка при создании юнита");
		}
	}

	async findAll() {
		try {
			const units = await this.prisma.unit.findMany();
			return units;
		} catch (error) {
			this.logger.error("Ошибка при получении юнитов:", error.stack);
			throw new InternalServerErrorException("Ошибка при получении юнитов");
		}
	}

	async findAllActive() {
		try {
			const units = await this.prisma.unit.findMany({
				where: {
					isActive: true,
				},
			});
			return units;
		} catch (error) {
			this.logger.error("Ошибка при получении активных юнитов:", error.stack);
			throw new InternalServerErrorException(
				"Ошибка при получении активных юнитов",
			);
		}
	}

	async findOne(id: string) {
		try {
			const unit = await this.prisma.unit.findUniqueOrThrow({
				where: {
					id,
				},
			});
			return unit;
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === "P2025"
			) {
				throw new NotFoundException("Юнит не найден");
			}
			this.logger.error("Ошибка при получении юнита:", error.stack);
			throw new InternalServerErrorException("Ошибка при получении юнита");
		}
	}

	async update(id: string, updateUnitDto: UpdateUnitDto) {
		try {
			const unit = await this.prisma.unit.update({
				where: {
					id,
				},
				data: updateUnitDto,
			});
			return unit;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === "P2025") {
					throw new NotFoundException("Юнит не найден");
				}
				if (error.code === "P2002") {
					throw new ConflictException("Юнит с таким именем уже существует");
				}
			}
			this.logger.error("Ошибка при обновлении юнита:", error.stack);
			throw new InternalServerErrorException("Ошибка при обновлении юнита");
		}
	}

	async remove(id: string) {
		try {
			const unit = await this.prisma.unit.delete({
				where: {
					id,
				},
			});
			return unit;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === "P2025") {
					throw new NotFoundException("Юнит не найден");
				}
				if (error.code === "P2003") {
					try {
						const unit = await this.prisma.unit.update({
							where: {
								id,
							},
							data: {
								isActive: false,
							},
						});
						return unit;
					} catch (deactivateError) {
						this.logger.error(
							"Ошибка при деактивации юнита:",
							deactivateError.stack,
						);
						throw new InternalServerErrorException(
							"Ошибка при деактивации юнита",
						);
					}
				}
			}
			this.logger.error("Ошибка при удалении юнита:", error.stack);
			throw new InternalServerErrorException("Ошибка при удалении юнита");
		}
	}
}
