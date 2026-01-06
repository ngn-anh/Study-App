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
    Upload,
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
import { NotePencil, Trash, UploadSimple } from "phosphor-react";
import CustomModal from "../../../../component/CustomModal";
import MathInput from "../../../../component/MathInput/MathInput";
import { MathJaxContext } from "better-react-mathjax";
import type { MathfieldElement } from "mathlive";
import { getCroppedImg } from "../../../../utils/cropImage";
import Cropper from "react-easy-crop";

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

    const VITE_CLOUDINARY_NAME = import.meta.env.VITE_CLOUDINARY_NAME;
    const VITE_CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const [questionImage, setQuestionImage] = useState<File | null>(null); // file mới chọn
    const [previewQuestionImage, setPreviewQuestionImage] = useState<string | null>(null); // hiển thị preview
    const [isImageChanged, setIsImageChanged] = useState(false); // check thay đổi

    // const [crop, setCrop] = useState({ x: 0, y: 0 });
    // const [zoom, setZoom] = useState(1);
    // const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    // const [croppingImage, setCroppingImage] = useState<string | null>(null); // preview để crop


    // ---------------------- Load dữ liệu khi chỉnh sửa ----------------------
    useEffect(() => {
        if (!open) return;

        setResetKey(prev => prev + 1);

        if (!questionId) {
            form.resetFields();
            setAnswers([]);
            // setPreviewQuestionImage(null);   // ✅ reset ảnh preview
            // setQuestionImage(null);          // ✅ reset file ảnh mới
            // setCroppingImage(null);          // ✅ reset cropper
            // setCrop({ x: 0, y: 0 });         // ✅ reset crop vị trí
            // setZoom(1);
            // setPreviewItems([]);
            return;
        }

        const fetchDetail = async () => {
            try {
                setLoading(true);
                const res = await getQuestionById(questionId);
                if (res?.errorCode === 0) {
                    const data = res.data;

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

                    if (data.image) {
                        setPreviewQuestionImage(data.image);  // hiển thị preview
                        //     setCroppingImage(data.image);         // cropper sẽ có ảnh
                        //     setCrop({ x: 0, y: 0 });              // reset crop
                        //     setZoom(1);                            // reset zoom
                    } else {
                        setPreviewQuestionImage(null);
                        //     setCroppingImage(null);
                    }

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

            // Upload ảnh nếu có
            const imageUrl = await uploadQuestionImage();

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
                ...(values.section ? { section: Number(values.section) } : {}),
                ...(sanitizedAnswers.length > 0 ? { answers: sanitizedAnswers } : {}),
                ...(imageUrl ? { image: imageUrl } : {}),
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

    // const handleSelectQuestionImage = (file: File) => {
    //     const reader = new FileReader();
    //     reader.onload = () => {
    //         setCroppingImage(reader.result as string); // dùng trong cropper
    //     };
    //     reader.readAsDataURL(file);
    // };
    const handleSelectQuestionImage = (file: File) => {
        setQuestionImage(file);
        setIsImageChanged(true);
        const reader = new FileReader();
        reader.onload = () => setPreviewQuestionImage(reader.result as string);
        reader.readAsDataURL(file);
    };

    const uploadQuestionImage = async (): Promise<string | null> => {
        if (!questionImage) return previewQuestionImage; // giữ ảnh cũ nếu không đổi

        const formData = new FormData();
        formData.append("file", questionImage);
        formData.append("upload_preset", VITE_CLOUDINARY_UPLOAD_PRESET);
        formData.append("folder", "questions");

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${VITE_CLOUDINARY_NAME}/image/upload`,
            { method: "POST", body: formData }
        );

        const data = await res.json();
        return data.secure_url || '';
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
                {/* <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                        Chèn ảnh câu hỏi
                    </label>

                    {previewQuestionImage && !croppingImage && (
                        <img
                            src={previewQuestionImage}
                            alt="Preview Question"
                            style={{ width: 200, height: "auto", display: "block", marginBottom: 8, border: "1px solid #ccc", borderRadius: 4 }}
                        />
                    )}

                    {!croppingImage && !viewOnly && (
                        <Upload
                            accept="image/*"
                            showUploadList={false}
                            beforeUpload={(file) => {
                                handleSelectQuestionImage(file);
                                return false;
                            }}
                        >
                            <Button icon={<UploadSimple />}>Chọn ảnh</Button>
                        </Upload>
                    )}

                    {croppingImage && (
                        <div style={{ position: "relative", width: 400, height: 300, background: "#333", marginTop: 8 }}>
                            <Cropper
                                image={croppingImage}
                                crop={crop}
                                zoom={zoom}
                                // aspect={4 / 3} // bạn có thể đổi tỉ lệ
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
                            />
                            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                                <Button
                                    type="primary"
                                    onClick={async () => {
                                        if (!croppedAreaPixels || !croppingImage) return;
                                        const blob = await getCroppedImg(croppingImage, croppedAreaPixels, zoom);
                                        const file = new File([blob], "question.jpg", { type: "image/jpeg" });
                                        setQuestionImage(file);
                                        setPreviewQuestionImage(URL.createObjectURL(file));
                                        setCroppingImage(null); // đóng cropper
                                    }}
                                >
                                    Lưu ảnh
                                </Button>
                                <Button onClick={() => setCroppingImage(null)}>Hủy</Button>
                            </div>
                        </div>
                    )}

                    {previewQuestionImage && !viewOnly && !croppingImage && (
                        <Button
                            type="link"
                            danger
                            onClick={() => {
                                setPreviewQuestionImage(null);
                                setQuestionImage(null);
                                setIsImageChanged(true);
                            }}
                        >
                            Xóa ảnh
                        </Button>
                    )}
                </div> */}

                <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                        Chèn ảnh câu hỏi
                    </label>
                    {previewQuestionImage && (
                        <img
                            src={previewQuestionImage}
                            alt="Preview Question"
                            style={{ width: 250, height: "auto", display: "block", marginBottom: 8, border: "1px solid #ccc", borderRadius: 4 }}
                        />
                    )}
                    <Upload
                        accept="image/*"
                        showUploadList={false}
                        beforeUpload={(file) => {
                            handleSelectQuestionImage(file);
                            return false;
                        }}
                    >
                        <Button icon={<UploadSimple />}>Chọn ảnh</Button>
                    </Upload>
                    {previewQuestionImage && !viewOnly && (
                        <Button
                            type="link"
                            danger
                            onClick={() => {
                                setPreviewQuestionImage(null);
                                setQuestionImage(null);
                                setIsImageChanged(true);
                            }}
                        >
                            Xóa ảnh
                        </Button>
                    )}
                </div>

                {/* ---------- Độ khó & Phần ---------- */}
                <div className="difficulty-section">
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
                        rules={[{ required: true, message: "Vui lòng nhập phần là số (1‑5)" }]}
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
                <div style={{ marginTop: 20 }}>
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
                        <Button type="primary" onClick={() => setIsAddingAnswer(true)} >
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