import { Expose, Type } from "class-transformer";

import { WorkLogEntryResponseDto } from "./work-log-entry-response.dto";

export class WorkLogEntriesListMetaDto {
	@Expose()
	page: number;

	@Expose()
	limit: number;

	@Expose()
	total: number;

	@Expose()
	totalPages: number;
}

export class WorkLogEntriesListResponseDto {
	@Expose()
	@Type(() => WorkLogEntryResponseDto)
	data: WorkLogEntryResponseDto[];

	@Expose()
	@Type(() => WorkLogEntriesListMetaDto)
	meta: WorkLogEntriesListMetaDto;
}
