import { Expose, Type } from "class-transformer";

import { WorkTypeResponseDto } from "./work-type-response.dto";

export class WorkTypeRemoveResponseDto {
	@Expose()
	action: "deleted" | "deactivated";

	@Expose()
	@Type(() => WorkTypeResponseDto)
	data: WorkTypeResponseDto;
}

