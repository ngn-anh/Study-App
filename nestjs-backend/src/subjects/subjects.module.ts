import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { Class, ClassSchema } from 'src/classes/schemas/classes.schema';
import { Subject, SubjectSchema } from './schemas/subjects.schema';
import { SubjectClass, SubjectClassSchema } from 'src/subjects-classes/schemas/subjects-classes.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Subject.name, schema: SubjectSchema },
            { name: Class.name, schema: ClassSchema },
            { name: SubjectClass.name, schema: SubjectClassSchema },
        ]),
    ],
    controllers: [SubjectsController],
    providers: [SubjectsService],
})
export class SubjectsModule { }