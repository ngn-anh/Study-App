import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetClassesBySubjectDto {
  @ApiProperty({
    description: 'ID của môn học',
    example: '6908a903bc2ae0fd775ccab6',
  })
  @IsNotEmpty({ message: 'subject_id không được để trống' })
  subject_id: string;
}
