import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassesController } from './class.controller';
import { ClassesService } from './class.service';
import { Class, ClassSchema } from './schemas/classes.schema';
import { SubjectClass, SubjectClassSchema } from 'src/subject-classes/schemas/subject-class.schema';
import { Subject, SubjectSchema } from 'src/subjects/schema/subjects.schema';

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
export class ClassModule {}
