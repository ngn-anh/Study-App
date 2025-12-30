import './index.less';
import { Drawer, Button, Table, Tag, Typography, message, Switch, Input, Radio, Tooltip } from "antd";
import { ProForm, ProFormDigit, ProFormSelect, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import type { Answer, Question } from "../../../../types/typeObj";
import {
    getQuestionById,
    // createQuestion,
    // updateQuestion
} from "../../../../api/question";
import PermissionGuard from '../../../../components/PermissionGuard';
import { NotePencil, Trash } from 'phosphor-react';
import CustomModal from '../../../../component/CustomModal';

const { Paragraph } = Typography;

interface Props {
    open: boolean;
    examId?: string;
    questionId?: string;
    viewOnly?: boolean;
    onClose: () => void;
}

const CreateUpdateQuestionDrawer = ({
    open,
    examId,
    questionId,
    viewOnly = false,
    onClose,
}: Props) => {
    const [form] = useForm<Question>();
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAddingAnswer, setIsAddingAnswer] = useState(false);
    const [newAnswer, setNewAnswer] = useState({ description: "", is_correct: false, explanation: "" });
    const isEdit = !!questionId && !viewOnly;
    const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
    const [backupAnswers, setBackupAnswers] = useState<Answer[]>([]);

    const [openDeleteAnswer, setOpenDeleteAnswer] = useState(false);
    const [answerSelected, setAnswerSelected] = useState<Answer | null>(null);


    // Load chi tiết câu hỏi khi edit
    useEffect(() => {
        if (!open) return;

        if (!questionId) {
            form.resetFields();
            setAnswers([]);
            return;
        }

        const fetchDetail = async () => {
            try {
                setLoading(true);
                const res = await getQuestionById(questionId);
                if (res?.errorCode === 0) {
                    const data = res.data;
                    form.setFieldsValue({
                        description: data.description,
                        difficulty: data.difficulty,
                        section: data.section,
                    });
                    setAnswers(data.answers || []);
                }
            } catch (err) {
                message.error("Không lấy được thông tin câu hỏi");
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [open, questionId]);

    // Submit câu hỏi
    const handleSubmit = async (values: Question) => {
        try {
            if (!examId) {
                message.error("Thiếu examId");
                return;
            }

            const payload = {
                ...values,
                examId,
                answers,
            };

            if (isEdit && questionId) {
                // await updateQuestion(questionId, payload);
                console.log("updateQuestion: ", questionId, payload)
                message.success("Cập nhật câu hỏi thành công");
            } else {
                // await createQuestion(payload);
                console.log("createQuestion: ", payload)
                message.success("Tạo câu hỏi thành công");
            }

            onClose();
            form.resetFields();
            setAnswers([]);
        } catch (err) {
            console.error(err);
            message.error("Thao tác thất bại");
        }
    };

    // Thêm đáp án mới
    const handleAddAnswer = () => {
        if (!newAnswer.description.trim()) {
            message.warning("Vui lòng nhập nội dung đáp án");
            return;
        }

        // Thêm hoặc cập nhật đáp án
        const updatedAnswers = [...answers, { ...newAnswer, _id: editingAnswerId || Date.now().toString() }];
        setAnswers(updatedAnswers);

        // Reset form soạn đáp án
        setNewAnswer({ description: "", is_correct: false, explanation: "" });
        setIsAddingAnswer(false);
        setEditingAnswerId(null); // Reset trạng thái chỉnh sửa
    };

    // Thêm hàm chỉnh sửa đáp án
    const handleEditAnswer = (answer: Answer) => {
        // Backup danh sách hiện tại
        setBackupAnswers([...answers]);

        // Fill dữ liệu đáp án vào form soạn thảo
        setNewAnswer({ ...answer });

        // Bật chế độ soạn đáp án
        setIsAddingAnswer(true);

        // Đánh dấu đang edit
        setEditingAnswerId(answer._id);

        // Xóa tạm đáp án cũ khỏi danh sách
        setAnswers(answers.filter((a) => a._id !== answer._id));
    };

    // Xóa đáp án
    const handleDeleteAnswer = (answerId: string) => {
        setAnswers(answers.filter((a) => a._id !== answerId));
        message.success("Xóa đáp án thành công");
    };

    const onOpenDeleteAnswer = (answer: Answer) => {
        setAnswerSelected(answer);
        setOpenDeleteAnswer(true);
    };

    const handleConfirmDeleteAnswer = () => {
        if (!answerSelected) return;

        setAnswers((prev) => prev.filter((a) => a._id !== answerSelected._id));
        message.success("Xóa đáp án thành công");

        setOpenDeleteAnswer(false);
        setAnswerSelected(null);
    };


    const answerColumns = [
        {
            title: "STT",
            width: 50,
            align: "center" as const,
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: "Đáp án",
            dataIndex: "description",
            width: 250,
            render: (text: string) => (
                <Paragraph
                    style={{ marginBottom: 0 }}
                    ellipsis={{
                        rows: 2,
                        expandable: true,
                        symbol: (expand) => (expand ? "rút gọn" : "xem thêm"),
                    }}
                >
                    {text}
                </Paragraph>
            ),
        },
        {
            title: "Đúng/Sai",
            dataIndex: "is_correct",
            width: 100,
            align: "center" as const,
            render: (v: boolean) => <Tag color={v ? "green" : "red"}>{v ? "Đúng" : "Sai"}</Tag>,
        },
        {
            title: "Giải thích",
            dataIndex: "explanation",
            width: 250,
            render: (text: string) => (
                <Paragraph style={{ marginBottom: 0 }} ellipsis={{ rows: 2, expandable: true }}>
                    {text}
                </Paragraph>
            ),
        },
        {
            title: "Tác vụ",
            width: 100,
            fixed: "right",
            align: "center",
            render: (_: any, row: Answer) => (
                <div className="cpn-action" style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                    <PermissionGuard requiredPermissions="answer.update">
                        <Tooltip title="Sửa">
                            <NotePencil
                                className="cursor-pointer"
                                color="#0c4299"
                                size={16}
                                onClick={() => handleEditAnswer(row)}
                            />
                        </Tooltip>
                    </PermissionGuard>
                    <PermissionGuard requiredPermissions="answer.delete">
                        <Tooltip title="Xóa">
                            <Trash
                                className="cursor-pointer"
                                color="#d63b3b"
                                size={16}
                                // onClick={() => handleDeleteAnswer(row._id)}
                                onClick={() => onOpenDeleteAnswer(row)}
                            />
                        </Tooltip>
                    </PermissionGuard>
                </div>
            ),
        }
    ];

    return (
        <Drawer
            title={viewOnly ? "Thông tin câu hỏi" : isEdit ? "Cập nhật câu hỏi" : "Thêm câu hỏi"}
            placement="right"
            width={900}
            onClose={onClose}
            open={open}
            destroyOnClose
            footer={
                !viewOnly && (
                    <div style={{ textAlign: "right" }}>
                        <Button onClick={onClose} style={{ marginRight: 8 }}>
                            Hủy
                        </Button>
                        <Button type="primary" onClick={() => form.submit()}>
                            {isEdit ? "Cập nhật" : "Tạo mới"}
                        </Button>
                    </div>
                )
            }
        >
            <ProForm form={form} submitter={false} onFinish={handleSubmit} layout="vertical">
                <ProFormTextArea
                    name="description"
                    label="Nội dung câu hỏi"
                    placeholder={"Nhập nội dung câu hỏi"}
                    rules={[{ required: true, message: "Vui lòng nhập câu hỏi" }]}
                    fieldProps={{ rows: 4, disabled: viewOnly }}
                />
                <div className="difficulty-section">
                    <ProFormSelect
                        name="difficulty"
                        label="Độ khó"
                        placeholder={"--Chọn độ khó--"}
                        rules={[{ required: true }]}
                        options={[
                            { label: "Nhận biết", value: 1 },
                            { label: "Thông hiểu", value: 2 },
                            { label: "Vận dụng", value: 3 },
                            { label: "Vận dụng cao", value: 4 },
                        ]}
                        fieldProps={{ disabled: viewOnly }}
                    />
                    {/* <ProFormText
                        name="section"
                        label="Phần"
                        placeholder="VD: 1"
                        fieldProps={{ disabled: viewOnly }}
                        rules={[
                            { required: true, message: "Vui lòng nhập phần" },
                            {
                                pattern: /^[0-9]+$/,
                                message: "Chỉ được nhập số",
                            },
                        ]}
                    /> */}
                    <ProFormDigit
                        name="section"
                        label="Phần"
                        placeholder="VD: 1"
                        fieldProps={{
                            disabled: viewOnly,
                            min: 1,
                            max: 5,
                        }}
                        rules={[
                            { required: true, message: "Vui lòng nhập số 1 -> 5" },
                        ]}
                    />
                </div>
            </ProForm>
            {answers.length > 0 && (
                <div>
                    <div className="title-answer">Danh sách câu trả lời</div>
                    <div className="answer-table">
                        <Table
                            rowKey="_id"
                            bordered
                            size="middle"
                            columns={answerColumns}
                            dataSource={answers}
                            pagination={false}
                        />
                    </div>
                </div>
            )
            }

            {!viewOnly && (
                <div style={{ marginTop: 16, marginBottom: 16 }}>
                    {isAddingAnswer ? (
                        <div style={{ marginBottom: 8 }}>
                            <div className="answer-question-edit">Soạn đáp án</div>
                            <Input.TextArea
                                rows={4}
                                placeholder="Nội dung đáp án"
                                value={newAnswer.description}
                                onChange={(e) =>
                                    setNewAnswer({ ...newAnswer, description: e.target.value })
                                }
                                style={{ marginBottom: 4 }}
                            />
                            <Input.TextArea
                                rows={4}
                                placeholder="Giải thích (tùy chọn)"
                                value={newAnswer.explanation}
                                onChange={(e) =>
                                    setNewAnswer({ ...newAnswer, explanation: e.target.value })
                                }
                                style={{ marginBottom: 4 }}
                            />
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {/* Đúng/Sai Radio */}
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ color: "#ff4d4f", fontWeight: 600, fontSize: 18 }}>*</span>
                                    <span style={{ marginRight: 20 }}>Đúng/Sai:</span>
                                    <Radio.Group
                                        value={newAnswer.is_correct ? "true" : "false"}
                                        onChange={(e) =>
                                            setNewAnswer({ ...newAnswer, is_correct: e.target.value === "true" })
                                        }
                                    >
                                        <Radio value="true">Đúng</Radio>
                                        <Radio value="false">Sai</Radio>
                                    </Radio.Group>
                                </div>

                                {/* Nút Thêm / Hủy */}
                                <div style={{ display: "flex", gap: 8 }}>
                                    <Button type="primary" onClick={handleAddAnswer}>
                                        {editingAnswerId ? "Lưu đáp án" : "Thêm đáp án"}
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setNewAnswer({ description: "", is_correct: false, explanation: "" });
                                            setIsAddingAnswer(false);

                                            if (editingAnswerId) {
                                                // Khôi phục danh sách đáp án nếu đang chỉnh sửa
                                                setAnswers(backupAnswers);
                                                setEditingAnswerId(null);
                                            }
                                        }}
                                    >
                                        Hủy
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Button type="dashed" onClick={() => setIsAddingAnswer(true)}>
                            Thêm đáp án
                        </Button>
                    )}
                </div>
            )}
            <CustomModal
                open={openDeleteAnswer}
                title="Xóa đáp án"
                type="warning"
                content={
                    <>
                        Bạn có chắc muốn xóa đáp án này không?
                    </>
                }
                handleOk={handleConfirmDeleteAnswer}
                handleCancel={() => {
                    setOpenDeleteAnswer(false);
                    setAnswerSelected(null);
                }}
            />

        </Drawer >
    );
};

export default CreateUpdateQuestionDrawer;