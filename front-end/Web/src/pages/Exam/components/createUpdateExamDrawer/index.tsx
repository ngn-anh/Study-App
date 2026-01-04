import './index.css';
import { useEffect, useState } from "react";
import { Button, ConfigProvider, Form, message, Upload } from "antd";
import {
    ProFormText,
    ProFormTextArea,
    ProFormSelect,
    ProForm,
    ProFormDateTimePicker,
} from "@ant-design/pro-components";
import viVN from 'antd/locale/vi_VN';
import { getSubjects, getSubjectsByClass } from "../../../../api/subject";
import { getClasses, getClassesBySubject } from "../../../../api/class";
import { getBySubjectClass } from "../../../../api/subject-class";
import {
    createExam,
    getExamDetail,
    updateExam,
} from "../../../../api/exam";
import type { Class, Exam, Subject } from "../../../../types/typeObj";
import ProDrawerForm from "../../../../component/ProDrawerForm";
import { UploadSimple } from 'phosphor-react';
import dayjs from "dayjs";
import type { NotificationInstance } from "antd/es/notification/interface";

interface Props {
    isOpenDrawer: boolean;
    setIsOpenDrawer: (open: boolean) => void;
    examId?: string;
    setExamId?: (id?: string) => void;
    actionRef?: any;
    notify: NotificationInstance;
}

