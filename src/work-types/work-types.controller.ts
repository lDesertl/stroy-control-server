import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	ClassSerializerInterceptor,
	UseInterceptors,
	SerializeOptions,
	ParseUUIDPipe,
} from "@nestjs/common";

// biome-ignore-start lint/style/useImportType: не типы
import { WorkTypesService } from "./work-types.service";
import { CreateWorkTypeDto } from "./dto/create-work-type.dto";
import { UpdateWorkTypeDto } from "./dto/update-work-type.dto";
import { WorkTypeResponseDto } from "./dto/work-type-response.dto";
import { WorkTypeRemoveResponseDto } from "./dto/work-type-remove-response.dto";
// biome-ignore-end lint/style/useImportType: не типы

@Controller("work-types")
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: WorkTypeResponseDto, excludeExtraneousValues: true })
export class WorkTypesController {
	constructor(private readonly workTypesService: WorkTypesService) {}

	@Post()
	create(
		@Body() createWorkTypeDto: CreateWorkTypeDto,
	): Promise<WorkTypeResponseDto> {
		return this.workTypesService.create(createWorkTypeDto);
	}

	@Get()
	findAll(): Promise<WorkTypeResponseDto[]> {
		return this.workTypesService.findAll();
	}

	@Get("active")
	findAllActive(): Promise<WorkTypeResponseDto[]> {
		return this.workTypesService.findAllActive();
	}

	@Get(":id")
	findOne(
		@Param("id", ParseUUIDPipe) id: string,
	): Promise<WorkTypeResponseDto> {
		return this.workTypesService.findOne(id);
	}

	@Patch(":id")
	update(
		@Param("id", ParseUUIDPipe) id: string,
		@Body() updateWorkTypeDto: UpdateWorkTypeDto,
	): Promise<WorkTypeResponseDto> {
		return this.workTypesService.update(id, updateWorkTypeDto);
	}

	@Delete(":id")
	@SerializeOptions({
		type: WorkTypeRemoveResponseDto,
		excludeExtraneousValues: true,
	})
	remove(
		@Param("id", ParseUUIDPipe) id: string,
	): Promise<WorkTypeRemoveResponseDto> {
		return this.workTypesService.remove(id);
	}
}
