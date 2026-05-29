import {
	IsBoolean,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
} from "class-validator";

export class UpdateWorkTypeDto {
	@MaxLength(255)
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsOptional()
	@IsBoolean()
	@IsNotEmpty()
	isActive: boolean;
}
