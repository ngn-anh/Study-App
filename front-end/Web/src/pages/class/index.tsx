import { Button, message, Tooltip, Row, Col } from "antd";
import PageContainerFixed from "../../component/PageContainerFixed";
import { MagnifyingGlass, NotePencil , Plus, Trash } from "phosphor-react";
import './index.less'
import { ProForm, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { useForm } from "antd/es/form/Form";
import ProTableFixed from "../../component/ProTableFixed";
import { filterOptions } from "../../utils/helper";
import { useRef, useState } from "react";
import CustomModal from "../../component/CustomModal";
import { deleteClass, getClassDetail, getClasses } from "../../api/class";
import CreateUpdateClass from "./component/createUpdateClassDrawer";
import { STATUS_CLASS } from "../../utils/enum";
import { PermissionGuard } from "../../components/PermissionGuard";


export default function ClassPage() {
    const [form] = useForm();
    const filter = useRef({});
    const [filterParams, setFilterParams] = useState<any>({});
    const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);
    const [isOpenModal, setOpenModal] = useState(false);
    const [idClass, setIdClass] = useState<any>();
    const [classDetail, setClassDetail] = useState<any>();
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

  const res = await getClasses(params);

  return {
    data: res.data.map((item: any) => ({
      id: item._id,
      name: item.name,
      code: item.code,
      status: item.status,
      description: item.description,
    })),
    total: res.meta.pagination.total,
    meta: res.meta,
  };
};


  const search = (param = {}) => {
    const filterParamsData = { ...form.getFieldsValue(), ...param };
    setFilterParams(filterParamsData);
  };

  const getStatus =(status: number)=>{
    if(status == STATUS_CLASS.ACTIVE) return <div className="lbl-active">Đang hoạt động</div>
    return <div className="lbl-inactive">Không hoạt động</div>
  }

  const handleOkDelete= async()=>{
    try {
      await deleteClass(idClass);

      setOpenModal(false);
      message.success("Xóa môn học thành công!");

      // Reload bảng
      actionRef.current?.reload();

    } catch (error) {
      console.error(error);
    }
  }

  const handleCancelDelete=()=>{
    setOpenModal(false)
  }

  const onOpenDelete = async (id: string) => {
    setIdClass(id);

    const res = await getClassDetail(id);    
    setClassDetail(res.data);            

    setOpenModal(true);
  };

  const getContentDelete = () => {
    if (!classDetail) return "";

    return (
      <>
        Bạn có chắc muốn xóa lớp <b>{classDetail.name}</b> không?
      </>
    );
  };

  const columns = [
    {
      title: "Tên lớp học",
      dataIndex: 'name',
      key: 'class',
      width: 200,
      fixed: 'left',
      align: 'left',
      render: (_?: any, row?: any) => {
        return (
          <div className="name-subject">{row.name}</div>
        );
      },
    },
    {
      title: "Mã lớp học",
      dataIndex: 'code',
      key: 'code',
      width: 150,
      align: 'left',
      render: (_?: any, row?: any) => {
        return (
          <div className="code-subject">{row.code}</div>
        );
      },
    },
    {
      title: "Mô tả",
      dataIndex: 'description',
      key: 'description',
      width: 350,
      align: 'left',
      render: (_?: any, row?: any) => {
        return (
          <>
          {
            row.description ? (
              <Tooltip title={row.description}>
            <div className="description-subject">{row.description}</div>
           </Tooltip>
            )
            :(
              <div className="text-no-description">Chưa có mô tả</div>
            )
          }
          </>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: 'status',
      key: 'status',
      width: 250,
      render: (_?: any, row?: any) => {
        return (
           <>{getStatus(row.status)}</>
        );
      },
    },
    {
      title: "Tác vụ",
      dataIndex: 'action',
      key: 'action',
      width: 70,
      fixed: 'right',
      align: 'center',
      render: (_?: any, row?: any) => {
        return (
          <div className="cpn-action">
            <PermissionGuard requiredPermissions="class.update">
              <Tooltip title={"Sửa"} onClick={
                ()=>{
                  console.log('row',row)
                  setIdClass(row.id)
                  setIsOpenDrawer(true)
                }
              }>
                <NotePencil color ="#0c4299" className="cpn-action-edit cursor-pointer" />
              </Tooltip>
            </PermissionGuard>
            <PermissionGuard requiredPermissions="class.delete">
              <Tooltip title="Xóa" >
                <Trash color ="#d63b3bff" className="cursor-pointer" onClick={() => onOpenDelete(row.id)}/>
              </Tooltip>
            </PermissionGuard>
          </div>
        );
      },
    }
    ]

    return (
        <PageContainerFixed
            header={{
                title: "Quản Lý Lớp Học",
                extra: (
                    <PermissionGuard requiredPermissions="class.create">
                      <Button
                        size={'large'}
                        type="primary"
                        className="ant-btn-primary"
                        onClick={() => {
                         setIsOpenDrawer(true)
                         setIdClass(undefined)
                        }}
                      >
                        <Plus weight="bold"/> <span>Lớp Học Mới</span>
                      </Button>
                    </PermissionGuard>
                )
            }}
    >
        <div className="subject-list-page">
            <ProForm submitter={false} form={form} className="form-search">
                <Row gutter={[16, 16]}>
                    <Col span={8}>
                        <ProFormText
                        width="100%"
                        placeholder={"Nhập tên lớp học để tìm kiếm"}
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

        <CreateUpdateClass
          isOpenDrawer={isOpenDrawer}
          setIsOpenDrawer={setIsOpenDrawer}
          idClass={idClass}
          setIdClass={setIdClass}
          actionRef={actionRef}
        />

         <CustomModal
            open={isOpenModal}
            type="warning"
            title="Xoá Lớp Học"
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