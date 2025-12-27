import api from "./axios";

export const getBySubjectClass = async (classId: string, subjectId: string) => {
    const res = await api.get(`/subject-class`, {
        params: {
            class_id: classId,
            subject_id: subjectId
        }
    });
    return res.data;
};

// export const getClassesBySubject = (subjectId: string) => {
//     return api.get(`/subject-class`, {
//         params: {
//             class_id: classId,
//             subject_id: subjectId
//         }
//     });
// };