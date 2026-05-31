import { PartialType } from "@nestjs/mapped-types";
import { CreateWorkLogEntryDto } from "./create-work-log-entry.dto";

export class UpdateWorkLogEntryDto extends PartialType(CreateWorkLogEntryDto) {}
