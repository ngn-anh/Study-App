import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
    SubjectClass,
    SubjectClassSchema,
} from 'src/subjects-classes/schemas/subjects-classes.schema';
import { SubjectsClassesController } from './subjects-classes.controller';
import { SubjectsClassesService } from './subjects-classes.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: SubjectClass.name, schema: SubjectClassSchema },
        ]),
    ],
    controllers: [SubjectsClassesController],
    providers: [SubjectsClassesService],
    exports: [SubjectsClassesService],
})
export class SubjectsClassesModule { }
