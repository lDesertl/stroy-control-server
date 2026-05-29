import {
	IsISO8601,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
	Matches,
	MaxLength,
} from "class-validator";

export class UpdateWorkLogEntryDto {
	@IsOptional()
	@IsISO8601({ strict: true })
	@IsNotEmpty()
	date: string;

	@IsOptional()
	@IsUUID()
	@IsNotEmpty()
	workTypeId: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	unitId: string;

	@IsOptional()
	@Matches(/^\d{1,9}(\.\d{0,3})?$/, { message: "code3" }) // 1-9 цифр до точки, 0-3 цифры после точки
	@MaxLength(13) // 12 цифр + точка
	@IsNotEmpty()
	volume: string;

	@IsOptional()
	@MaxLength(255)
	@IsString()
	@IsNotEmpty()
	performerName: string;
}
