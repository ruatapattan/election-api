import { IsBoolean } from "class-validator";

export class ToggleElectionDto {
    @IsBoolean()
    enable: boolean
}

