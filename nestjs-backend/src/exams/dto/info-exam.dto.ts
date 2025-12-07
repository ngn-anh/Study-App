import { IsMongoId, IsOptional } from 'class-validator';

export class InfoExamDto {
    @IsOptional()
    @IsMongoId()
    readonly user_id?: string;
}