const CreateUpdateExam = ({ isOpenDrawer, setIsOpenDrawer, examId, setExamId, actionRef, notify }: Props) => {
    const [form] = Form.useForm();

    const [disableButtonSubmit, setDisableButtonSubmit] = useState(true);

    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
    const [allClasses, setAllClasses] = useState<Class[]>([]);
    const [subjectClassId, setSubjectClassId] = useState<string | null>(null);
    const [initialValues, setInitialValues] = useState<Exam>();

    const VITE_CLOUDINARY_NAME = import.meta.env.VITE_CLOUDINARY_NAME;
    const VITE_CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const [examImage, setExamImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isImageChanged, setIsImageChanged] = useState(false);

    // Chọn ảnh
    const handleSelectImage = (file: File) => {
        setExamImage(file);
        setIsImageChanged(true);
        const reader = new FileReader();
        reader.onload = () => setPreviewImage(reader.result as string); // hiển thị preview
        reader.readAsDataURL(file);
    };

    // Upload lên Cloudinary khi submit
    const uploadImage = async (): Promise<string | null> => {
        if (!examImage) return previewImage; // giữ ảnh cũ

        const formData = new FormData();
        formData.append("file", examImage);
        formData.append("upload_preset", VITE_CLOUDINARY_UPLOAD_PRESET);
        formData.append("folder", "exams");

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${VITE_CLOUDINARY_NAME}/image/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        const data = await res.json();
        return data.secure_url || '';
    };

    /** Close drawer */
    const onClose = () => {
        setIsOpenDrawer(false);
    };

    useEffect(() => {
        if (!isOpenDrawer) {
            form.resetFields();
            setDisableButtonSubmit(true);
            setSubjects(allSubjects);
            setClasses(allClasses);
            setSubjectClassId(null);
            setIsImageChanged(false);
            setExamImage(null);
            setPreviewImage(null);
        }
    }, [isOpenDrawer]);

    /** Load subjects & classes khi drawer mở */
    useEffect(() => {
        if (!isOpenDrawer || examId) return;

        const fetchInit = async () => {
            try {
                const subRes = await getSubjects();
                const clsRes = await getClasses();

                setSubjects(subRes.data);
                setClasses(clsRes.data);
                setAllSubjects(subRes.data);
                setAllClasses(clsRes.data);
            } catch (err) {
                console.error(err);
                notify.error({
                    message: `Không tải được danh sách môn học/lớp học`,
                    placement: "topRight",
                });
            }
        };

        fetchInit();
    }, [isOpenDrawer]);

    const isFormChanged = () => {
        if (!initialValues) return false;

        const current = form.getFieldsValue();

        return Object.keys(initialValues).some((key) => {
            const initVal = initialValues[key];
            const currVal = current[key];

            if (dayjs.isDayjs(initVal) && dayjs.isDayjs(currVal)) {
                return !initVal.isSame(currVal);
            }

            return initVal !== currVal;
        });
    };

    /** Load detail exam khi edit */
    const getDetail = async () => {
        if (!examId) return;

        try {
            const res = await getExamDetail(examId);
            const data = res.data;

            if (data.image) {
                setPreviewImage(data.image);
                setExamImage(null);
            }

            await Promise.all([
                getSubjects().then(res => {
                    setSubjects(res.data);
                    setAllSubjects(res.data);
                }),
                getClasses().then(res => {
                    setClasses(res.data);
                    setAllClasses(res.data);
                }),
            ]);

            const formValues = {
                name: data.name,
                description: data.description,
                type: data.type,
                difficulty: data.difficulty,
                duration: data.duration,
                startDate: dayjs(data.start_date),
                endDate: dayjs(data.end_date),
                subjectId: data.subject?._id,
                classId: data.class?._id,
            };
            form.setFieldsValue(formValues);
            setInitialValues(formValues);

        } catch (err) {
            console.error(err);
            notify.success({
                message: `Không tải được chi tiết đề thi. Vui lòng thử lại sau`,
                placement: "topRight",
            });
        }
    };

    useEffect(() => {
        if (!isOpenDrawer) return;

        if (examId) {
            getDetail();
        } else {
            form.resetFields();
            setPreviewImage(null);
            setExamImage(null);
            setDisableButtonSubmit(true);
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

        try {
            const res = await getBySubjectClass(classId, subjectId);
            if (res.errorCode == 0) {
                console.log("res.data._id: ", res.data._id);
                setSubjectClassId(res.data._id);
            }
        } catch {
            message.error("Không tồn tại quan hệ môn - lớp");
            setSubjectClassId(null);
        }
    };

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

        const isChanged = examId
            ? (isFormChanged() || isImageChanged) // update
            : true; // create → chỉ cần đủ field là được submit

        setDisableButtonSubmit(disable || !isChanged);
    };

    const onSubmit = async () => {
        try {
            const values = await form.validateFields();

            const resSC = await getBySubjectClass(values.classId, values.subjectId);
            const scId = resSC.data._id;

            if (!scId) {
                notify.error({
                    message: `Vui lòng chọn môn và lớp hợp lệ!`,
                    placement: "topRight",
                });
                return;
            }

            // Upload ảnh minh họa
            const imageUrl = await uploadImage();
            console.log("loanhtm imageUrl: ", imageUrl);
            const payload = {
                name: values.name,
                description: values.description || '',
                type: Number(values.type),
                difficulty: Number(values.difficulty),
                duration: Number(values.duration),
                startDate: dayjs(values.startDate).toISOString(),
                endDate: dayjs(values.endDate).toISOString(),
                subjectClassId: scId,
                image: imageUrl ?? '',
            };

            if (examId) {
                const res = await updateExam(examId, payload);
                if (res.status === 200) {
                    notify.success({
                        message: `Cập nhật ${payload.name} thành công!`,
                        placement: "topRight",
                    });
                } else {
                    notify.error({
                        message: `Có lỗi xảy ra. Vui lòng thử lại sau.`,
                        placement: "topRight",
                    });
                }
            } else {
                const res = await createExam(payload);
                if (res.status === 201) {
                    notify.success({
                        message: `Tạo đề thi mới thành công!`,
                        placement: "topRight",
                    });
                } else {
                    notify.error({
                        message: `Có lỗi xảy ra. Vui lòng thử lại sau.`,
                        placement: "topRight",
                    });
                }
            }

            onClose();
            actionRef?.current?.reload();
        } catch (err) {
            console.error(err);
            notify.error({
                message: `Có lỗi xảy ra. Vui lòng thử lại sau.`,
                placement: "topRight",
            });
        }
    };

    useEffect(() => {
        if (!examId) return;
        onChangeForm();
    }, [isImageChanged]);

    return (
        <ConfigProvider locale={viVN}>
            <ProDrawerForm
                titleHeader={examId ? "Chỉnh sửa đề thi" : "Tạo đề thi mới"}
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
                                    return false;
                                }}
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
                            rules={[
                                { required: true, message: "Vui lòng nhập thời lượng!" },
                                {
                                    pattern: /^[0-9]+$/,
                                    message: "Vui lòng nhập số!",
                                },
                            ]}
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
                                // defaultValue: dayjs(), // mặc định là ngày giờ hiện tại
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
                                // defaultValue: dayjs(), // mặc định là ngày giờ hiện tại
                            }}
                        />
                    </div>
                </div>
            </ProDrawerForm >
        </ConfigProvider>
    );
};

export default CreateUpdateExam;
