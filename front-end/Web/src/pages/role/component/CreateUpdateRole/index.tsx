import { Form, message } from 'antd';
import ProDrawerForm from '../../../../component/ProDrawerForm';
import './index.less';
import { useEffect, useState } from 'react';
import {
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import {
  createRole,
  getRoleDetail,
  updateRole,
} from '../../../../api/role';

const CreateUpdateRole = (props: {
  isOpenDrawer: boolean;
  setIsOpenDrawer: any;
  roleCode?: string; // dùng code thay vì id
  setRoleCode: any;
  actionRef?: any;
}) => {
  const [form] = Form.useForm();
  const [disableButtonSubmit, setDisableButtonSubmit] = useState(true);

  const onClose = () => {
    props.setIsOpenDrawer(false);
    props.setRoleCode(undefined);
    form.resetFields();
    setDisableButtonSubmit(true);
  };

  /** GET DETAIL WHEN EDIT */
  const getDetail = async () => {
    try {
      const res = await getRoleDetail(props.roleCode);
      const data = res.data;

      form.setFieldsValue({
        name: data.name,
        code: data.code,
        description: data.description,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (props.isOpenDrawer) {
      if (props.roleCode) {
        getDetail(); // edit
      } else {
        form.resetFields(); // create
      }
    }
  }, [props.isOpenDrawer]);

  /** ENABLE / DISABLE SUBMIT */
  const onChangeForm = () => {
    const values = form.getFieldsValue();
    let disable = false;

    if (!values.name) disable = true;
    if (!values.code) disable = true;

    setDisableButtonSubmit(disable);
  };

  /** SUBMIT */
  const onSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (props.roleCode) {
        // UPDATE
        await updateRole(props.roleCode, {
            name: values.name,
            description: values.description
        });
        message.success('Cập nhật vai trò thành công!');
      } else {
        // CREATE
        await createRole(values);
        message.success('Tạo vai trò thành công!');
      }

      onClose();
      props.actionRef?.current?.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ProDrawerForm
      titleHeader={props.roleCode ? 'Chỉnh sửa vai trò' : 'Tạo vai trò mới'}
      subTitleHeader={
        <span>
          Vui lòng điền đầy đủ vào các mục có dấu{' '}
          (<span className="color-red">*</span>)
        </span>
      }
      width={'30%'}
      drawerFormProps={{
        open: props.isOpenDrawer,
        form,
        onFieldsChange: onChangeForm,
        submitter: {
          searchConfig: {
            resetText: 'Hủy',
            submitText: 'Lưu',
          },
          submitButtonProps: {
            onClick: onSubmit,
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
        <ProFormText
          label="Tên vai trò:"
          placeholder="Nhập tên vai trò"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên vai trò!' }]}
        />

        <ProFormText
          label="Mã vai trò:"
          placeholder="Nhập mã vai trò (vd: admin, teacher)"
          name="code"
          rules={[{ required: true, message: 'Vui lòng nhập mã vai trò!' }]}
          disabled={!!props.roleCode} // ❗ không cho sửa code khi update
        />

        <ProFormTextArea
          label="Mô tả"
          placeholder="Nhập mô tả vai trò"
          name="description"
        />
      </div>
    </ProDrawerForm>
  );
};

export default CreateUpdateRole;
