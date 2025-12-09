import { IsMongoId, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class LikeExamDto {
  @IsMongoId()
  readonly user_id: string;

  @IsMongoId()
  readonly exam_id: string;

  /** 0 = like (tạo), 1 = dislike (xóa) */
  @IsIn([0, 1])
  @Type(() => Number) // chuyển string → number nếu truyền qua query/form
  readonly is_liked: number;
}
