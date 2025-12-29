import { Button, message, Tooltip, Row, Col } from "antd";
import PageContainerFixed from "../../component/PageContainerFixed";
import { MagnifyingGlass, NotePencil, Plus, Trash } from "phosphor-react";
import './index.less'
import { ProForm, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { useForm } from "antd/es/form/Form";
import ProTableFixed from "../../component/ProTableFixed";
import { filterOptions } from "../../utils/helper";
import { useRef, useState } from "react";
import { STATUS_SUBJECT } from "../../utils/enum";
import { deleteSubject, getSubjectDetail, getSubjects } from "../../api/subject";
import CreateUpdateSubject from "./component/createUpdateSubjectDrawer";
import CustomModal from "../../component/CustomModal";
import { PermissionGuard } from "../../components/PermissionGuard";


export default function SubjectPage() {
  const [form] = useForm();
  const filter = useRef({});
  const [filterParams, setFilterParams] = useState<any>({});
  const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);
  const [isOpenModal, setOpenModal] = useState(false);
  const [idSubject, setIdSubject] = useState<any>();
  const [subjectDetail, setSubjectDetail] = useState<any>();
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

    const res = await getSubjects(params);

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

  const getStatus = (status: number) => {
    if (status == STATUS_SUBJECT.ACTIVE) return <div className="lbl-active">Đang hoạt động</div>
    return <div className="lbl-inactive">Không hoạt động</div>
  }

  const handleOkDelete = async () => {
    try {
      await deleteSubject(idSubject);

      setOpenModal(false);
      message.success("Xóa môn học thành công!");

      // Reload bảng
      actionRef.current?.reload();

    } catch (error) {
      console.error(error);
    }
  }

  const handleCancelDelete = () => {
    setOpenModal(false)
  }

  const onOpenDelete = async (id: string) => {
    setIdSubject(id);

    const res = await getSubjectDetail(id);
    setSubjectDetail(res.data.data);

    setOpenModal(true);
  };

  const getContentDelete = () => {
    if (!subjectDetail) return "";

    if (subjectDetail.total_class > 0) {
      return (
        <>
          <b>{subjectDetail.name}</b> đã được áp dụng ở{" "}
          <b>{subjectDetail.total_class}</b> lớp.
          Bạn có chắc muốn xóa môn này không?
        </>
      );
    }

    return (
      <>
        Bạn có chắc muốn xóa môn <b>{subjectDetail.name}</b> không?
      </>
    );
  };

  const columns = [
    {
      title: "Tên môn học",
      dataIndex: 'name',
      key: 'student',
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
      title: "Mã môn học",
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
                : (
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
            <PermissionGuard requiredPermissions="subject.update">
              <Tooltip title={"Sửa"} onClick={
                () => {
                  console.log('row', row)
                  setIdSubject(row.id)
                  setIsOpenDrawer(true)
                }
              }>
                <NotePencil color="#0c4299" className="cpn-action-edit cursor-pointer" />
              </Tooltip>
            </PermissionGuard>
            <PermissionGuard requiredPermissions="subject.delete">
              <Tooltip title="Xóa" >
                <Trash color="#d63b3bff" className="cursor-pointer" onClick={() => onOpenDelete(row.id)} />
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
        title: "Quản Lý Môn Học",
        extra: (
          <PermissionGuard requiredPermissions="subject.create">
            <Button
              size={'large'}
              type="primary"
              className="ant-btn-primary"
              onClick={() => {
                setIsOpenDrawer(true)
                setIdSubject(undefined)
              }}
            >
              <Plus weight="bold" /> <span>Môn Học Mới</span>
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
                placeholder={"Nhập tên môn học để tìm kiếm"}
                fieldProps={{
                  prefix: <MagnifyingGlass color="#083070" weight="bold" />,
                }}
                name="name"
              />
            </Col>
            <Col span={6}>
              <ProFormSelect
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
            headerFixedHeight={350}
            params={filterParams}
            actionRef={actionRef}
            request={requestGetDataSource}
            rowKey="id"
            columns={columns}
            tableAlertRender={false}
          />
        </div>
        <CreateUpdateSubject
          isOpenDrawer={isOpenDrawer}
          setIsOpenDrawer={setIsOpenDrawer}
          idSubject={idSubject}
          setIdSubject={setIdSubject}
          actionRef={actionRef}
        />

        <CustomModal
          open={isOpenModal}
          type="warning"
          title="Xoá Môn Học"
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