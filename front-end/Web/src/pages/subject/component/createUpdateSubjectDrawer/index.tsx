import { Form, message, Upload, Button } from 'antd';
import ProDrawerForm from '../../../../component/ProDrawerForm';
import './index.less';
import { useEffect, useState } from 'react';
import {
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProForm,
} from '@ant-design/pro-components';
import { UploadSimple } from 'phosphor-react';

import { getSubjectDetail, createSubject, updateSubject } from '../../../../api/subject';
import { STATUS_SUBJECT } from '../../../../utils/enum';

const CreateUpdateSubject = (props: {
  isOpenDrawer: boolean,
  setIsOpenDrawer: any,
  idSubject: any,
  setIdSubject: any,
  actionRef?: any,  // để reload lại table
}) => {
  const [form] = Form.useForm();
  const [disableButtonSubmit, setDisableButtonSubmit] = useState<any>(true);

  const VITE_CLOUDINARY_NAME = import.meta.env.VITE_CLOUDINARY_NAME;
  const VITE_CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const [subjectImage, setSubjectImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isImageChanged, setIsImageChanged] = useState(false);

  // Chọn ảnh
  const handleSelectImage = (file: File) => {
    setSubjectImage(file);
    setIsImageChanged(true);
    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Upload lên Cloudinary khi submit
  const uploadImage = async (): Promise<string | null> => {
    if (!subjectImage) return previewImage; // giữ ảnh cũ

    const formData = new FormData();
    formData.append("file", subjectImage);
    formData.append("upload_preset", VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "subjects");

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

  const onClose = () => {
    props.setIsOpenDrawer(false);
    props.setIdSubject(undefined);
    form.resetFields();
    setDisableButtonSubmit(true);
    setIsImageChanged(false);
    setSubjectImage(null);
    setPreviewImage(null);
  };

  /** GET DETAIL WHEN EDIT */
  const getDetail = async () => {
    try {
      const res = await getSubjectDetail(props.idSubject);
      const data = res.data.data;

      if (data.image) {
        setPreviewImage(data.image);
        setSubjectImage(null);
      }

      form.setFieldsValue({
        name: data.name,
        code: data.code,
        description: data.description,
        status: data.status === STATUS_SUBJECT.ACTIVE ? true : false, // BE dùng 1/2 → FE dùng true/false
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (props.isOpenDrawer) {
      if (props.idSubject) {
        getDetail(); // load detail nếu đang edit
      } else {
        form.resetFields(); // tạo mới thì reset form
        setPreviewImage(null);
        setSubjectImage(null);
      }
    }
  }, [props.isOpenDrawer]);

  const onChangeForm = () => {
    let disable = false;
    const valueForm = form.getFieldsValue();

    if (valueForm.name == undefined || valueForm.name == '') {
      disable = true;
    }
    if (valueForm.code == undefined || valueForm.code == '') {
      disable = true;
    }
    setDisableButtonSubmit(disable);
  };

  /** SUBMIT FORM */
  const onSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Upload ảnh lên Cloudinary
      const imageUrl = await uploadImage();

      const payload = {
        ...values,
        status: values.status ? 1 : 2, // convert FE boolean → BE number
        image: imageUrl ?? '',
      };

      if (props.idSubject) {
        // UPDATE
        await updateSubject(props.idSubject, payload);
        message.success("Cập nhật môn học thành công!");
      } else {
        // CREATE
        await createSubject(payload);
        message.success("Tạo môn học thành công!");
      }

      onClose();
      props.actionRef?.current?.reload(); // reload table

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ProDrawerForm
      titleHeader={props.idSubject ? "Chỉnh Sửa Môn Học" : "Tạo Môn Học Mới"}
      subTitleHeader={
        <>
          <span>
            Vui lòng điền đầy đủ vào các mục có dấu 
            {' '}
            ( <span className="color-red">*</span> )
          </span>
        </>
      }
      width={'30%'}
      drawerFormProps={{
        open: props.isOpenDrawer,
        form: form,
        onFieldsChange: onChangeForm,
        submitter: {
          searchConfig: {
            resetText: "Hủy",
            submitText: "Lưu",
          },
          submitButtonProps: {
            onClick: onSubmit,
            disabled: disableButtonSubmit
          },
        },
      }}
      drawerProps={{
        onClose: onClose,
        maskClosable: false,
        destroyOnClose: true,
      }}
    >
      <div>
        <ProForm.Item
          label="Ảnh minh họa môn học"
          name="image"
          valuePropName="file"
          getValueFromEvent={(e: any) => e}
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
          label="Tên môn học:"
          placeholder="Nhập tên môn học"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên môn học!" }]}
        />
        <ProFormText
          label="Mã môn học:"
          placeholder="Nhập mã môn học"
          name="code"
          rules={[{ required: true, message: "Vui lòng nhập mã môn học!" }]}
        />

        <ProFormSwitch
          label="Áp dụng?"
          name="status"
          initialValue={true}
        />

        <ProFormTextArea
          label="Mô tả:"
          placeholder="Nhập mô tả môn học"
          name="description"
        />
      </div>
    </ProDrawerForm>
  );
};

export default CreateUpdateSubject;
