import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetClassByCodeDto {
    @ApiProperty({
        description: 'Mã code của lớp học',
        example: 'CLASS_10'
    })
    @IsNotEmpty({ message: 'Mã code không được để trống' })
    @IsString()
    code: string;
}