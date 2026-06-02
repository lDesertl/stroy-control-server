import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	ParseUUIDPipe,
	ClassSerializerInterceptor,
	UseInterceptors,
	SerializeOptions,
} from "@nestjs/common";

// biome-ignore-start lint/style/useImportType: не типы
import { UnitsService } from "./units.service";
import { UpdateUnitDto } from "./dto/update-unit.dto";
import { CreateUnitDto } from "./dto/create-unit.dto";
import { UnitResponseDto } from "./dto/unit-response.dto";
import { UnitRemoveResponseDto } from "./dto/unit-remove-response.dto";
// biome-ignore-end lint/style/useImportType: не типы

@Controller("units")
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: UnitResponseDto, excludeExtraneousValues: true })
export class UnitsController {
	constructor(private readonly unitsService: UnitsService) {}

	@Post()
	create(@Body() createUnitDto: CreateUnitDto): Promise<UnitResponseDto> {
		return this.unitsService.create(createUnitDto);
	}

	@Get()
	findAll(): Promise<UnitResponseDto[]> {
		return this.unitsService.findAll();
	}

	@Get("active")
	findAllActive(): Promise<UnitResponseDto[]> {
		return this.unitsService.findAllActive();
	}

	@Get(":id")
	findOne(@Param("id", ParseUUIDPipe) id: string): Promise<UnitResponseDto> {
		return this.unitsService.findOne(id);
	}

	@Patch(":id")
	update(
		@Param("id", ParseUUIDPipe) id: string,
		@Body() updateUnitDto: UpdateUnitDto,
	): Promise<UnitResponseDto> {
		return this.unitsService.update(id, updateUnitDto);
	}

	@Delete(":id")
	@SerializeOptions({
		type: UnitRemoveResponseDto,
		excludeExtraneousValues: true,
	})
	remove(
		@Param("id", ParseUUIDPipe) id: string,
	): Promise<UnitRemoveResponseDto> {
		return this.unitsService.remove(id);
	}
}
