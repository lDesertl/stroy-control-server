import { Expose, Type } from "class-transformer";

import { UnitResponseDto } from "./unit-response.dto";

export class UnitRemoveResponseDto {
	@Expose()
	action: "deleted" | "deactivated";

	@Expose()
	@Type(() => UnitResponseDto)
	data: UnitResponseDto;
}

