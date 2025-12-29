import { useEffect, useState } from "react";
import {
    Form,
    Input,
    Select,
    DatePicker,
    Upload,
    Button,
    message,
    Spin,
    Typography,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
import "./index.less";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { getSubjects, getSubjectsByClass } from "../../../../api/subject";
import { getClasses, getClassesBySubject } from "../../../../api/class";
import { getBySubjectClass } from "../../../../api/subject-class";
import MathInput from "../../../../component/MathInput/MathInput";

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

/* ------------------- Kiểu dữ liệu --------------------------- */
interface Subject {
    _id: string;
    name: string;
}
interface ClassItem {
    _id: string;
    name: string;
}

const ExamPage = () => {
    // const [title, setTitle] = useState('');
    // const [duration, setDuration] = useState('');
    const [questionInput, setQuestionInput] = useState("");
    const [questions, setQuestions] = useState<string[]>([]);
    const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);

    /* ---------- 1️⃣ Dữ liệu dropdown ---------- */
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
    const [allClasses, setAllClasses] = useState<ClassItem[]>([]);

    /* ---------- 2️⃣ Id của bảng many‑to‑many ---------- */
    const [subjectClassId, setSubjectClassId] = useState<string | null>(null);

    /* ---------- 3️⃣ Loading state ---------- */
    const [loading, setLoading] = useState(false);

    /* ---------- 4️⃣ Ant Design form instance (đổi tên) ---------- */
    const [examForm] = Form.useForm(); // <-- không còn trùng với component Form

    /* ---------- 5️⃣ Lấy danh sách môn & lớp ban đầu ---------- */
    useEffect(() => {
        async function fetchAllData() {
            try {
                const subRes = await getSubjects();
                const clsRes = await getClasses();
                console.log(subRes);
                console.log(clsRes);

                setAllSubjects(subRes.data);
                setAllClasses(clsRes.data);
                setSubjects(subRes.data);
                setClasses(clsRes.data);
            } catch (err) {
                console.error(err);
                message.error('Không tải được danh sách môn / lớp');
            }
        }
        fetchAllData();
    }, []);

    /* ---------- 6️⃣ Khi chọn môn → lấy các lớp có môn đó ---------- */
    const handleSubjectChange = async (subjectId: string) => {
        // Reset lớp đã chọn để tránh giữ lại giá trị cũ
        examForm.setFieldsValue({ classId: undefined });
        if (!subjectId) {
            // Không chọn môn → hiển thị toàn bộ lớp
            setClasses(allClasses);
            return;
        }
        try {
            const res = await getClassesBySubject(subjectId);
            setClasses(res.data);
        } catch (err) {
            console.error(err);
            message.error('Không tải được danh sách lớp học');
        }
    };

    /* ---------- 7️⃣ Khi chọn lớp → lấy các môn của lớp đó ---------- */
    const handleClassChange = async (classId: string) => {
        // Reset môn đã chọn
        examForm.setFieldsValue({ subjectId: undefined });
        if (!classId) {
            // Không chọn lớp → hiển thị toàn bộ môn
            setSubjects(allSubjects);
            return;
        }
        try {
            const res = await getSubjectsByClass(classId);
            setSubjects(res.data);
        } catch (err) {
            console.error(err);
            message.error('Không tải được danh sách môn học');
        }
    };

    /* ---------- 8️⃣ Khi đã có môn & lớp → lấy id trong bảng subjects_classes ---------- */
    const handleSubjectClassChange = async (classId: string, subjectId: string) => {
        if (!subjectId || !classId) {
            setSubjectClassId(null);
            return;
        }
        try {
            const res = await getBySubjectClass(classId, subjectId);
            console.log(res);
            setSubjectClassId(res.data.data._id);
        } catch (err) {
            console.error(err);
            setSubjectClassId(null);
            message.error('Không có quan hệ môn‑lớp trong hệ thống');
        }
    };

    /* ---------- 9️⃣ Submit ------------------------------------------------- */
    const onFinish = async (values: any) => {
        if (!subjectClassId) {
            message.error('Vui lòng chọn môn và lớp hợp lệ');
            return;
        }

        // ------------------- Chuẩn bị FormData -------------------
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('description', values.description ?? '');
        formData.append('type', String(values.type));
        if (values.difficulty) formData.append('difficulty', String(values.difficulty));
        formData.append('duration', String(values.duration));
        formData.append('startDate', dayjs(values.startDate).toISOString());
        formData.append('endDate', dayjs(values.endDate).toISOString());
        formData.append('subjectClassId', subjectClassId);
        if (values.image?.file?.originFileObj) {
            formData.append('image', values.image.file.originFileObj);
        }

        setLoading(true);
        try {
            console.log("formData exam: ", formData);
            // const res = await axios.post('/api/exams', formData, {
            //     headers: { 'Content-Type': 'multipart/form-data' },
            // });
            // message.success(`Tạo đề thành công! Id: ${res.data.examId}`);
            // // Reset form & state
            // examForm.resetFields();
            // setSubjectClassId(null);
            // setSubjects(allSubjects);
            // setClasses(allClasses);
        } catch (err) {
            console.error(err);
            // message.error(err?.response?.data?.message || 'Lỗi khi tạo đề');
        } finally {
            setLoading(false);
        }
    };

    /* ---------- 10️⃣ Layout & Rules ---------- */
    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };
    const tailLayout = { wrapperCol: { offset: 6, span: 16 } };

    const addQuestion = () => {
        if (!questionInput.trim()) return;
        setQuestions([...questions, questionInput]);
        setQuestionInput("");
    };

    const removeQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const toggleKeyboard = () => {
        setShowVirtualKeyboard(!showVirtualKeyboard);
    };

    // const exportPDF = async () => {
    //     const element = document.getElementById("pdf-content");
    //     if (!element) return;

    //     const canvas = await html2canvas(element, {
    //         scale: 2,
    //         backgroundColor: "#ffffff",
    //         useCORS: true
    //     });

    //     const imgData = canvas.toDataURL("image/png");
    //     const pdf = new jsPDF("p", "mm", "a4");

    //     const pageWidth = pdf.internal.pageSize.getWidth();
    //     const pageHeight = pdf.internal.pageSize.getHeight();

    //     const imgHeight = (canvas.height * pageWidth) / canvas.width;
    //     let heightLeft = imgHeight;
    //     let position = 0;

    //     pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
    //     heightLeft -= pageHeight;

    //     while (heightLeft > 0) {
    //         position -= pageHeight;
    //         pdf.addPage();
    //         pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
    //         heightLeft -= pageHeight;
    //     }

    //     pdf.save("de-thi.pdf");
    // };

    return (
        <MathJaxContext>
            <div className="exam-container">
                {/* ================= UI SOẠN THẢO CHÍNH ================= */}
                <div className="exam-editor">

                    {/* <div className="header-exam">
                        <input
                            className="header-exam-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Nhập tiêu đề đề thi"
                        />
                        <div className="duration-input">
                            <span>Thời gian: </span>
                            <input
                                className="header-exam-time"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                type="number"
                                min="1"
                            />
                            <span> phút</span>
                        </div>
                    </div> */}
                    <Spin spinning={loading}>
                        <Title level={4}>Tạo đề kiểm tra</Title>
                        <Form
                            {...layout}
                            form={examForm}          // <- truyền instance vào Form
                            name="examForm"
                            onFinish={onFinish}
                            initialValues={{
                                type: 2,                // mặc định “Đề luyện”
                                startDate: dayjs(),
                                endDate: dayjs(),
                            }}
                        >
                            {/* ------------ Tên đề (bắt buộc) ------------ */}
                            <Form.Item
                                label="Tên đề"
                                name="name"
                                rules={[{ required: true, message: 'Tên đề không được để trống' }]}
                            >
                                <Input />
                            </Form.Item>

                            {/* ------------ Mô tả (không bắt buộc) ------------ */}
                            <Form.Item label="Mô tả" name="description">
                                <TextArea rows={3} />
                            </Form.Item>

                            {/* ------------ Loại đề (dropdown) ------------ */}
                            <Form.Item
                                label="Loại đề"
                                name="type"
                                rules={[{ required: true, message: 'Chọn loại đề' }]}
                            >
                                <Select>
                                    <Option value={1}>Thi thử</Option>
                                    <Option value={2}>Đề luyện</Option>
                                </Select>
                            </Form.Item>

                            {/* ------------ Ảnh đề (upload) ------------ */}
                            <Form.Item label="Ảnh đề" name="image" valuePropName="file">
                                <Upload
                                    name="image"
                                    listType="picture"
                                    maxCount={1}
                                    beforeUpload={(file) => {
                                        const isJpgOrPng =
                                            file.type === 'image/jpeg' ||
                                            file.type === 'image/png' ||
                                            file.type === 'image/jpg';
                                        if (!isJpgOrPng) {
                                            message.error('Chỉ chấp nhận file JPG/PNG');
                                        }
                                        const isLt5M = file.size / 1024 / 1024 < 5;
                                        if (!isLt5M) {
                                            message.error('Dung lượng file không được vượt quá 5 MB');
                                        }
                                        return isJpgOrPng && isLt5M ? true : Upload.LIST_IGNORE;
                                    }}
                                >
                                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                                </Upload>
                            </Form.Item>

                            {/* ------------ Độ khó (optional) ------------ */}
                            <Form.Item label="Độ khó" name="difficulty">
                                <Select allowClear placeholder="Chọn độ khó (optional)">
                                    <Option value={1}>Dễ</Option>
                                    <Option value={2}>Trung bình</Option>
                                    <Option value={3}>Khó</Option>
                                </Select>
                            </Form.Item>

                            {/* ------------ Thời lượng (phút) ------------ */}
                            <Form.Item
                                label="Thời lượng (phút)"
                                name="duration"
                                rules={[
                                    { required: true, message: 'Nhập thời lượng' },
                                    {
                                        validator: (_, value) =>
                                            value > 0
                                                ? Promise.resolve()
                                                : Promise.reject('Thời lượng phải lớn hơn 0'),
                                    },
                                ]}
                            >
                                <Input type="number" min={1} />
                            </Form.Item>

                            {/* ------------ Ngày‑giờ bắt đầu ------------ */}
                            <Form.Item
                                label="Ngày‑giờ bắt đầu"
                                name="startDate"
                                rules={[{ required: true, message: 'Chọn ngày bắt đầu' }]}
                            >
                                <DatePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>

                            {/* ------------ Ngày‑giờ kết thúc ------------ */}
                            <Form.Item
                                label="Ngày‑giờ kết thúc"
                                name="endDate"
                                dependencies={['startDate']}
                                rules={[
                                    { required: true, message: 'Chọn ngày kết thúc' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            const start = getFieldValue('startDate');
                                            if (!value || !start) {
                                                return Promise.resolve();
                                            }
                                            return value.isAfter(start)
                                                ? Promise.resolve()
                                                : Promise.reject('Ngày kết thúc phải sau ngày bắt đầu');
                                        },
                                    }),
                                ]}
                            >
                                <DatePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>

                            {/* ------------ Môn học ------------ */}
                            <Form.Item
                                label="Môn học"
                                name="subjectId"
                                rules={[{ required: true, message: 'Chọn môn học' }]}
                            >
                                <Select
                                    placeholder="Chọn môn"
                                    showSearch
                                    filterOption={(input, option) =>
                                        (option?.children as unknown as string)
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                    // Khi người dùng chọn môn, tải lại các lớp tương ứng và cập nhật subjectClassId
                                    onChange={(subjectId) => {
                                        // 1️⃣ Lọc lại các lớp
                                        handleSubjectChange(subjectId);
                                        // 2️⃣ Kiểm tra xem đã có lớp được chọn chưa → nếu có, lấy id subject‑class
                                        const classId = examForm.getFieldValue('classId');
                                        handleSubjectClassChange(subjectId, classId);
                                    }}
                                >
                                    {subjects.map((s) => (
                                        <Option key={s._id} value={s._id}>
                                            {s.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            {/* ------------ Lớp học ------------ */}
                            <Form.Item
                                label="Lớp học"
                                name="classId"
                                rules={[{ required: true, message: 'Chọn lớp học' }]}
                            >
                                <Select
                                    placeholder="Chọn lớp"
                                    showSearch
                                    filterOption={(input, option) =>
                                        (option?.children as unknown as string)
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                    // Khi người dùng chọn lớp, tải lại các môn tương ứng và cập nhật subjectClassId
                                    onChange={(classId) => {
                                        // 1️⃣ Lọc lại các môn
                                        handleClassChange(classId);
                                        // 2️⃣ Kiểm tra xem đã có môn được chọn chưa → nếu có, lấy id subject‑class
                                        const subjectId = examForm.getFieldValue('subjectId');
                                        handleSubjectClassChange(subjectId, classId);
                                    }}
                                >
                                    {classes.map((c) => (
                                        <Option key={c._id} value={c._id}>
                                            {c.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            {/* ------------ Submit ------------ */}
                            <Form.Item {...tailLayout}>
                                <Button type="primary" htmlType="submit">
                                    Tạo đề thi
                                </Button>
                            </Form.Item>
                        </Form>
                    </Spin>

                    {/* DANH SÁCH CÂU HỎI ĐÃ THÊM */}
                    <div className="questions-list">
                        <h3>Danh sách câu hỏi ({questions.length})</h3>
                        {questions.length === 0 ? (
                            <div className="empty-state">
                                <i>Chưa có câu hỏi nào. Hãy thêm câu hỏi ở bên dưới.</i>
                            </div>
                        ) : (
                            <div className="questions-container">
                                {questions.map((item, index) => (
                                    <div className="question-item" key={index}>
                                        <div className="question-content">
                                            <span className="question-number">
                                                Câu {index + 1}.
                                            </span>
                                            <div className="question-math">
                                                <MathJax>{`\\(${item}\\)`}</MathJax>
                                            </div>
                                        </div>
                                        <button
                                            className="delete-btn"
                                            onClick={() => removeQuestion(index)}
                                            title="Xóa câu hỏi"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Ô NHẬP CÂU HỎI MỚI */}
                    <div className="question-input-section">
                        <h3>Thêm câu hỏi mới</h3>
                        {/* TRUYỀN PROPS VÀO MATHINPUT */}
                        <MathInput
                            value={questionInput}
                            onChange={setQuestionInput}
                            showKeyboard={showVirtualKeyboard}
                            onToggleKeyboard={toggleKeyboard}
                        />
                        <div className="input-actions">
                            {/* GIỮ NÚT TOGGLE KEYBOARD Ở ĐÂY */}
                            <button
                                className="keyboard-toggle-btn"
                                onClick={toggleKeyboard}
                                title={showVirtualKeyboard ? "Tắt bàn phím ảo" : "Mở bàn phím ảo"}
                            >
                                {showVirtualKeyboard ? "⌨️ Tắt bàn phím" : "⌨️ Mở bàn phím"}
                            </button>
                            <button
                                className="add-question-btn"
                                onClick={addQuestion}
                                disabled={!questionInput.trim()}
                            >
                                ➕ Thêm câu hỏi
                            </button>
                        </div>
                    </div>

                    {/* NÚT XUẤT PDF */}
                    {/* <div className="export-section">
                        <button className="export-btn" onClick={exportPDF}>
                            📥 Xuất file PDF
                        </button>
                        <div className="export-info">
                            Đã có {questions.length} câu hỏi • Thời gian: {duration} phút
                        </div>
                    </div> */}
                </div>

                {/* ================= NỘI DUNG ẨN CHỈ DÙNG ĐỂ EXPORT ================= */}
                {/* <div id="pdf-content" className="pdf-export-content">
                    <h2 className="pdf-title">{title}</h2>
                    <p className="pdf-duration">
                        Thời gian làm bài: {duration} phút
                    </p>
                    <hr className="pdf-divider" />

                    <div className="pdf-questions">
                        {questions.map((item, index) => (
                            <div className="pdf-question" key={index}>
                                <div className="pdf-question-number">
                                    <strong>Câu {index + 1}.</strong>
                                </div>
                                <div className="pdf-question-content">
                                    <MathJax>{`\\(${item}\\)`}</MathJax>
                                </div>
                            </div>
                        ))}
                    </div>
                </div> */}
            </div>
        </MathJaxContext>
    );
};

export default ExamPage;

// const ExamPage = () => {
//     return (
//         <>
//             <div> ExamPage </div>
//         </>
//     );
// }

// export default ExamPage;