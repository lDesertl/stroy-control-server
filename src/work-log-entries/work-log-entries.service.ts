import {
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from "@nestjs/common";

import type { CreateWorkLogEntryDto } from "./dto/create-work-log-entry.dto";
import type { UpdateWorkLogEntryDto } from "./dto/update-work-log-entry.dto";
// biome-ignore lint/style/useImportType: не тип
import { PrismaService } from "src/prisma/prisma.service";
import { WORK_LOG_ENTRY_ERROR_MESSAGES } from "./work-log-entries.constants";

@Injectable()
export class WorkLogEntriesService {
	private readonly logger = new Logger(WorkLogEntriesService.name);
	constructor(private readonly prisma: PrismaService) {}

	private async findActiveOrThrow(id: string) {
		const workLogEntry = await this.prisma.workLogEntry.findFirst({
			where: {
				id,
				deletedAt: null,
			},
		});
		if (!workLogEntry) {
			throw new NotFoundException(
				WORK_LOG_ENTRY_ERROR_MESSAGES.WORK_LOG_ENTRY_NOT_FOUND,
			);
		}
		return workLogEntry;
	}

	private toResponse(workLogEntry: {
		id: string;
		date: Date;
		workTypeId: string;
		unitId: string;
		volume: { toString(): string };
		performerName: string;
	}) {
		return {
			id: workLogEntry.id,
			date: workLogEntry.date.toISOString().slice(0, 10),
			workTypeId: workLogEntry.workTypeId,
			unitId: workLogEntry.unitId,
			volume: workLogEntry.volume.toString(),
			performerName: workLogEntry.performerName,
		};
	}

	async create(createWorkLogEntryDto: CreateWorkLogEntryDto) {
		try {
			const workLogEntry = await this.prisma.workLogEntry.create({
				data: {
					...createWorkLogEntryDto,
					...(createWorkLogEntryDto.date && {
						date: new Date(createWorkLogEntryDto.date),
					}),
				},
			});
			return this.toResponse(workLogEntry);
		} catch (error) {
			this.logger.error(
				WORK_LOG_ENTRY_ERROR_MESSAGES.WORK_LOG_ENTRY_CREATION_FAILED,
				error,
			);
			throw new InternalServerErrorException(
				WORK_LOG_ENTRY_ERROR_MESSAGES.WORK_LOG_ENTRY_CREATION_FAILED,
			);
		}
	}

	async findAll() {
		try {
			const workLogEntries = await this.prisma.workLogEntry.findMany({
				where: {
					deletedAt: null,
				},
			});
			return workLogEntries.map((entry) => this.toResponse(entry));
		} catch (error) {
			this.logger.error(
				WORK_LOG_ENTRY_ERROR_MESSAGES.WORK_LOG_ENTRIES_FETCH_FAILED,
				error,
			);
			throw new InternalServerErrorException(
				WORK_LOG_ENTRY_ERROR_MESSAGES.WORK_LOG_ENTRIES_FETCH_FAILED,
			);
		}
	}

	async findOne(id: string) {
		try {
			return this.toResponse(await this.findActiveOrThrow(id));
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error;
			}
			this.logger.error(
				WORK_LOG_ENTRY_ERROR_MESSAGES.WORK_LOG_ENTRY_RETRIEVAL_FAILED,
				error,
			);
			throw new InternalServerErrorException(
				WORK_LOG_ENTRY_ERROR_MESSAGES.WORK_LOG_ENTRY_RETRIEVAL_FAILED,
			);
		}
	}

	async update(id: string, updateWorkLogEntryDto: UpdateWorkLogEntryDto) {
		try {
			await this.findActiveOrThrow(id);

			const workLogEntry = await this.prisma.workLogEntry.update({
				where: {
					id,
				},
				data: {
					...updateWorkLogEntryDto,
					...(updateWorkLogEntryDto.date && {
						date: new Date(updateWorkLogEntryDto.date),
					}),
				},
			});
			return this.toResponse(workLogEntry);
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error;
			}
			this.logger.error(
				WORK_LOG_ENTRY_ERROR_MESSAGES.WORK_LOG_ENTRY_UPDATE_FAILED,
				error,
			);
			throw new InternalServerErrorException(
				WORK_LOG_ENTRY_ERROR_MESSAGES.WORK_LOG_ENTRY_UPDATE_FAILED,
			);
		}
	}

	async remove(id: string) {
		try {
			await this.findActiveOrThrow(id);

			const workLogEntry = await this.prisma.workLogEntry.update({
				where: {
					id,
				},
				data: {
					deletedAt: new Date(),
				},
			});
			return this.toResponse(workLogEntry);
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error;
			}
			this.logger.error(
				WORK_LOG_ENTRY_ERROR_MESSAGES.WORK_LOG_ENTRY_DELETION_FAILED,
				error,
			);
			throw new InternalServerErrorException(
				WORK_LOG_ENTRY_ERROR_MESSAGES.WORK_LOG_ENTRY_DELETION_FAILED,
			);
		}
	}
}
