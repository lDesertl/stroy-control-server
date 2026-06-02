import { Type } from "class-transformer";
import { IsIn, IsInt, IsISO8601, IsOptional, Max, Min } from "class-validator";

export class GetWorkLogEntriesQueryDto {
	@IsOptional()
	@IsISO8601({ strict: true })
	dateFrom?: string;

	@IsOptional()
	@IsISO8601({ strict: true })
	dateTo?: string;

	@IsOptional()
	@IsIn(["asc", "desc"])
	sortOrder?: "asc" | "desc";

	@IsOptional()
	@IsInt()
	@Min(1)
	@Type(() => Number)
	page?: number;

	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(200)
	@Type(() => Number)
	limit?: number;
}
