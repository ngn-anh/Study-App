import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class GetSubjectsByClassDto {
    @ApiProperty({
        description: 'ID của lớp học',
        example: '6908a903bc2ae0fd775ccab1'
    })
    @IsNotEmpty({ message: 'class_id không được để trống' })
    class_id: string;
}