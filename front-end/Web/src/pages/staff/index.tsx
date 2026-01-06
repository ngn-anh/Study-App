import { Button, message, Tag, Tooltip, Row, Col } from "antd";
import PageContainerFixed from "../../component/PageContainerFixed";
import { Gear, MagnifyingGlass, Trash } from "phosphor-react";
import './index.less'
import { ProForm, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { useForm } from "antd/es/form/Form";
import ProTableFixed from "../../component/ProTableFixed";
import { filterOptions } from "../../utils/helper";
import {  useRef, useState } from "react";
import { STATUS_SUBJECT } from "../../utils/enum";
import CustomModal from "../../component/CustomModal";
import { deleteStaff, getStaff } from "../../api/staff";
import ConfigStaffRoleDrawer from "./component/ConfigStaffDrawer";
import { PermissionGuard } from "../../components/PermissionGuard";


export default function StaffPage() {
    const [form] = useForm();
    const filter = useRef({});
    const [filterParams, setFilterParams] = useState<any>({});
    const [isOpenModal, setOpenModal] = useState(false);
    const [staffDelete, setStaffDelete] = useState<any>();
    const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);
    const [idStaff, setIdStaff] = useState<any>();
    const actionRef = useRef<any>();
    
    const optionStatus = [
        {
            value: 1,
            label: "Đang hoạt động"
        },
         {
            value: 2,
            label: "Không hoạt động"
        }
    ]

const requestGetDataSource = async (param: any) => {
  const params = {
    ...filterParams,
    page: param.current,
    limit: param.pageSize,
  };

  const res = await getStaff(params);

  return {
    data: res.data.map((item: any) => ({
      id: item.id,
      full_name: item.full_name || item.username,
      user_name:  item.username,
      email: item.email,
      phone: item.phone,
      status: item.status ?? 1,
      role: item.role,
      role_name: item.role_name,
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

  const handleOkDelete= async()=>{
      try {
        await deleteStaff(staffDelete.id);

        setOpenModal(false);
        message.success("Xóa nhân viên thành công!");

        actionRef.current?.reload();
      } catch (error) {
        console.error(error);
        message.error("Xóa nhân viên thất bại!");
      }
  }

  const handleCancelDelete=()=>{
    setOpenModal(false)
  }

  const onOpenDelete = async (row: any) => {
    setStaffDelete(row);
    setOpenModal(true);
  };

  const getContentDelete = () => {
     if (!staffDelete) return "";

    return (
      <>
        Bạn có chắc muốn xóa nhân viên{" "}
        <b>{staffDelete.full_name ?? staffDelete.user_name}</b>?
      </>
    );
  };

  const columns = [
  {
    title: "Họ và tên",
    dataIndex: "full_name",
    key: "full_name",
    width: 200,
    fixed: "left",
  },
  {
    title: "Tên tài khoản",
    dataIndex: "user_name",
    key: "user_name",
    width: 150,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: 150,
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone",
    key: "phone",
    width: 150,
    render: (val: any) => val ?? "n/a",
  },
  {
    title: "Vai trò",
    dataIndex: "role_name",
    key: "role_name",
    width: 150,
    render: (role_name: string) =><Tag className="ant-tag-geekblue">{role_name}</Tag>,
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    width: 120,
    render: (status: number) => getStatus(status),
  },
  {
    title: "Tác vụ",
    key: "action",
    width: 80,
    fixed: "right",
    align: "center",
    render: (_: any, row: any) => {
      return (
        row?.status == STATUS_SUBJECT.ACTIVE && (
          <div className="cpn-action">
            <PermissionGuard requiredPermissions="user.update">
              <Tooltip title={"Cấu hình"} onClick={
                ()=>{
                  console.log('row',row)
                  setIsOpenDrawer(true)
                  setIdStaff(row.id)
                }
              }>
                <Gear color ="#0c4299" className="cpn-action-edit cursor-pointer" />
              </Tooltip>
            </PermissionGuard>
            <PermissionGuard requiredPermissions="user.delete">
              <Tooltip title="Xoá">
                <Trash
                  color="#d63b3b"
                  className="cursor-pointer"
                  onClick={() => onOpenDelete(row)}
                />
              </Tooltip>
            </PermissionGuard>
          </div>
        )
      )
    },
  },
];

    return (
        <PageContainerFixed
            header={{
                title: "Danh sách nhân viên",
            }}
    >
        <div className="staff-list-page">
            <ProForm submitter={false} form={form} className="form-search">
                <Row gutter={[16, 16]}>
                    <Col span={8}>
                        <ProFormText
                        width="100%"
                        placeholder={"Nhập tên nhân viên hoặc tên tài khoản để tìm kiếm"}
                        fieldProps={{
                        prefix: <MagnifyingGlass color="#083070" weight="bold" />,
                        }}
                        name="name"
                    />
                    </Col>
                    <Col span={6}>
                        <ProFormSelect
                            width="100%"
                            name="status"
                            placeholder={"Trạng thái"}
                            fieldProps={{
                            showSearch: true,
                            showArrow: true,
                            filterOption: filterOptions,
                            }}
                            options={optionStatus}
                        />
                    </Col>
                    <Col span={10}>
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

        <ConfigStaffRoleDrawer
          isOpenDrawer={isOpenDrawer}
          setIsOpenDrawer={setIsOpenDrawer}
          actionRef={actionRef}
          idStaff={idStaff}
          setIdStaff={setIdStaff}
        />

         <CustomModal
            open={isOpenModal}
            type="warning"
            title="Xoá Nhân Viên"
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