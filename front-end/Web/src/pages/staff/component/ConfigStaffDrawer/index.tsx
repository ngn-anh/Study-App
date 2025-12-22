import { Form, message, Tag } from 'antd';
import ProDrawerForm from '../../../../component/ProDrawerForm';
import './index.less';
import { useEffect, useState } from 'react';
import { ProFormSelect } from '@ant-design/pro-components';
import { getUserDetail, updateProfile } from '../../../../api/user';
import { getRoleOptions } from '../../../../api/role';

const ConfigStaffRoleDrawer = (props: {
  isOpenDrawer: boolean;
  setIsOpenDrawer: any;
  idStaff: any;
  setIdStaff: any;
  actionRef?: any;
}) => {
  const [form] = Form.useForm();
  const [disableButtonSubmit, setDisableButtonSubmit] = useState(true);
  const [staffInfo, setStaffInfo] = useState<any>();
  const [roleOptions, setRoleOptions] = useState<any[]>([]);

  const onClose = () => {
    props.setIsOpenDrawer(false);
    props.setIdStaff(undefined);
    form.resetFields();
    setDisableButtonSubmit(true);
  };

  /** GET USER DETAIL */
  const getDetail = async () => {
    try {
      const res = await getUserDetail(props.idStaff);
      const data = res.data;

      setStaffInfo(data);

      form.setFieldsValue({
        role: data.role,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getRoles = async () => {
    try {
      const res = await getRoleOptions();
      setRoleOptions(res);
    } catch (err) {
      message.error('Không tải được danh sách vai trò');
    }
  };

  useEffect(() => {
    if (props.isOpenDrawer && props.idStaff) {
      getDetail();
      getRoles();
    }
  }, [props.isOpenDrawer]);

  const onChangeForm = () => {
    setDisableButtonSubmit(false);
  };

  /** SUBMIT */
  const onSubmit = async () => {
    try {
      const values = await form.validateFields();

      await updateProfile({
        user_id: props.idStaff,
        role: values.role,
      });

      message.success('Cập nhật vai trò nhân viên thành công!');
      onClose();
      props.actionRef?.current?.reload();
    } catch (error) {
      console.log(error);
    }
  };

 const renderRoleTag = (roleCode: string) => {
    const role = roleOptions.find(r => r.value === roleCode);
    if (!role) return null;

    return <Tag color="blue">{role.label}</Tag>;
  };
  
  return (
    <ProDrawerForm
      titleHeader={"Cấu hình vai trò nhân viên"}
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
      {/* ===== Thông tin nhân viên ===== */}
      <div className="info">
        <div className="info-label">Thông tin nhân viên</div>
        <div className='mg-b-4'>
          <span className="info-item">Họ tên:</span>
          {staffInfo?.full_name || staffInfo?.username}
        </div>
        <div className='mg-b-4'>
          <span className="info-item">Tài khoản:</span>
          {staffInfo?.username}
        </div>
        <div className='mg-b-4'>
          <span className="info-item">Email:</span>
          {staffInfo?.email || 'n/a'}
        </div>
        <div>
          <span className="info-item">Vai trò hiện tại:</span>
          {renderRoleTag(staffInfo?.role)}
        </div>
      </div>

      {/* ===== Cấu hình vai trò ===== */}
      <div>
        <div className="info-label">Cấu hình vai trò</div>
        <ProFormSelect
          label="Vai trò"
          name="role"
          placeholder="Chọn vai trò"
          options={roleOptions}
          rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
        />
      </div>
    </ProDrawerForm>
  );
};

export default ConfigStaffRoleDrawer;
