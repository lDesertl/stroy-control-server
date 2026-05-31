import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseInterceptors,
	ClassSerializerInterceptor,
	SerializeOptions,
	ParseUUIDPipe,
} from "@nestjs/common";

// biome-ignore-start lint/style/useImportType: не типы
import { WorkLogEntriesService } from "./work-log-entries.service";
import { CreateWorkLogEntryDto } from "./dto/create-work-log-entry.dto";
import { UpdateWorkLogEntryDto } from "./dto/update-work-log-entry.dto";
import { WorkLogEntryResponseDto } from "./dto/work-log-entry-response.dto";
// biome-ignore-end lint/style/useImportType: не типы

@Controller("work-log-entries")
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
	type: WorkLogEntryResponseDto,
	excludeExtraneousValues: true,
})
export class WorkLogEntriesController {
	constructor(private readonly workLogEntriesService: WorkLogEntriesService) {}

	@Post()
	create(
		@Body() createWorkLogEntryDto: CreateWorkLogEntryDto,
	): Promise<WorkLogEntryResponseDto> {
		return this.workLogEntriesService.create(createWorkLogEntryDto);
	}

	@Get()
	findAll(): Promise<WorkLogEntryResponseDto[]> {
		return this.workLogEntriesService.findAll();
	}

	@Get(":id")
	findOne(
		@Param("id", ParseUUIDPipe) id: string,
	): Promise<WorkLogEntryResponseDto> {
		return this.workLogEntriesService.findOne(id);
	}

	@Patch(":id")
	update(
		@Param("id", ParseUUIDPipe) id: string,
		@Body() updateWorkLogEntryDto: UpdateWorkLogEntryDto,
	): Promise<WorkLogEntryResponseDto> {
		return this.workLogEntriesService.update(id, updateWorkLogEntryDto);
	}

	@Delete(":id")
	remove(
		@Param("id", ParseUUIDPipe) id: string,
	): Promise<WorkLogEntryResponseDto> {
		return this.workLogEntriesService.remove(id);
	}
}
