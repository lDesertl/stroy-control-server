import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from "@nestjs/common";

import type { CreateWorkTypeDto } from "./dto/create-work-type.dto";
import type { UpdateWorkTypeDto } from "./dto/update-work-type.dto";
// biome-ignore lint/style/useImportType: не тип
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "../../generated/prisma/client";
import { WORK_TYPE_ERROR_MESSAGES } from "./work-types.constants";
import { PRISMA_ERROR_CODES } from "src/common/prisma.constants";

@Injectable()
export class WorkTypesService {
	private readonly logger = new Logger(WorkTypesService.name);

	constructor(private readonly prisma: PrismaService) {}
	async create(createWorkTypeDto: CreateWorkTypeDto) {
		try {
			const workType = await this.prisma.workType.create({
				data: createWorkTypeDto,
			});
			return workType;
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION
			) {
				throw new ConflictException(
					WORK_TYPE_ERROR_MESSAGES.WORK_TYPE_ALREADY_EXISTS,
				);
			}
			this.logger.error(
				WORK_TYPE_ERROR_MESSAGES.WORK_TYPE_CREATION_FAILED,
				error,
			);
			throw new InternalServerErrorException(
				WORK_TYPE_ERROR_MESSAGES.WORK_TYPE_CREATION_FAILED,
			);
		}
	}

	async findAll() {
		try {
			const workTypes = await this.prisma.workType.findMany();
			return workTypes;
		} catch (error) {
			this.logger.error(
				WORK_TYPE_ERROR_MESSAGES.WORK_TYPES_FETCH_FAILED,
				error,
			);
			throw new InternalServerErrorException(
				WORK_TYPE_ERROR_MESSAGES.WORK_TYPES_FETCH_FAILED,
			);
		}
	}

	async findAllActive() {
		try {
			const workTypes = await this.prisma.workType.findMany({
				where: {
					isActive: true,
				},
			});
			return workTypes;
		} catch (error) {
			this.logger.error(
				WORK_TYPE_ERROR_MESSAGES.WORK_TYPES_FETCH_FAILED,
				error,
			);
			throw new InternalServerErrorException(
				WORK_TYPE_ERROR_MESSAGES.WORK_TYPES_FETCH_FAILED,
			);
		}
	}

	async findOne(id: string) {
		try {
			const workType = await this.prisma.workType.findUniqueOrThrow({
				where: {
					id,
				},
			});
			return workType;
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === PRISMA_ERROR_CODES.NOT_FOUND
			) {
				throw new NotFoundException(
					WORK_TYPE_ERROR_MESSAGES.WORK_TYPE_NOT_FOUND,
				);
			}
			this.logger.error(
				WORK_TYPE_ERROR_MESSAGES.WORK_TYPE_RETRIEVAL_FAILED,
				error,
			);
			throw new InternalServerErrorException(
				WORK_TYPE_ERROR_MESSAGES.WORK_TYPE_RETRIEVAL_FAILED,
			);
		}
	}

	async update(id: string, updateWorkTypeDto: UpdateWorkTypeDto) {
		try {
			const workType = await this.prisma.workType.update({
				where: {
					id,
				},
				data: updateWorkTypeDto,
			});
			return workType;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === PRISMA_ERROR_CODES.NOT_FOUND) {
					throw new NotFoundException(
						WORK_TYPE_ERROR_MESSAGES.WORK_TYPE_NOT_FOUND,
					);
				}
				if (error.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION) {
					throw new ConflictException(
						WORK_TYPE_ERROR_MESSAGES.WORK_TYPE_ALREADY_EXISTS,
					);
				}
			}
			this.logger.error(
				WORK_TYPE_ERROR_MESSAGES.WORK_TYPE_UPDATE_FAILED,
				error,
			);
			throw new InternalServerErrorException(
				WORK_TYPE_ERROR_MESSAGES.WORK_TYPE_UPDATE_FAILED,
			);
		}
	}

	async remove(id: string) {
		try {
			const workType = await this.prisma.workType.delete({
				where: {
					id,
				},
			});
			return { action: "deleted" as const, data: workType };
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === PRISMA_ERROR_CODES.NOT_FOUND) {
					throw new NotFoundException(
						WORK_TYPE_ERROR_MESSAGES.WORK_TYPE_NOT_FOUND,
					);
				}
				if (
					error.code === PRISMA_ERROR_CODES.FOREIGN_KEY_CONSTRAINT_VIOLATION
				) {
					try {
						const workType = await this.prisma.workType.update({
							where: {
								id,
							},
							data: {
								isActive: false,
							},
						});
						return { action: "deactivated" as const, data: workType };
					} catch (deactivateError) {
						this.logger.error(
							WORK_TYPE_ERROR_MESSAGES.WORK_TYPE_DEACTIVATION_FAILED,
							deactivateError,
						);
						throw new InternalServerErrorException(
							WORK_TYPE_ERROR_MESSAGES.WORK_TYPE_DEACTIVATION_FAILED,
						);
					}
				}
			}
			this.logger.error(
				WORK_TYPE_ERROR_MESSAGES.WORK_TYPE_DELETION_FAILED,
				error,
			);
			throw new InternalServerErrorException(
				WORK_TYPE_ERROR_MESSAGES.WORK_TYPE_DELETION_FAILED,
			);
		}
	}
}
