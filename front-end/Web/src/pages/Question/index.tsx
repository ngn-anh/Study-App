import ListQuestionModal from "./component/ListQuestion";

interface Props {
    open: boolean;
    examId?: string;
    onClose: () => void;
}
const QuestionModal = (props: Props) => {
    const { open, examId, onClose } = props;
    return (
        <ListQuestionModal
            open={open}
            examId={examId}
            onClose={onClose}
        />
    );
};

export default QuestionModal;