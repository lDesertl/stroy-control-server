import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateWorkTypeDto {
	@MaxLength(255)
	@IsString()
	@IsNotEmpty()
	name: string;
}
