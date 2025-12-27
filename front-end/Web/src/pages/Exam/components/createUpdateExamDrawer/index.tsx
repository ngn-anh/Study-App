import './index.css';
import { useEffect, useState } from "react";
import { Button, ConfigProvider, Form, message, Upload } from "antd";
import {
    ProFormText,
    ProFormTextArea,
    ProFormSelect,
    ProForm,
    ProFormDateTimePicker,
    // viVNIntl,
    // ProFormSwitch
} from "@ant-design/pro-components";
import viVN from 'antd/locale/vi_VN';
import { getSubjects, getSubjectsByClass } from "../../../../api/subject";
import { getClasses, getClassesBySubject } from "../../../../api/class";
import { getBySubjectClass } from "../../../../api/subject-class";
import {
    getExamDetail,
    // createExam,
    // updateExam
} from "../../../../api/exam";
import type { Class, Subject } from "../../../../types/typeObj";
import ProDrawerForm from "../../../../component/ProDrawerForm";
import { UploadSimple } from 'phosphor-react';
import dayjs from "dayjs";
// import 'dayjs/locale/vi';
// dayjs.locale('vi');

interface Props {
    isOpenDrawer: boolean;
    setIsOpenDrawer: (open: boolean) => void;
    examId?: string;
    setExamId?: (id?: string) => void;
    actionRef?: any;
}

