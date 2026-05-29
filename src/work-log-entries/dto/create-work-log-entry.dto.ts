import {
	IsISO8601,
	IsNotEmpty,
	IsString,
	IsUUID,
	Matches,
	MaxLength,
} from "class-validator";

export class CreateWorkLogEntryDto {
	@IsISO8601({ strict: true })
	@IsNotEmpty()
	date: string;

	@IsUUID()
	@IsNotEmpty()
	workTypeId: string;

	@IsUUID()
	@IsNotEmpty()
	unitId: string;

	@Matches(/^\d{1,9}(\.\d{0,3})?$/, { message: "code3" }) // 1-9 цифр до точки, 0-3 цифры после точки
	@MaxLength(13) // 12 цифр + точка
	@IsNotEmpty()
	volume: string;

	@MaxLength(255)
	@IsString()
	@IsNotEmpty()
	performerName: string;
}
