import { Form, message } from 'antd';
import ProDrawerForm from '../../../../component/ProDrawerForm';
import './index.less';
import { useEffect, useState } from 'react';
import {
    ProFormSelect,
} from '@ant-design/pro-components';
import { createProgram, getDetailProgram } from '../../../../api/class';
import { getSubjects } from '../../../../api/subject';


const ConfigProgramDrawer = (props: {
  isOpenDrawer: boolean,
  setIsOpenDrawer: any,
  idClass: any,
  setIdClass: any,
  actionRef?: any,  // để reload lại table
}) => {
  const [form] = Form.useForm();
  const [disableButtonSubmit, setDisableButtonSubmit] = useState<any>(true);
  const [infoClass, setInfoClass] = useState<any>();
  const [optionSubject, setOptionSubject] = useState<any>([]);

  const onClose = () => {
    props.setIsOpenDrawer(false);
    props.setIdClass(undefined);
    form.resetFields();
    setDisableButtonSubmit(true)
  };

  /** GET DETAIL WHEN EDIT */
  const getDetail = async () => {
    try {
      const res = await getDetailProgram(props.idClass);
      const data = res.data;
      setInfoClass(data)

      form.setFieldsValue({
        subject_ids: data.subjects?.map((item: any)=> item._id),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const loadOptionSubjects = async () => {
    try {
        const res = await getSubjects({ status: 1 }); // chỉ lấy subject hợp lệ
        if (res && res.data) {
        // map ra options: { label, value }
        const options = res.data.map((item: any) => ({
            label: item.name,
            value: item._id,
        }));
        setOptionSubject(options);
        }
    } catch (error) {
        console.log("Lỗi khi load subject:", error);
    }
    };

  useEffect(() => {
    if (props.isOpenDrawer && props.idClass) {
      getDetail();
      loadOptionSubjects();
    }
  }, [props.isOpenDrawer]);

  const onChangeForm = () => {
    setDisableButtonSubmit(false);
  };

  /** SUBMIT FORM */
  const onSubmit = async () => {
    try {
      const values = await form.validateFields();

      await createProgram(props.idClass, values.subject_ids);
      message.success("Cấu hình chương trình học thành công!");
      onClose();
      props.actionRef?.current?.reload(); // reload table

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ProDrawerForm
      titleHeader={"Cấu hình chương trình học"}
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
        <div className='info-class'>
            <div className='info-label'>Thông tin lớp học</div>
            <div><span className='info-class-item'>Lớp học:</span>{infoClass?.name}</div>
            <div><span className='info-class-item'>Mã lớp học:</span>{infoClass?.code}</div>
        </div>

        <div>
            <div className='info-label'>Cấu hình chương trình học</div>
            <ProFormSelect
                label="Môn học"
                placeholder="Chọn môn học"
                name="subject_ids"
                options={optionSubject}
                mode='multiple'
                fieldProps={{
                    maxTagCount:"responsive"
                }}
            />
        </div>
      </div>
    </ProDrawerForm>
  );
};

export default ConfigProgramDrawer;
