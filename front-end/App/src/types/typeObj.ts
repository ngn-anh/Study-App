export type Subject = {
    id: string;
    name: string;
    image: any;
    description: string,
};

export type Exam = {
    id: string,
    subjectId: string,
    name: string,
    description: string,
    type: string,
    image: string,
    difficulty: Number,
    duration: Number,
    number: Number,
    createdAt: string,
    updatedAt: string,
    deletedAt: string,
};