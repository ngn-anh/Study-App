import './index.less';
import {
    Modal,
    Table,
    Tag,
    Typography,
    ConfigProvider,
    Tooltip,
    message,
    Button,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import viVN from "antd/locale/vi_VN";
import type {
    Answer,
    Exam,
    ImportQuestion,
    Question,
} from "../../../../types/typeObj";
import { createManyQuestion, getQuestionsByExam } from "../../../../api/question";
import PermissionGuard from "../../../../components/PermissionGuard";
import { NotePencil, Trash } from "phosphor-react";
import CreateUpdateQuestionModal from "../CreateUpdateQuestionDrawer";
import CustomModal from "../../../../component/CustomModal";
import MathCell from "../../../../component/MathCell";
import { MathJaxContext } from "better-react-mathjax";
import { mathJaxConfig } from "../../../../utils/latex";

const { Paragraph } = Typography;

interface Props {
    open: boolean;
    examId?: string;
    onClose: () => void;

    /** IMPORT */
    importQuestions: ImportQuestion[];
    setImportQuestions: React.Dispatch<
        React.SetStateAction<ImportQuestion[]>
    >;
}

const PAGINATION = {
    PAGE_DEFAULT: 1,
    LIMIT: 10,
};

const ListQuestionModal = ({
    open,
    examId,
    onClose,
    importQuestions,
    setImportQuestions,
}: Props) => {
    const [loading, setLoading] = useState(false);
    const [examInfo, setExamInfo] = useState<Exam>();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [pagination, setPagination] = useState({
        current: PAGINATION.PAGE_DEFAULT,
        pageSize: PAGINATION.LIMIT,
    });

    /** CRUD DB */
    const [openQuestionModal, setOpenQuestionModal] = useState(false);
    const [questionId, setQuestionId] = useState<string | undefined>();
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteQuestionId, setDeleteQuestionId] =
        useState<string | undefined>();

    /** IMPORT */
    const [editingImportQuestion, setEditingImportQuestion] =
        useState<ImportQuestion | undefined>(undefined);
    const [editingImportIndex, setEditingImportIndex] =
        useState<number | null>(null);
    const isImportMode = importQuestions.length > 0;

    const fetchDataQuestion = async (id: string) => {
        setLoading(true);
        try {
            const res = await getQuestionsByExam(id);
            if (res?.success) {
                setExamInfo(res.data.exam);
                setQuestions(res.data.questions || []);
            } else {
                setQuestions([]);
            }
        } catch {
            setQuestions([]);
        } finally {
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     if (!open || !examId) return;
    //     fetchDataQuestion(examId);
    // }, [open, examId]);
    useEffect(() => {
        if (open && examId && !isImportMode) {
            fetchDataQuestion(examId);
        }
    }, [open, examId, isImportMode]);

    const handleClose = () => {
        setExamInfo(undefined);
        setQuestions([]);
        setPagination({
            current: PAGINATION.PAGE_DEFAULT,
            pageSize: PAGINATION.LIMIT,
        });
        onClose();
    };

    /** DB */
    const handleAddQuestion = () => {
        setQuestionId(undefined);
        setEditingImportQuestion(undefined);
        setEditingImportIndex(null);
        setOpenQuestionModal(true);
    };

    const handleEditQuestion = (id: string) => {
        setQuestionId(id);
        setEditingImportQuestion(undefined);
        setOpenQuestionModal(true);
    };

    const handleDeleteQuestion = (id: string) => {
        setDeleteQuestionId(id);
        setOpenDelete(true);
    };

    const handleConfirmDelete = async () => {
        try {
            if (!deleteQuestionId) return;
            // await deleteQuestion(deleteQuestionId);
            message.success("Xoá câu hỏi thành công");
            setOpenDelete(false);
            setDeleteQuestionId(undefined);
            fetchDataQuestion(examId!);
        } catch {
            message.error("Xoá câu hỏi thất bại");
        }
    };

    /** IMPORT handlers */
    const handleEditImportQuestion = (row: any) => {
        setEditingImportQuestion(row as ImportQuestion);
        setEditingImportIndex(row.__importIndex);
        setQuestionId(undefined);
        setOpenQuestionModal(true);
    };

    const handleDeleteImportQuestion = (index: number) => {
        setImportQuestions(prev =>
            prev.filter((_, i) => i !== index)
        );
        message.success("Đã xoá câu hỏi import");
    };

    const handleConfirmImport = async () => {
        console.log("examId: ", examId);
        if (!examId) {
            message.error("Không thể lấy được thông tin đề thi");
            return;
        }

        if (!importQuestions || importQuestions.length === 0) {
            message.warning("Không có câu hỏi để import");
            return;
        }

        try {
            const payload = {
                exam_id: examId,
                questions: importQuestions.map(q => ({
                    description: q.description,
                    difficulty: q.difficulty,
                    section: q.section,
                    answers: (q.answers || []).map(a => ({
                        description:
                            typeof a.description === "string"
                                ? a.description
                                : JSON.stringify(a.description),
                        is_correct: a.is_correct,
                        explanation: a.explanation,
                    })),
                })),
            };

            const res = await createManyQuestion(payload);
            if (res.success) {
                message.success("Import câu hỏi trong file excel thành công");
                setImportQuestions([]);
                fetchDataQuestion(examId);
                // handleClose();
            }

        } catch (err: any) {
            console.error(err);
            message.error("Import câu hỏi trong file excel thất bại");
        }
    };

    /** GỘP DATA */
    // const tableData = useMemo(() => {
    //     if (!isImportMode) return questions;

    //     return importQuestions.map((q, index) => ({
    //         ...q,
    //         _id: `import-${index}`,      // key cho table
    //         __importIndex: index,        // dùng cho edit/delete
    //         isImported: true,
    //     }));
    // }, [questions, importQuestions, isImportMode]);

    const tableData = useMemo(() => {
        if (!isImportMode) return questions;

        return importQuestions.map((q, index) => ({
            ...q,
            _id: `import-${index}`,
            __importIndex: index,
            isImported: true,
        }));
    }, [questions, importQuestions, isImportMode]);

    const columns = [
        {
            title: "STT",
            width: 70,
            align: "center" as const,
            render: (_: any, __: any, index: number) => {
                const { current, pageSize } = pagination;
                return (current - 1) * pageSize + index + 1;
            },
        },
        {
            title: "Câu hỏi",
            dataIndex: "description",
            render: (_: any, row: any) => (
                <Paragraph
                    style={{ marginBottom: 0 }}
                    ellipsis={{
                        rows: 2,
                        expandable: true,
                        symbol: "Xem thêm",
                    }}
                >
                    {/* {row.isImported && (
                        <Tag color="orange" style={{ marginRight: 6 }}>
                            IMPORT
                        </Tag>
                    )} */}
                    <MathCell latex={row.description} />
                </Paragraph>
            ),
        },
        {
            title: "Độ khó",
            dataIndex: "difficulty",
            width: 100,
            align: "center" as const,
            render: (v: number) => {
                switch (v) {
                    case 1:
                        return <Tag color="green">Nhận biết</Tag>;
                    case 2:
                        return <Tag color="blue">Thông hiểu</Tag>;
                    case 3:
                        return <Tag color="orange">Vận dụng</Tag>;
                    case 4:
                        return <Tag color="red">Vận dụng cao</Tag>;
                    default:
                        return v;
                }
            },
        },
        {
            title: "Phần",
            dataIndex: "section",
            width: 70,
            align: "center",
        },
        {
            title: "Danh sách trả lời",
            dataIndex: "answers",
            width: 300,
            render: (answers: Answer[]) => {
                if (!answers || answers.length === 0) return "--";
                return (
                    <div className="answer-list-preview">
                        {answers.map((a, idx) => (
                            <Paragraph
                                key={idx}
                                style={{ marginBottom: 4 }}
                                className={a.is_correct ? "correct" : ""}
                            >
                                {String.fromCharCode(65 + idx)}.{" "}
                                {a.description}
                            </Paragraph>
                        ))}
                    </div>
                );
            },
        },
        {
            title: "Tác vụ",
            width: 100,
            fixed: "right",
            align: "center",
            render: (_: any, row: any) => (
                <div className="cpn-action">
                    <Tooltip title="Sửa">
                        <NotePencil
                            className="cursor-pointer"
                            color="#0c4299"
                            size={16}
                            onClick={() =>
                                isImportMode
                                    ? handleEditImportQuestion(row)
                                    : handleEditQuestion(row._id)
                            }
                        />
                    </Tooltip>

                    <Tooltip title="Xóa">
                        <Trash
                            className="cursor-pointer"
                            color="#d63b3b"
                            size={16}
                            onClick={() =>
                                isImportMode
                                    ? handleDeleteImportQuestion(row.__importIndex)
                                    : handleDeleteQuestion(row._id)
                            }
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <ConfigProvider locale={viVN}>
            <MathJaxContext version={3} config={mathJaxConfig}>
                <Modal
                    open={open}
                    onCancel={handleClose}
                    footer={null}
                    width={1500}
                    destroyOnClose
                    title={
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <span>
                                {examInfo
                                    ? `Danh sách câu hỏi – ${examInfo.name}`
                                    : "Danh sách câu hỏi"}
                            </span>
                            <div>
                                {isImportMode &&
                                    <PermissionGuard requiredPermissions="question.create">
                                        <Button
                                            type="primary"
                                            style={{ marginRight: 15 }}
                                            onClick={handleConfirmImport}
                                        >
                                            Xác nhận Import
                                        </Button>
                                    </PermissionGuard>
                                }
                                <PermissionGuard requiredPermissions="question.create">
                                    <Button
                                        type="primary"
                                        style={{ marginRight: 30 }}
                                        onClick={handleAddQuestion}
                                    >
                                        Thêm câu hỏi
                                    </Button>
                                </PermissionGuard>
                            </div>
                        </div>
                    }
                >
                    <Table
                        bordered
                        size="middle"
                        rowKey="_id"
                        loading={loading}
                        columns={columns}
                        dataSource={tableData}
                        pagination={{
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            onChange: (current, pageSize) => {
                                setPagination({
                                    current,
                                    pageSize:
                                        pageSize || pagination.pageSize,
                                });
                            },
                        }}
                    />

                    <CreateUpdateQuestionModal
                        open={openQuestionModal}
                        examId={examId}
                        questionId={questionId}
                        importQuestion={editingImportQuestion ?? undefined}
                        onImportUpdated={(updated) => {
                            if (editingImportIndex === null) return;

                            setImportQuestions(prev =>
                                prev.map((q, i) =>
                                    i === editingImportIndex ? updated : q
                                )
                            );
                        }}
                        onClose={() => {
                            setOpenQuestionModal(false);
                            setQuestionId(undefined);
                            setEditingImportQuestion(undefined);
                            setEditingImportIndex(null);
                            if (examId) fetchDataQuestion(examId);
                        }}
                    />

                    <CustomModal
                        open={openDelete}
                        title="Xóa câu hỏi"
                        type="warning"
                        content={
                            <>Bạn có chắc chắn muốn xoá câu hỏi này không?</>
                        }
                        handleOk={handleConfirmDelete}
                        handleCancel={() => {
                            setOpenDelete(false);
                            setDeleteQuestionId(undefined);
                        }}
                    />
                </Modal>
            </MathJaxContext>
        </ConfigProvider>
    );
};

export default ListQuestionModal;
