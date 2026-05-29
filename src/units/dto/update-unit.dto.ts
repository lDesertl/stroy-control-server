import {
	IsBoolean,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
} from "class-validator";

export class UpdateUnitDto {
	@MaxLength(255)
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsOptional()
	@IsBoolean()
	@IsNotEmpty()
	isActive: boolean;
}
