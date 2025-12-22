import { Form, message, Spin } from "antd";
import { useEffect, useState } from "react";
import ProDrawerForm from "../../../../component/ProDrawerForm";
import { ProFormCheckbox } from "@ant-design/pro-components";
import { getRolePermissions, updateRolePermissions } from "../../../../api/permission";
import { MODULE_LABEL_MAP } from "../../../../utils/enum";
import './index.less'


const ConfigPermission = ({ isOpenDrawer, setIsOpenDrawer, currentRole, actionRef }: any) => {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm()
  const [disableButtonSubmit, setDisableButtonSubmit] = useState(true);

  const onClose = () => {
    setIsOpenDrawer(false);
    setPermissions([]);
    form.resetFields();
    setDisableButtonSubmit(true);
  };

  useEffect(() => {
    if (isOpenDrawer && currentRole) {
      fetchData();
    }
  }, [isOpenDrawer, currentRole]);

  const getModuleLabel = (module: string) => {
    return <div className="label-module">{MODULE_LABEL_MAP[module] || module.toUpperCase()}</div>;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getRolePermissions(currentRole.code);
      setPermissions(res);

      const initialValues: any = {};

      res.forEach((mod: any) => {
        initialValues[mod.module] = mod.permissions
          .filter((p: any) => p.assigned)
          .map((p: any) => p.code);
      });

      form.setFieldsValue(initialValues);
      setDisableButtonSubmit(true);
    } catch {
      message.error("Không tải được danh sách quyền");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      const values = form.getFieldsValue()
      console.log('values',values)
      const permissionCodes = Object.values(values).flat();
      console.log('permissionCodes',permissionCodes)
      await updateRolePermissions(currentRole.code, permissionCodes);

      message.success("Cập nhật quyền thành công");
      onClose();
      actionRef?.current?.reload();
    } catch {
      message.error("Cập nhật quyền thất bại");
    } finally {
      setLoading(false);
    }
  };

  const onChangeForm = () => {
    // Mỗi khi form thay đổi, bật nút submit
    setDisableButtonSubmit(false);
  };

  return (
    <ProDrawerForm
      titleHeader={'Gán quyền vai trò'}
      drawerFormProps={{
        open: isOpenDrawer,
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
        onClose,
        width: "50%",
        maskClosable: false,
        destroyOnClose: true,
      }}
    >
      <Spin spinning={loading}>
        {permissions.map((mod: any) => (
          <div
            key={mod.module}
            style={{
              border: "1px solid #f0f0f0",
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <ProFormCheckbox.Group
              name={mod.module}
              label={<strong>{getModuleLabel(mod.module)}</strong>}
              options={mod.permissions.map((p: any) => ({
                label: p.name,
                value: p.code,
              }))}
            />
          </div>
        ))}
      </Spin>
    </ProDrawerForm>
  );
};

export default ConfigPermission;
