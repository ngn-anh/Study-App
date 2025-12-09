// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// export type SubjectDocument = Subject & Document;

// @Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
// export class Subject {
//   @Prop({ required: true })
//   name: string;

//   @Prop({ required: true, unique: true })
//   code: string;

//   @Prop()
//   description?: string;

//   @Prop()
//   image?: string;

//   @Prop({ default: 1 }) // 1: active, 2: inactive
//   status: number;

//   @Prop({ type: Date })
//   deleted_at?: Date;
// }

// export const SubjectSchema = SchemaFactory.createForClass(Subject);
