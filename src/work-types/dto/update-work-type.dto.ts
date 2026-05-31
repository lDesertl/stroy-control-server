import { PartialType } from "@nestjs/mapped-types";
import { CreateWorkTypeDto } from "./create-work-type.dto";
import { IsBoolean, IsOptional } from "class-validator";

export class UpdateWorkTypeDto extends PartialType(CreateWorkTypeDto) {
	@IsOptional()
	@IsBoolean()
	isActive: boolean;
}
