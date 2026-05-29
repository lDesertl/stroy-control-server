import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateUnitDto {
	@MaxLength(255)
	@IsString()
	@IsNotEmpty()
	name: string;
}
