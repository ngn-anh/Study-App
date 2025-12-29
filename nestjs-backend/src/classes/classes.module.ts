import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { Class, ClassSchema } from './schemas/classes.schema';
import {
  SubjectClass,
  SubjectClassSchema,
} from 'src/subjects-classes/schemas/subjects-classes.schema';
import { Subject, SubjectSchema } from 'src/subjects/schemas/subjects.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Class.name, schema: ClassSchema },
      { name: SubjectClass.name, schema: SubjectClassSchema },
      { name: Subject.name, schema: SubjectSchema },
    ]),
  ],
  controllers: [ClassesController],
  providers: [ClassesService],
  exports: [ClassesService],
})
export class ClassesModule {}
