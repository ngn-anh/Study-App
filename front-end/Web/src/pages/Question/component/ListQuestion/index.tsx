import './index.less';
import { Modal, Table, Tag, Typography, ConfigProvider, Tooltip, message, Button } from "antd";
import { useEffect, useState } from "react";
import viVN from "antd/locale/vi_VN";
import type { Answer, Exam, Question } from "../../../../types/typeObj";
import {
    getQuestionsByExam,
    // deleteQuestion
} from "../../../../api/question";
import PermissionGuard from '../../../../components/PermissionGuard';
import { NotePencil, Plus, Trash } from 'phosphor-react';
import CreateUpdateQuestionModal from '../CreateUpdateQuestionDrawer';
import CustomModal from '../../../../component/CustomModal';

const { Paragraph } = Typography;

interface Props {
    open: boolean;
    examId?: string;
    onClose: () => void;
}

const PAGINATION = {
    PAGE_DEFAULT: 1,
    LIMIT: 10,
};

const ListQuestionModal = ({ open, examId, onClose }: Props) => {
    const [loading, setLoading] = useState(false);
    const [examInfo, setExamInfo] = useState<Exam>();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [pagination, setPagination] = useState({
        current: PAGINATION.PAGE_DEFAULT,
        pageSize: PAGINATION.LIMIT,
    });

    const [openQuestionModal, setOpenQuestionModal] = useState(false);
    const [questionId, setQuestionId] = useState<string | undefined>();
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteQuestionId, setDeleteQuestionId] = useState<string | undefined>();

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

    useEffect(() => {
        if (!open || !examId) return;
        fetchDataQuestion(examId);
    }, [open, examId]);

    const handleClose = () => {
        setExamInfo(undefined);
        setQuestions([]);
        setPagination({ current: PAGINATION.PAGE_DEFAULT, pageSize: PAGINATION.LIMIT });
        onClose();
    };

    const handleAddQuestion = () => {
        setQuestionId(undefined);
        setOpenQuestionModal(true);
    }

    const handleEditQuestion = (id: string) => {
        setQuestionId(id);
        setOpenQuestionModal(true);
    };

    // const handleDeleteQuestion = (id: string) => {
    //     console.log("xóa câu hỏi");
    //     Modal.confirm({
    //         title: "Xác nhận xoá câu hỏi",
    //         content: "Bạn có chắc chắn muốn xoá câu hỏi này không?",
    //         okText: "Xoá",
    //         cancelText: "Huỷ",
    //         okButtonProps: { danger: true },
    //         zIndex: 2000, // 🔥 QUAN TRỌNG
    //         onOk: async () => {
    //             try {
    //                 // await deleteQuestion(id);
    //                 message.success("Xoá câu hỏi thành công");
    //                 fetchDataQuestion(examId!);
    //             } catch {
    //                 message.error("Xoá câu hỏi thất bại");
    //             }
    //         },
    //     });
    // };
    const handleDeleteQuestion = (id: string) => {
        console.log("xóa câu hỏi");
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
            render: (text: string) => (
                <Paragraph
                    style={{ marginBottom: 0 }}
                    ellipsis={{
                        rows: 2,
                        expandable: true,
                        symbol: 'Xem thêm',
                    }}
                >
                    {text}
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
                    case 1: return <Tag color="green">Nhận biết</Tag>;
                    case 2: return <Tag color="blue">Thông hiểu</Tag>;
                    case 3: return <Tag color="orange">Vận dụng</Tag>;
                    case 4: return <Tag color="red">Vận dụng cao</Tag>;
                    default: return v;
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
                                key={a._id}
                                style={{ marginBottom: 4 }}
                                ellipsis={{
                                    rows: 2,
                                    expandable: true,
                                    symbol: 'Xem thêm',
                                }}
                                className={a.is_correct ? "correct" : ""}
                            >
                                {String.fromCharCode(65 + idx)}. {a.description}
                            </Paragraph>
                        ))}
                    </div>
                );
            },
        },
        // {
        //     title: "Tác vụ",
        //     width: 100,
        //     fixed: "right",
        //     align: "center",
        //     render: (_: any, row: Question) => (
        //         <div className="cpn-action">
        //             <PermissionGuard requiredPermissions="question.update">
        //                 <Tooltip title="Sửa">
        //                     <NotePencil
        //                         className="cursor-pointer"
        //                         color="#0c4299"
        //                         size={16}
        //                         onClick={() => handleEditQuestion(row._id)}
        //                     />
        //                 </Tooltip>
        //             </PermissionGuard>
        //             <PermissionGuard requiredPermissions="question.delete">
        //                 <Tooltip title="Xóa">
        //                     <Trash
        //                         className="cursor-pointer"
        //                         color="#d63b3b"
        //                         size={16}
        //                         onClick={() => handleDeleteQuestion(row._id)}
        //                     />
        //                 </Tooltip>
        //             </PermissionGuard>
        //         </div>
        //     ),
        // },
        {
            title: "Tác vụ",
            width: 100,
            fixed: "right",
            align: "center",
            render: (_: any, row: Question) => (
                <div className="cpn-action">
                    <PermissionGuard requiredPermissions="question.update">
                        <Tooltip title="Sửa">
                            <NotePencil
                                className="cursor-pointer"
                                color="#0c4299"
                                size={16}
                                onClick={() => handleEditQuestion(row._id)}
                            />
                        </Tooltip>
                    </PermissionGuard>

                    <PermissionGuard requiredPermissions="question.delete">
                        <Tooltip title="Xóa">
                            <Trash
                                className="cursor-pointer"
                                color="#d63b3b"
                                size={16}
                                onClick={() => handleDeleteQuestion(row._id)}
                            />
                        </Tooltip>
                    </PermissionGuard>
                </div>
            ),
        },

    ];

    return (
        <ConfigProvider locale={viVN}>
            {/* <Modal
                open={open}
                onCancel={handleClose}
                footer={null}
                width={1500}
                destroyOnClose
                title={examInfo ? `Danh sách câu hỏi – ${examInfo.name}` : "Danh sách câu hỏi"}
            > */}
            <Modal
                open={open}
                onCancel={handleClose}
                footer={null}
                width={1500}
                destroyOnClose
                title={
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>{examInfo ? `Danh sách câu hỏi – ${examInfo.name}` : "Danh sách câu hỏi"}</span>
                        <div>
                            <PermissionGuard requiredPermissions="question.create">
                                <Button
                                    type="primary"
                                    style={{ marginRight: 30 }}
                                    onClick={handleAddQuestion}
                                >
                                    {/* <Plus /> */}
                                    Thêm câu hỏi
                                </Button>
                            </PermissionGuard>
                            {/* <PermissionGuard requiredPermissions="question.create">
                                <Button
                                    type="primary"
                                    size="small"
                                    style={{ marginRight: 25 }}
                                    onClick={() => {
                                        setQuestionId(undefined);
                                        setOpenQuestionModal(true);
                                    }}
                                >
                                    Thêm câu hỏi
                                </Button>
                            </PermissionGuard> */}
                            {/* Nút đóng mặc định vẫn còn */}
                        </div>
                    </div>
                }
            >
                <div className="question-table">
                    <Table
                        bordered
                        size="middle"
                        rowKey="_id"
                        loading={loading}
                        columns={columns}
                        dataSource={questions}
                        pagination={{
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            showTotal: (total) => {
                                const { current, pageSize } = pagination;
                                const from = (current - 1) * pageSize + 1;
                                const to = Math.min(current * pageSize, total);
                                return `Tổng ${from}-${to} trong ${total} bản ghi`;
                            },
                            onChange: (current, pageSize) => {
                                setPagination({ current, pageSize: pageSize || pagination.pageSize });
                            },
                        }}
                    />
                </div>
                <CreateUpdateQuestionModal
                    open={openQuestionModal}
                    questionId={questionId}
                    examId={examId}
                    onClose={() => {
                        setOpenQuestionModal(false);
                        setQuestionId(undefined);
                        fetchDataQuestion(examId!);
                    }}
                />
                <CustomModal
                    open={openDelete}
                    title="Xóa câu hỏi"
                    type="warning"
                    content={
                        <>
                            Bạn có chắc chắn muốn xoá câu hỏi này không?
                        </>
                    }
                    handleOk={handleConfirmDelete}
                    handleCancel={() => {
                        setOpenDelete(false);
                        setDeleteQuestionId(undefined);
                    }}
                />
            </Modal>
        </ConfigProvider>
    );
};

export default ListQuestionModal;
