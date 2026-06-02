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
import { UNIT_ERROR_MESSAGES } from "./units.constants";
import { PRISMA_ERROR_CODES } from "src/common/prisma.constants";

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
				error.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION
			) {
				throw new ConflictException(UNIT_ERROR_MESSAGES.UNIT_ALREADY_EXISTS);
			}
			this.logger.error(UNIT_ERROR_MESSAGES.UNIT_CREATION_FAILED, error);
			throw new InternalServerErrorException(
				UNIT_ERROR_MESSAGES.UNIT_CREATION_FAILED,
			);
		}
	}

	async findAll() {
		try {
			const units = await this.prisma.unit.findMany();
			return units;
		} catch (error) {
			this.logger.error(UNIT_ERROR_MESSAGES.UNITS_FETCH_FAILED, error);
			throw new InternalServerErrorException(
				UNIT_ERROR_MESSAGES.UNITS_FETCH_FAILED,
			);
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
			this.logger.error(UNIT_ERROR_MESSAGES.UNITS_FETCH_FAILED, error);
			throw new InternalServerErrorException(
				UNIT_ERROR_MESSAGES.UNITS_FETCH_FAILED,
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
				error.code === PRISMA_ERROR_CODES.NOT_FOUND
			) {
				throw new NotFoundException(UNIT_ERROR_MESSAGES.UNIT_NOT_FOUND);
			}
			this.logger.error(UNIT_ERROR_MESSAGES.UNIT_RETRIEVAL_FAILED, error);
			throw new InternalServerErrorException(
				UNIT_ERROR_MESSAGES.UNIT_RETRIEVAL_FAILED,
			);
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
				if (error.code === PRISMA_ERROR_CODES.NOT_FOUND) {
					throw new NotFoundException(UNIT_ERROR_MESSAGES.UNIT_NOT_FOUND);
				}
				if (error.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION) {
					throw new ConflictException(UNIT_ERROR_MESSAGES.UNIT_ALREADY_EXISTS);
				}
			}
			this.logger.error(UNIT_ERROR_MESSAGES.UNIT_UPDATE_FAILED, error);
			throw new InternalServerErrorException(
				UNIT_ERROR_MESSAGES.UNIT_UPDATE_FAILED,
			);
		}
	}

	async remove(id: string) {
		try {
			const unit = await this.prisma.unit.delete({
				where: {
					id,
				},
			});
			return { action: "deleted" as const, data: unit };
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === PRISMA_ERROR_CODES.NOT_FOUND) {
					throw new NotFoundException(UNIT_ERROR_MESSAGES.UNIT_NOT_FOUND);
				}
				if (
					error.code === PRISMA_ERROR_CODES.FOREIGN_KEY_CONSTRAINT_VIOLATION
				) {
					try {
						const unit = await this.prisma.unit.update({
							where: {
								id,
							},
							data: {
								isActive: false,
							},
						});
						return { action: "deactivated" as const, data: unit };
					} catch (deactivateError) {
						this.logger.error(
							UNIT_ERROR_MESSAGES.UNIT_DEACTIVATION_FAILED,
							deactivateError,
						);
						throw new InternalServerErrorException(
							UNIT_ERROR_MESSAGES.UNIT_DEACTIVATION_FAILED,
						);
					}
				}
			}
			this.logger.error(UNIT_ERROR_MESSAGES.UNIT_DELETION_FAILED, error);
			throw new InternalServerErrorException(
				UNIT_ERROR_MESSAGES.UNIT_DELETION_FAILED,
			);
		}
	}
}
