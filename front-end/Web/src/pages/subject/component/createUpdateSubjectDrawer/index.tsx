import { Form, message } from 'antd';
import ProDrawerForm from '../../../../component/ProDrawerForm';
import './index.less';
import { useEffect, useState } from 'react';
import {
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';

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

  const onClose = () => {
    props.setIsOpenDrawer(false);
    props.setIdSubject(undefined);
    form.resetFields();
    setDisableButtonSubmit(true)
  };

  /** GET DETAIL WHEN EDIT */
  const getDetail = async () => {
    try {
      const res = await getSubjectDetail(props.idSubject);
      const data = res.data.data;

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

      const payload = {
        ...values,
        status: values.status ? 1 : 2, // convert FE boolean → BE number
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
