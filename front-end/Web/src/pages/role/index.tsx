import { Button, message, Tooltip, Row, Col } from "antd";
import PageContainerFixed from "../../component/PageContainerFixed";
import { MagnifyingGlass, Plus, Trash, Lock, NotePencil, User } from "phosphor-react";
import './index.less'
import { ProForm,  ProFormText } from "@ant-design/pro-components";
import { useForm } from "antd/es/form/Form";
import ProTableFixed from "../../component/ProTableFixed";
import {  useRef, useState } from "react";
import { STATUS_SUBJECT } from "../../utils/enum";
import CustomModal from "../../component/CustomModal";
import { deleteRole, getRoles } from "../../api/role";
import ConfigPermission from "./component/ConfigPermission";
import CreateUpdateRole from "./component/CreateUpdateRole";
import { PermissionGuard } from "../../components/PermissionGuard";
import { hasAnyPermission } from "../../utils/permission";


export default function RolePage() {
    const [form] = useForm();
    const filter = useRef({});
    const [filterParams, setFilterParams] = useState<any>({});
    const [isOpenModal, setOpenModal] = useState(false);
    const [isOpenPermissionDrawer, setOpenPermissionDrawer] = useState(false);
    const [currentRole, setCurrentRole] = useState<any>(null);
    const [roleDelete, setRoleDelete] = useState<any>();
    const [isOpenRoleDrawer, setIsOpenRoleDrawer] = useState(false);
    const [currentRoleCode, setCurrentRoleCode] = useState<string | undefined>();
    const actionRef = useRef<any>();
    

const requestGetDataSource = async (param: any) => {
  const params = {
    ...filterParams,
    page: param.current,
    limit: param.pageSize,
  };

  const res = await getRoles(params);

  return {
    data: res.data.map((item: any) => ({
      id: item.id || item._id,
      name: item.name,
      code: item.code,
      description: item.description,
      permissions_count: item.permissions_count,
      users_count: item.users_count,
      status: item.status ?? 1,
    })),
    total: res.meta.total,
  };
};

  const search = (param = {}) => {
    const filterParamsData = { ...form.getFieldsValue(), ...param };
    setFilterParams(filterParamsData);
  };

  const getStatus =(status: number)=>{
    if(status == STATUS_SUBJECT.ACTIVE) return <div className="lbl-active">Đang hoạt động</div>
    return <div className="lbl-inactive">Không hoạt động</div>
  }

  const getPermission =(count: number, row: any)=>{
    const canManagePermissions = hasAnyPermission(['permission.create', 'permission.update']);
    
    return <div 
      className="lbl-count" 
      onClick={()=>{
        if (!canManagePermissions) return;
        setOpenPermissionDrawer(true)
        setCurrentRole(row)
      }}
      style={{
        cursor: canManagePermissions ? 'pointer' : 'default',
      }}
    >
        <Lock size={12} weight="bold"/>
        <div>{count}</div>
    </div>
  }

  const handleOkDelete= async()=>{
      try {
        await deleteRole(roleDelete.code);

        message.success('Xoá vai trò thành công!');
        setOpenModal(false);
        setRoleDelete(undefined);

        actionRef.current?.reload();
      } catch (error: any) {
        const msg =
          error?.response?.data?.message ||
          'Xoá vai trò thất bại';

        message.error(msg);
      }
  }

  const handleCancelDelete=()=>{
    setOpenModal(false)
    setRoleDelete(undefined);
  }

  const onOpenDelete = async (row: any) => {
    setRoleDelete(row);
    setOpenModal(true);
  };

  const getContentDelete = () => {
     if (!roleDelete) return "";

    return (
      <>
        Bạn có chắc muốn xóa vai trò{" "}
        <b>{roleDelete.name}</b>?
      </>
    );
  };

  const columns = [
  {
    title: "Tên vai trò",
    dataIndex: "name",
    key: "name",
    width: 200,
    fixed: "left",
  },
  {
    title: "Mã vai trò",
    dataIndex: "code",
    key: "code",
    width: 150,
  },
  {
    title: "Mô tả",
    dataIndex: "description",
    key: "description",
    width: 250,
    render: (val: string) => val || "—",
  },
  {
    title: "Số quyền",
    dataIndex: "permissions_count",
    key: "permissions_count",
    width: 120,
    render: (val: number, row: any) =>getPermission(val,row),
  },
   {
    title: "Số người sử dụng",
    dataIndex: "users_count",
    key: "users_count",
    width: 150,
    render: (val: number, row: any) => {
      return  <div className="lbl-count">
        <User size={12} weight="bold"/>
        <div>{row.users_count}</div>
    </div>
    }
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    width: 140,
    render: (status: number) => getStatus(status),
  },
  {
    title: "Tác vụ",
    key: "action",
    width: 100,
    fixed: "right",
    align:"right",
    render: (_: any, row: any) => {
      const hasUsers = row.users_count > 0;

      return (
        <div className="cpn-action">
          {/* Button chỉnh sửa - cần quyền role.update */}
          <PermissionGuard requiredPermissions="role.update">
            <Tooltip title={hasUsers ? 'Vai trò đang được sử dụng' : 'Sửa'}>
              <NotePencil
                color={hasUsers ? '#999' : '#0c4299'}
                className={hasUsers ? 'cursor-not-allowed cpn-action-edit' : 'cursor-pointer cpn-action-edit'}
                onClick={() => {
                  if (hasUsers) return;
                  setCurrentRoleCode(row.code);
                  setIsOpenRoleDrawer(true);
                }}
              />
            </Tooltip>
          </PermissionGuard>

          {/* Button xoá - cần quyền role.delete */}
          <PermissionGuard requiredPermissions="role.delete">
            <Tooltip
              title={
                hasUsers
                  ? 'Không thể xoá vai trò đang được sử dụng'
                  : 'Xoá vai trò'
              }
            >
              <Trash
                color={hasUsers ? '#999' : '#d63b3b'}
                className={hasUsers ? 'cursor-not-allowed' : 'cursor-pointer'}
                onClick={() => {
                  if (hasUsers) return;
                  onOpenDelete(row);
                }}
              />
            </Tooltip>
          </PermissionGuard>
        </div>
      );
    }
  }
];


    return (
        <PageContainerFixed
            header={{
                title: "Danh sách vai trò",
                extra: (
                  <PermissionGuard requiredPermissions="role.create">
                    <Button
                      size={'large'}
                      type="primary"
                      className="ant-btn-primary"
                      onClick={() => {
                        setCurrentRoleCode(undefined); // create
                        setIsOpenRoleDrawer(true);
                      }}
                    >
                      <Plus weight="bold"/> <span>Vai Trò Mới</span>
                    </Button>
                  </PermissionGuard>
                )
            }}
    >
        <div className="role-list-page">
            <ProForm submitter={false} form={form} className="form-search">
                <Row gutter={[16, 16]}>
                  <Col span={10}>
                        <ProFormText
                        width="100%"
                        placeholder={"Nhập tên vai trò để tìm kiếm"}
                        fieldProps={{
                        prefix: <MagnifyingGlass color="#083070" weight="bold" />,
                        }}
                        name="name"
                    />
                    </Col>
                  <Col span={14}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <Button
                                className="ant-btn-secondary"
                                onClick={() => {
                                  setFilterParams({});
                                  form.resetFields();
                                }}
                            >
                                Xóa bộ lọc
                            </Button>
                            <Button
                                className="ant-btn-primary"
                                onClick={() => search(filter.current)}
                            >
                            Tìm kiếm
                            </Button>
                        </div>
                    </Col>
                </Row>
            </ProForm>
        <div>
          <ProTableFixed
            headerFixedHeight={380}
            params={filterParams}
            actionRef={actionRef}
            request={requestGetDataSource}
            rowKey="id"
            columns={columns}
            tableAlertRender={false}
          />
        </div>
        <CreateUpdateRole
          isOpenDrawer={isOpenRoleDrawer}
          setIsOpenDrawer={setIsOpenRoleDrawer}
          roleCode={currentRoleCode}
          setRoleCode={setCurrentRoleCode}
          actionRef={actionRef}
        />
        <ConfigPermission
          isOpenDrawer={isOpenPermissionDrawer}
          setIsOpenDrawer={setOpenPermissionDrawer}
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          actionRef={actionRef}
        />

         <CustomModal
            open={isOpenModal}
            type="warning"
            title="Xoá Vai Trò"
            content={getContentDelete()}
            textOk="Xoá"
            textCancel="Hủy"
            handleOk={handleOkDelete}
            handleCancel={handleCancelDelete}
      />
        </div>
        
    </PageContainerFixed>
    );
}