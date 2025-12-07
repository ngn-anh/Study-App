import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubjectDocument = Subject & Document;

@Schema({ collection: 'subjects', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Subject {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    code: string;

    @Prop()
    description?: string;

    @Prop()
    image?: string;

    @Prop({ type: Date })
    deleted_at?: Date;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
