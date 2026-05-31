import { Expose } from "class-transformer";

export class WorkLogEntryResponseDto {
	@Expose()
	id: string;

	@Expose()
	date: string;

	@Expose()
	workTypeId: string;

	@Expose()
	unitId: string;

	@Expose()
	volume: string;

	@Expose()
	performerName: string;
}
