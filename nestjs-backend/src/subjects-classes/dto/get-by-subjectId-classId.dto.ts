import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetBySubjectClassDto {
    @ApiProperty({
        description: 'ID của lớp học',
        example: '6908a903bc2ae0fd775ccab1',
    })
    @IsNotEmpty({ message: 'class_id không được để trống' })
    class_id: string;

    @ApiProperty({
        description: 'ID của môn học',
        example: '6908a903bc2ae0fd775ccab1',
    })
    @IsNotEmpty({ message: 'subject_id không được để trống' })
    subject_id: string;
}
