// CreateUpdateQuestionDrawer.tsx
import "./index.less";
import {
    Drawer,
    Button,
    Table,
    Tag,
    Typography,
    message,
    Radio,
    Tooltip,
    Input,
    Form,
} from "antd";
import {
    ProForm,
    ProFormSelect,
    ProFormDigit,
    ProFormItem,
} from "@ant-design/pro-components";
import { useEffect, useRef, useState } from "react";
import { useForm } from "antd/es/form/Form";
import type { Answer, ImportQuestion, Question } from "../../../../types/typeObj";
import {
    getQuestionById,
    createQuestion,
    updateQuestion,
    // updateQuestion,
} from "../../../../api/question";
import PermissionGuard from "../../../../components/PermissionGuard";
import { NotePencil, Trash } from "phosphor-react";
import CustomModal from "../../../../component/CustomModal";
import MathInput from "../../../../component/MathInput/MathInput";
import { MathJaxContext } from "better-react-mathjax";
import type { MathfieldElement } from "mathlive";

const { Paragraph } = Typography;

interface Props {
    open: boolean;
    examId?: string;
    questionId?: string;
    viewOnly?: boolean;
    onClose: () => void;
    onCreated?: () => void;
    importQuestion?: ImportQuestion;
    onImportUpdated?: (q: ImportQuestion) => void;
}

/* ------------------------------------------------------------
   Drawer: Thêm / Cập nhật câu hỏi
   ------------------------------------------------------------ */
