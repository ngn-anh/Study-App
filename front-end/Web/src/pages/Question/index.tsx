import type { ImportQuestion } from "../../types/typeObj";
import ListQuestionModal from "./component/ListQuestion";

interface Props {
    open: boolean;
    examId?: string;
    onClose: () => void;
    importQuestions: ImportQuestion[];
    setImportQuestions: React.Dispatch<React.SetStateAction<ImportQuestion[]>>;
}
const QuestionModal = (props: Props) => {
    const { open, examId, onClose, importQuestions, setImportQuestions } = props;
    return (
        <ListQuestionModal
            open={open}
            examId={examId}
            onClose={onClose}
            importQuestions={importQuestions}
            setImportQuestions={setImportQuestions}
        />
    );
};

export default QuestionModal;