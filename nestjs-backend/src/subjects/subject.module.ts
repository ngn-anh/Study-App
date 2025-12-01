// subject.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { Subject, SubjectSchema } from './schema/subjects.schema';
import { SubjectClass, SubjectClassSchema } from 'src/subject-classes/schemas/subject-class.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subject.name, schema: SubjectSchema },
      { name: SubjectClass.name, schema: SubjectClassSchema },
    ]),
  ],
  controllers: [SubjectController],
  providers: [SubjectService],
  exports: [SubjectService]
})
export class SubjectModule {}
