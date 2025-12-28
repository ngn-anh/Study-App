import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class GetQuestionByIdDto {
  @ApiProperty({
    description: 'Lấy chi tiết câu hỏi theo Id',
    example: '6950cbc80d8913d274497449',
  })
  @IsMongoId()
  id: string;
}