const CreateUpdateQuestionDrawer = ({
    open,
    examId,
    questionId,
    viewOnly = false,
    onClose,
    onCreated,
    importQuestion,
    onImportUpdated,
}: Props) => {
    // ---------------------- Form ----------------------
    const [form] = useForm<Question>();
    const description = Form.useWatch("description", form); // <-- theo dõi trường description
    const isImportEdit = !!importQuestion;
    // ---------------------- State ----------------------
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAddingAnswer, setIsAddingAnswer] = useState(false);
    const [newAnswer, setNewAnswer] = useState({
        description: "",
        is_correct: false,
        explanation: "",
    });
    const isEdit = !!questionId && !viewOnly;
    const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
    const [backupAnswers, setBackupAnswers] = useState<Answer[]>([]);
    const [openDeleteAnswer, setOpenDeleteAnswer] = useState(false);
    const [answerSelected, setAnswerSelected] = useState<Answer | null>(null);
    const mathRef = useRef<MathfieldElement | null>(null);
    const [resetKey, setResetKey] = useState<number>(0);

    // ---------------------- Load dữ liệu khi chỉnh sửa ----------------------
    useEffect(() => {
        if (!open) return;

        setResetKey(prev => prev + 1);

        if (!questionId) {
            form.resetFields();
            setAnswers([]);
            // setPreviewItems([]);
            return;
        }

        const fetchDetail = async () => {
            try {
                setLoading(true);
                const res = await getQuestionById(questionId);
                if (res?.errorCode === 0) {
                    const data = res.data;

                    /* -------------------------------------------------
                       1️⃣ Lấy LaTeX từ JSON (nếu dữ liệu lưu dưới dạng JSON)
                          - data.description có thể là JSON string chứa text/latex/image.
                          - Ta tách ra chuỗi LaTeX để đưa vào MathInput.
                       ------------------------------------------------- */
                    // let latexForEditor = "";
                    // try {
                    //     const arr: any[] = JSON.parse(data.description);
                    //     latexForEditor = arr
                    //         .filter(i => i.type === "latex")
                    //         .map(i => (i.content ?? "").trim())
                    //         .join(" ");
                    // } catch (_) {
                    //     // nếu parse thất bại, coi như data.description đã là LaTeX thuần
                    //     latexForEditor = data.description || "";
                    // }

                    let latexForEditor = "";
                    try {
                        const arr: any[] = JSON.parse(data.description);

                        // giữ tất cả item, text + latex
                        latexForEditor = arr
                            .map(i => i.content ?? "")  // lấy content dù là text hay latex
                            .join(" ")                  // giữ khoảng trắng giữa các item
                            .trim();                    // trim cuối cùng, không trim từng item
                    } catch (_) {
                        // nếu parse thất bại, coi như data.description đã là LaTeX thuần
                        latexForEditor = data.description || "";
                    }

                    // Đặt giá trị cho Form (field description) → description sẽ được
                    // truyền vào MathInput qua `description` ở dưới.
                    form.setFieldsValue({
                        description: latexForEditor,
                        difficulty: data.difficulty,
                        section: data.section,
                    });

                    // Giữ nguyên previewItems (nếu bạn muốn hiển thị ảnh/text)
                    // Tuy nhiên component MathInput hiện tại chỉ dùng preview khi
                    // người dùng tự chèn, nên ở đây không cần set previewItems.
                    setAnswers(data.answers || []);

                    // ✅ Sửa thêm: đồng bộ MathInput với form
                    if (mathRef.current) {
                        mathRef.current.setValue(latexForEditor, { format: "auto" });
                    }
                }
            } catch (_) {
                message.error("Không lấy được thông tin câu hỏi");
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();

    }, [open, questionId, form]);

    useEffect(() => {
        if (!open || !isImportEdit || !importQuestion) return;

        form.setFieldsValue({
            description: importQuestion.description,
            difficulty: importQuestion.difficulty,
            section: importQuestion.section,
        });

        setAnswers(
            (importQuestion.answers || []).map((a, idx) => ({
                _id: `import-${idx}`, // CHỈ DÙNG TRONG FE
                description: a.description,
                is_correct: a.is_correct,
                explanation: a.explanation,
            }))
        );
    }, [open, isImportEdit, importQuestion]);

    const handleSubmitImportQuestion = (values: any) => {
        if (!importQuestion) return;

        onImportUpdated?.({
            ...importQuestion,
            description: values.description,
            difficulty: values.difficulty,
            section: values.section,
            answers,
        });

        message.success("Cập nhật câu hỏi import thành công");
        handleCloseDrawer();
    };

    const handleCloseDrawer = () => {
        form.resetFields();   // reset Form
        setAnswers([]);       // reset đáp án
        setNewAnswer({ description: "", is_correct: false, explanation: "" });
        setIsAddingAnswer(false);
        setEditingAnswerId(null);
        onClose();
    };

    const buildAnswerPayload = (answers: Answer[]) =>
        answers.map(a => ({
            _id: a._id?.startsWith("import-") ? undefined : a._id,
            description: a.description,
            explanation: a.explanation,
            is_correct: a.is_correct,
        }));

    // ---------------------- Submit (create / update) ----------------------
    const handleSubmitDbQuestion = async (values: Partial<Question>) => {
        try {
            if (!examId) {
                message.error("Không có thông tin đề thi");
                return;
            }

            // Đẩy nội dung mới từ Mathlive vào Form trước khi submit
            if (mathRef.current) mathRef.current.blur();
            await new Promise(r => setTimeout(r, 0)); // đợi Form cập nhật

            const sanitizedAnswers = (answers ?? [])
                .filter(a => typeof a.description === "string" && a.description.trim() !== "")
                .map(a => ({
                    ...(a._id ? { _id: a._id } : {}),
                    description: a.description.trim(),
                    is_correct: Boolean(a.is_correct ?? false),
                    explanation: a.explanation?.trim() ?? "",
                }));

            const payload = {
                ...(isEdit ? {} : { exam_id: examId }),
                description: values.description!.trim(),
                difficulty: values.difficulty,
                section: Number(values.section),
                ...(sanitizedAnswers.length > 0 ? { answers: sanitizedAnswers } : {}),
            };

            if (isEdit && questionId) {
                const res = await updateQuestion(questionId, payload);
                if (res.success) {
                    message.success("Cập nhật câu hỏi thành công");
                    console.log("update question:", questionId, payload);
                }
            } else {
                const res = await createQuestion(payload);
                if (res.success) {
                    onCreated?.();
                    message.success("Tạo câu hỏi thành công");
                    console.log("res create:", res);
                }
            }

            // Đóng drawer & reset
            handleCloseDrawer();
            // form.resetFields();
            // setAnswers([]);
        } catch (err: any) {
            console.error(err);
            message.error("Có lỗi xảy ra. Vui lòng thử lại sau");
        }
    };

    const handleSubmit = async (values: any) => {
        if (isImportEdit) {
            handleSubmitImportQuestion(values);
            return;
        }

        await handleSubmitDbQuestion(values);
    };

    // ---------------------- Các hàm liên quan tới đáp án ----------------------
    const handleAddAnswer = () => {
        if (!newAnswer.description.trim()) {
            message.warning("Vui lòng nhập nội dung đáp án");
            return;
        }
        const updatedAnswers = [
            ...answers,
            { ...newAnswer, _id: editingAnswerId || Date.now().toString() },
        ];
        setAnswers(updatedAnswers);
        setNewAnswer({ description: "", is_correct: false, explanation: "" });
        setIsAddingAnswer(false);
        setEditingAnswerId(null);
    };

    const handleEditAnswer = (answer: Answer) => {
        setBackupAnswers([...answers]);
        setNewAnswer({ ...answer });
        setIsAddingAnswer(true);
        setEditingAnswerId(answer._id);
        setAnswers(answers.filter(a => a._id !== answer._id));
    };

    // const handleDeleteAnswer = (answerId: string) => {
    //     setAnswers(answers.filter(a => a._id !== answerId));
    //     message.success("Xóa đáp án thành công");
    // };

    const onOpenDeleteAnswer = (answer: Answer) => {
        setAnswerSelected(answer);
        setOpenDeleteAnswer(true);
    };

    const handleConfirmDeleteAnswer = () => {
        if (!answerSelected) return;
        setAnswers(prev => prev.filter(a => a._id !== answerSelected._id));
        message.success("Xóa đáp án thành công");
        setOpenDeleteAnswer(false);
        setAnswerSelected(null);
    };

    // ---------------------- Bảng đáp án ----------------------
    const answerColumns = [
        { title: "STT", width: 50, align: "center" as const, render: (_: any, __: any, i: number) => i + 1 },
        {
            title: "Đáp án",
            dataIndex: "description",
            width: 250,
            render: (text: string) => (
                <Paragraph
                    style={{ marginBottom: 0 }}
                    ellipsis={{ rows: 2, expandable: true, symbol: e => (e ? "Rút gọn" : "Xem thêm") }}
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
                <Paragraph style={{ margin: 0 }} ellipsis={{ rows: 2, expandable: true }}>
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
                <div className="cpn-action" style={{ display: "flex", gap: 8, justifyContent: "center" }}>
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
                                color="#d63b3d"
                                size={16}
                                onClick={() => onOpenDeleteAnswer(row)}
                            />
                        </Tooltip>
                    </PermissionGuard>
                </div>
            ),
        },
    ];

    // ---------------------- UI ----------------------
    return (
        <Drawer
            title={viewOnly ? "Thông tin câu hỏi" : isEdit ? "Cập nhật câu hỏi" : "Thêm câu hỏi"}
            placement="right"
            width={900}
            onClose={handleCloseDrawer}
            open={open}
            destroyOnClose
            footer={
                !viewOnly && (
                    <div style={{ textAlign: "right" }}>
                        <Button onClick={handleCloseDrawer} style={{ marginRight: 8 }}>
                            Hủy
                        </Button>
                        <Button type="primary" onClick={() => form.submit()}>
                            {isEdit ? "Cập nhật" : "Tạo mới"}
                        </Button>
                    </div>
                )
            }
        >
            <ProForm
                form={form}
                submitter={false}
                onFinish={handleSubmit}
                layout="vertical"
                initialValues={{ difficulty: undefined, section: undefined }}
            >
                {/* ---------- Nội dung câu hỏi (MathInput) ---------- */}
                <ProFormItem
                    name="description"
                    label="Nội dung câu hỏi"
                    rules={[{ required: true, message: "Vui lòng nhập nội dung câu hỏi" }]}
                >
                    {/* <MathJaxContext> */}
                    {/*  description được lấy qua Form.useWatch → truyền vào MathInput */}
                    <MathInput
                        key={resetKey}
                        ref={mathRef}
                        value={description ?? ""}
                        onChange={val => form.setFieldsValue({ description: val })}
                    // readOnly={viewOnly}
                    />
                    {/* </MathJaxContext> */}
                </ProFormItem>

                {/* ---------- Độ khó & Phần ---------- */}
                <div className="difficulty-section" style={{ display: "flex", gap: 24, marginTop: 16 }}>
                    <ProFormSelect
                        name="difficulty"
                        label="Độ khó"
                        placeholder="--Chọn độ khó--"
                        options={[
                            { label: "Nhận biết", value: 1 },
                            { label: "Thông hiểu", value: 2 },
                            { label: "Vận dụng", value: 3 },
                            { label: "Vận dụng cao", value: 4 },
                        ]}
                        fieldProps={{ disabled: viewOnly }}
                        rules={[{ required: true, message: "Vui lòng chọn độ khó" }]}
                    />
                    <ProFormDigit
                        name="section"
                        label="Phần"
                        placeholder="VD: 1"
                        fieldProps={{ disabled: viewOnly, min: 1, max: 5 }}
                        rules={[{ required: true, message: "Vui lòng nhập phần (1‑5)" }]}
                    />
                </div>
            </ProForm>

            {/* ---------- Bảng đáp án (nếu có) ---------- */}
            {answers.length > 0 && (
                <div style={{ marginTop: 24 }}>
                    <div className="title-answer">Danh sách đáp án</div>
                    <Table
                        rowKey="_id"
                        bordered
                        size="middle"
                        columns={answerColumns}
                        dataSource={answers}
                        pagination={false}
                    />
                </div>
            )}

            {/* ---------- Thêm / sửa đáp án ---------- */}
            {!viewOnly && (
                <div style={{ marginTop: 24 }}>
                    {isAddingAnswer ? (
                        <div style={{ marginBottom: 8 }}>
                            <div className="answer-question-edit">Soạn đáp án</div>
                            <Input.TextArea
                                rows={4}
                                placeholder="Nội dung đáp án"
                                value={newAnswer.description}
                                onChange={e => setNewAnswer({ ...newAnswer, description: e.target.value })}
                                style={{ marginBottom: 8 }}
                            />
                            <Input.TextArea
                                rows={3}
                                placeholder="Giải thích (tùy chọn)"
                                value={newAnswer.explanation}
                                onChange={e => setNewAnswer({ ...newAnswer, explanation: e.target.value })}
                                style={{ marginBottom: 8 }}
                            />
                            <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                                <span style={{ color: "#ff4d4f", marginRight: 8, fontWeight: 600 }}>*</span>
                                <span style={{ marginRight: 12 }}>Đúng/Sai:</span>
                                <Radio.Group
                                    value={newAnswer.is_correct ? "true" : "false"}
                                    onChange={e => setNewAnswer({ ...newAnswer, is_correct: e.target.value === "true" })}
                                >
                                    <Radio value="true">Đúng</Radio>
                                    <Radio value="false">Sai</Radio>
                                </Radio.Group>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                <Button type="primary" onClick={handleAddAnswer}>
                                    {editingAnswerId ? "Lưu đáp án" : "Thêm đáp án"}
                                </Button>
                                <Button
                                    onClick={() => {
                                        setNewAnswer({ description: "", is_correct: false, explanation: "" });
                                        setIsAddingAnswer(false);
                                        if (editingAnswerId) {
                                            setAnswers(backupAnswers);
                                            setEditingAnswerId(null);
                                        }
                                    }}
                                >
                                    Hủy
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button type="dashed" onClick={() => setIsAddingAnswer(true)}>
                            Thêm đáp án
                        </Button>
                    )}
                </div>
            )}

            {/* ---------- Modal xác nhận xóa đáp án ---------- */}
            <CustomModal
                open={openDeleteAnswer}
                title="Xóa đáp án"
                type="warning"
                content={<>Bạn có chắc muốn xóa đáp án này không?</>}
                handleOk={handleConfirmDeleteAnswer}
                handleCancel={() => {
                    setOpenDeleteAnswer(false);
                    setAnswerSelected(null);
                }}
            />
        </Drawer>
    );
};

export default CreateUpdateQuestionDrawer;