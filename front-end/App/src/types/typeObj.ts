export type Subject = {
    id: string;
    name: string;
    image: any;
    description: string,
};

export type Exam = {
    id: string,
    subjectId?: string,
    name?: string,
    description?: string,
    type?: string,
    image?: string,
    difficulty?: number,
    duration?: number,
    number?: number,
    // participants?: number,
    // likes?: number;
    createdAt?: string,
    updatedAt?: string,
    deletedAt?: string,
};