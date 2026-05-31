import { Module } from "@nestjs/common";
import { WorkLogEntriesService } from "./work-log-entries.service";
import { WorkLogEntriesController } from "./work-log-entries.controller";

@Module({
	controllers: [WorkLogEntriesController],
	providers: [WorkLogEntriesService],
})
export class WorkLogEntriesModule {}
