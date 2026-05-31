import { Expose } from "class-transformer";

export class WorkTypeResponseDto {
	@Expose()
	id: string;

	@Expose()
	name: string;

	@Expose()
	isActive: boolean;
}
