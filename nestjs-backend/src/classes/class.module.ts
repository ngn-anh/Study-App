import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassesController } from './class.controller';
import { ClassesService } from './class.service';
import { Class, ClassSchema } from './schemas/classes.schema';
import { SubjectClass, SubjectClassSchema } from 'src/subject-classes/schemas/subject-class.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Class.name, schema: ClassSchema },
      { name: SubjectClass.name, schema: SubjectClassSchema },
    ]),
  ],
  controllers: [ClassesController],
  providers: [ClassesService],
  exports: [ClassesService],
})
export class ClassModule {}
