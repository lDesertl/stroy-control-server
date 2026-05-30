import { Expose } from "class-transformer";

export class UnitResponseDto {
	@Expose()
	id: string;

	@Expose()
	name: string;

	@Expose()
	isActive: boolean;
}
