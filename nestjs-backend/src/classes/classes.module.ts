export const a='2';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { Class, ClassSchema } from './schemas/classes.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema },]),
    ],
    controllers: [ClassesController],
    providers: [ClassesService],
    exports: [ClassesService],
})
export class ClassesModule { }