const CreateUpdateExam = ({ isOpenDrawer, setIsOpenDrawer, examId, setExamId, actionRef }: Props) => {
    const [form] = Form.useForm();
    const [disableButtonSubmit, setDisableButtonSubmit] = useState(true);

    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
    const [allClasses, setAllClasses] = useState<Class[]>([]);
    const [subjectClassId, setSubjectClassId] = useState<string | null>(null);

    const CLOUDINARY_NAME = import.meta.env.CLOUDINARY_NAME;
    // const CLOUDINARY_UPLOAD_PRESET = import.meta.env.CLOUDINARY_UPLOAD_PRESET;
    const CLOUDINARY_UPLOAD_PRESET = "exam-datn";

    const [examImage, setExamImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Chọn ảnh
    const handleSelectImage = (file: File) => {
        setExamImage(file);
        // form.setFieldValue('image', file);
        // const reader = new FileReader();
        // reader.onload = () => setPreviewImage(reader.result as string);
        // reader.readAsDataURL(file);
        const reader = new FileReader();
        reader.onload = () => setPreviewImage(reader.result as string); // hiển thị preview
        reader.readAsDataURL(file);
    };

    // Upload lên Cloudinary khi submit
    const uploadImage = async (): Promise<string | null> => {
        if (!examImage) return null;

        const formData = new FormData();
        formData.append("file", examImage);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`, {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        console.log("Cloudinary response:", data);
        return data.secure_url || null; // trả về url ảnh
    };


    /** Close drawer */
    const onClose = () => {
        setIsOpenDrawer(false);
        setExamId?.(undefined);
        form.resetFields();
        setDisableButtonSubmit(true);
        setSubjects(allSubjects);
        setClasses(allClasses);
        setSubjectClassId(null);
        setExamImage(null);
        setPreviewImage(null);
    };

    /** Load subjects & classes khi drawer mở */
    useEffect(() => {
        if (!isOpenDrawer) return;

        const fetchInit = async () => {
            try {
                const subRes = await getSubjects();
                const clsRes = await getClasses();

                setSubjects(subRes.data);
                setClasses(clsRes.data);
                setAllSubjects(subRes.data);
                setAllClasses(clsRes.data);
            } catch (err) {
                message.error("Không tải được danh sách môn / lớp");
            }
        };

        fetchInit();
    }, [isOpenDrawer]);

    /** Load detail khi edit */
    const getDetail = async () => {
        if (!examId) return;

        try {
            const res = await getExamDetail(examId);
            const data = res.data.data;

            form.setFieldsValue({
                name: data.name,
                description: data.description,
                type: data.type,
                difficulty: data.difficulty,
                duration: data.duration,
                startDate: dayjs(data.startDate),
                endDate: dayjs(data.endDate),
                subjectId: data.subject?._id,
                classId: data.class?._id,
            });

            if (data.subject && data.class) {
                const resSC = await getBySubjectClass(data.class._id, data.subject._id);
                setSubjectClassId(resSC.data.data._id);
            }
        } catch (err) {
            message.error("Không tải được chi tiết đề thi");
        }
    };

    useEffect(() => {
        if (isOpenDrawer) {
            if (examId) {
                getDetail();
            } else {
                form.resetFields();
                setDisableButtonSubmit(true);
            }
        }
    }, [isOpenDrawer, examId]);

    /** Handle subject/class changes */
    const handleSubjectChange = async (subjectId: string) => {
        if (!subjectId) {
            setClasses(allClasses);
            return;
        }

        const res = await getClassesBySubject(subjectId);
        setClasses(res.data);

        // Kiểm tra classId hiện tại còn hợp lệ không
        const currentClassId = form.getFieldValue("classId");
        if (!res.data.find((c) => c._id === currentClassId)) {
            form.setFieldsValue({ classId: undefined });
        }
        setSubjectClassId(null);
    };

    const handleClassChange = async (classId: string) => {
        if (!classId) {
            setSubjects(allSubjects);
            return;
        }

        const res = await getSubjectsByClass(classId);
        if (res.errorCode === 0) {
            setSubjects(res.data);
        }

        // Kiểm tra subjectId hiện tại còn hợp lệ không
        const currentSubjectId = form.getFieldValue("subjectId");
        if (!res.data.find((s) => s._id === currentSubjectId)) {
            form.setFieldsValue({ subjectId: undefined });
        }
        setSubjectClassId(null);
    };

    const handleSubjectClassChange = async (subjectId?: string, classId?: string) => {
        if (!subjectId || !classId) {
            setSubjectClassId(null);
            return;
        }
        console.log("loanhtm subjectId: ", subjectId, "classId: ", classId);
        try {
            const res = await getBySubjectClass(classId, subjectId);
            console.log("loanhtm getBySubjectClass: ", res);
            if (res.errorCode == 0) {
                console.log("res.data._id: ", res.data._id);
                setSubjectClassId(res.data._id);
            }
        } catch {
            message.error("Không tồn tại quan hệ môn - lớp");
            setSubjectClassId(null);
        }
    };

    /** On change form to enable/disable submit */
    const onChangeForm = () => {
        const values = form.getFieldsValue();
        const disable =
            !values.name ||
            !values.duration ||
            !values.type ||
            !values.startDate ||
            !values.endDate ||
            !values.subjectId ||
            !values.classId;
        setDisableButtonSubmit(disable);
    };

    const onSubmit = async () => {
        console.log(">>>")
        try {
            const values = await form.validateFields();

            // Lấy trực tiếp mapping từ API
            const resSC = await getBySubjectClass(values.classId, values.subjectId);
            const scId = resSC.data._id;

            if (!scId) {
                message.error("Vui lòng chọn môn và lớp hợp lệ");
                return;
            }

            console.log(">>>3")
            // Upload ảnh minh họa
            const imageUrl = await uploadImage();
            console.log("loanhtm imageUrl: ", imageUrl);
            const payload = {
                name: values.name,
                description: values.description || '',
                type: values.type,
                difficulty: values.difficulty,
                duration: values.duration,
                startDate: dayjs(values.startDate).toISOString(),
                endDate: dayjs(values.endDate).toISOString(),
                subjectClassId: scId,
                image: imageUrl, // thêm đường dẫn ảnh
            };

            if (examId) {
                // await updateExam(examId, payload);
                console.log("updateExam: ", payload);
                message.success("Cập nhật đề thi thành công!");
            } else {
                // await createExam(payload);
                console.log("createExam: ", payload);
                message.success("Tạo đề thi thành công!");
            }

            onClose();
            actionRef?.current?.reload();
        } catch (err) {
            console.log("Lỗi khi lưu đề thi");
            // message.error("Lỗi khi lưu đề thi");
        }
    };

    return (
        <ConfigProvider locale={viVN}>
            <ProDrawerForm
                titleHeader={examId ? "Chỉnh sửa đề kiểm tra" : "Tạo đề kiểm tra mới"}
                subTitleHeader={
                    <>
                        Vui lòng điền đầy đủ vào các mục có dấu (<span className="color-red">*</span>)
                    </>
                }
                width="50%"
                drawerFormProps={{
                    open: isOpenDrawer,
                    form,
                    onFinish: onSubmit,
                    onFieldsChange: onChangeForm,
                    submitter: {
                        searchConfig: {
                            resetText: "Hủy",
                            submitText: examId ? "Cập nhật" : "Tạo đề",
                        },
                        submitButtonProps: {
                            disabled: disableButtonSubmit,
                        },
                    },
                }}
                drawerProps={{
                    onClose,
                    maskClosable: false,
                    destroyOnClose: true,
                }}
            >
                <div>
                    {/* Ảnh minh họa */}
                    {/* <ProForm.Item label="Ảnh minh họa đề thi" name="image">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {previewImage && (
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    style={{ width: 150, height: 100, objectFit: 'cover', borderRadius: 4 }}
                                />
                            )}
                            <Upload
                                accept="image/*"
                                showUploadList={false}
                                beforeUpload={(file) => {
                                    handleSelectImage(file);
                                    return false; // prevent auto upload
                                }}
                            >
                                <Button icon={<UploadSimple />}>Chọn ảnh</Button>
                            </Upload>
                        </div>
                    </ProForm.Item> */}
                    <ProForm.Item
                        label="Ảnh minh họa đề thi"
                        name="image"
                        valuePropName="file" // dùng để ProForm nhận file
                        getValueFromEvent={(e: any) => e} // trả file cho form
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {previewImage && (
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    style={{ width: 150, height: 100, objectFit: 'cover', borderRadius: 4 }}
                                />
                            )}
                            <Upload
                                accept="image/*"
                                showUploadList={false}
                                beforeUpload={(file) => {
                                    handleSelectImage(file);
                                    return false; // prevent auto upload
                                }}
                            // accept="image/*"
                            // showUploadList={false} // ẩn list
                            // maxCount={1}
                            // beforeUpload={(file) => {
                            //     setExamImage(file); // lưu file để upload
                            //     const reader = new FileReader();
                            //     reader.onload = () => setPreviewImage(reader.result as string); // lưu preview
                            //     reader.readAsDataURL(file);
                            //     return false; // prevent auto upload
                            // }}
                            >
                                <Button icon={<UploadSimple />}>Chọn ảnh</Button>
                            </Upload>
                        </div>
                    </ProForm.Item>

                    <ProFormText
                        label="Tên đề thi"
                        name="name"
                        placeholder="Nhập tên đề thi"
                        rules={[{ required: true, message: "Vui lòng nhập tên đề thi!" }]}
                    />

                    <ProFormTextArea
                        label="Mô tả"
                        name="description"
                        placeholder="Nhập mô tả"
                    />

                    <div className='type-duration-difficulty'>
                        <ProFormSelect
                            label="Loại đề thi"
                            name="type"
                            placeholder="--Chọn loại đề thi--"
                            options={[
                                { label: "Thi thử", value: 1 },
                                { label: "Đề luyện", value: 2 },
                            ]}
                            rules={[{ required: true, message: "Vui lòng chọn loại đề thi!" }]}
                        />

                        <ProFormText
                            label="Thời lượng (phút)"
                            name="duration"
                            placeholder="Nhập thời lượng"
                            rules={[{ required: true, message: "Vui lòng nhập thời lượng!" }]}
                        />

                        <ProFormSelect
                            label="Độ khó"
                            name="difficulty"
                            placeholder="--Chọn độ khó--"
                            options={[
                                { label: "Dễ", value: 1 },
                                { label: "Trung bình", value: 2 },
                                { label: "Khó", value: 3 },
                            ]}
                        />
                    </div>

                    <div className="class-subject">
                        <ProFormSelect
                            label="Môn học"
                            name="subjectId"
                            className="subject-contain"
                            placeholder="--Chọn môn học--"
                            options={subjects.map((s) => ({ label: s.name, value: s._id }))}
                            rules={[{ required: true, message: "Vui lòng chọn môn học!" }]}
                            fieldProps={{
                                onChange: (subjectId: string) => {
                                    handleSubjectChange(subjectId);
                                    handleSubjectClassChange(subjectId, form.getFieldValue("classId"));
                                },
                            }}
                        />

                        <ProFormSelect
                            label="Lớp học"
                            name="classId"
                            className="class-contain"
                            placeholder="--Chọn lớp học--"
                            options={classes.map((c) => ({ label: c.name, value: c._id }))}
                            rules={[{ required: true, message: "Vui lòng chọn lớp học!" }]}
                            fieldProps={{
                                onChange: (classId: string) => {
                                    handleClassChange(classId);
                                    handleSubjectClassChange(form.getFieldValue("subjectId"), classId);
                                },
                            }}
                        />
                    </div>
                    <div className='startDate-endDate'>
                        <ProFormDateTimePicker
                            label="Ngày bắt đầu"
                            name="startDate"
                            className='startDate'
                            placeholder="Chọn ngày bắt đầu"
                            rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
                            fieldProps={{
                                showTime: true,
                                format: 'DD/MM/YYYY HH:mm',
                                defaultValue: dayjs(), // mặc định là ngày giờ hiện tại
                                onChange: (value) => {
                                    // Khi startDate thay đổi, validate lại endDate
                                    const endDate = form.getFieldValue('endDate');
                                    if (endDate && value && endDate.isBefore(value)) {
                                        form.setFields([
                                            {
                                                name: 'endDate',
                                                errors: ['Ngày kết thúc phải lớn hơn hoặc bằng Ngày bắt đầu'],
                                            },
                                        ]);
                                    } else {
                                        form.setFields([
                                            { name: 'endDate', errors: [] },
                                        ]);
                                    }
                                },
                            }}
                        />

                        <ProFormDateTimePicker
                            label="Ngày kết thúc"
                            name="endDate"
                            placeholder="Chọn ngày kết thúc"
                            rules={[
                                { required: true, message: "Vui lòng chọn ngày kết thúc!" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const startDate = getFieldValue('startDate');
                                        if (value && startDate && value.isBefore(startDate)) {
                                            return Promise.reject('Ngày kết thúc phải lớn hơn hoặc bằng Ngày bắt đầu');
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                            fieldProps={{
                                showTime: true,
                                format: 'DD/MM/YYYY HH:mm',
                                defaultValue: dayjs(), // mặc định là ngày giờ hiện tại
                            }}
                        />
                    </div>
                </div>
            </ProDrawerForm >
        </ConfigProvider>
    );
};

export default CreateUpdateExam;
