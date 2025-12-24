import { Button, message, Tooltip } from "antd";
import PageContainerFixed from "../../component/PageContainerFixed";
import { MagnifyingGlass, Trash } from "phosphor-react";
import './index.less'
import { ProForm, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { useForm } from "antd/es/form/Form";
import ProTableFixed from "../../component/ProTableFixed";
import { filterOptions } from "../../utils/helper";
import { useEffect, useRef, useState } from "react";
import { STATUS_SUBJECT } from "../../utils/enum";
import CustomModal from "../../component/CustomModal";
import { deleteStudent, getStudents } from "../../api/student";
import { getClasses } from "../../api/class";
import { PermissionGuard } from "../../components/PermissionGuard";


export default function StudentPage() {
    const [form] = useForm();
    const filter = useRef({});
    const [filterParams, setFilterParams] = useState<any>({});
    const [isOpenModal, setOpenModal] = useState(false);
    const [classOptions, setClassOptions] = useState<any[]>([]);
    const [studentDelete, setStudentDelete] = useState<any>();
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

useEffect(() => {
  const fetchClasses = async () => {
    try {
      const res = await getClasses({
        page: 1,
        limit: 1000,
        status: 1, // chỉ lớp đang hoạt động
      });

      const options = res.data.map((item: any) => ({
        value: item.id || item._id,
        label: item.name,
      }));

      setClassOptions(options);
    } catch (error) {
      console.error("Fetch class error", error);
    }
  };

  fetchClasses();
}, []);

const requestGetDataSource = async (param: any) => {
  const params = {
    ...filterParams,
    page: param.current,
    limit: param.pageSize,
  };

  const res = await getStudents(params);

  return {
    data: res.data.map((item: any) => ({
      id: item.id,
      full_name: item.full_name || item.username,
      user_name:  item.username,
      email: item.email,
      phone: item.phone,
      class: item.class_name,
      status: item.status ?? 1, // tuỳ backend map
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
        await deleteStudent(studentDelete.id);

        setOpenModal(false);
        message.success("Xóa học sinh thành công!");

        actionRef.current?.reload();
      } catch (error) {
        console.error(error);
        message.error("Xóa học sinh thất bại!");
      }
  }

  const handleCancelDelete=()=>{
    setOpenModal(false)
  }

  const onOpenDelete = async (row: any) => {
    setStudentDelete(row);
    setOpenModal(true);
  };

  const getContentDelete = () => {
     if (!studentDelete) return "";

    return (
      <>
        Bạn có chắc muốn xóa học sinh{" "}
        <b>{studentDelete.full_name ?? studentDelete.user_name}</b>?
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
    width: 200,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: 200,
  },
  {
    title: "Lớp",
    dataIndex: "class",
    key: "class",
    width: 150,
    render: (val: any) => val ?? "n/a",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone",
    key: "phone",
    width: 150,
    render: (val: any) => val ?? "n/a",
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
                title: "Danh sách học sinh",
            }}
    >
        <div className="student-list-page">
            <ProForm submitter={false} form={form} className="form-search">
                <div>
                    <ProFormText
                    width={400}
                    placeholder={"Nhập tên học sinh hoặc tên tài khoản để tìm kiếm"}
                    fieldProps={{
                    prefix: <MagnifyingGlass color="#083070" weight="bold" />,
                    //   onPressEnter: handleEnterSearch,
                    }}
                    name="name"
                />
                <ProFormSelect
                    width={240}
                    name="class"
                    placeholder={"Lớp học"}
                    fieldProps={{
                    showSearch: true,
                    showArrow: true,
                    filterOption: filterOptions,
                    }}
                    options={classOptions}
                />
                <ProFormSelect
                    width={240}
                    name="status"
                    placeholder={"Trạng thái"}
                    fieldProps={{
                    showSearch: true,
                    showArrow: true,
                    filterOption: filterOptions,
                    }}
                    options={optionStatus}
                />
                </div>
                
                <div className="ant-form-item">
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
            </div>
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

         <CustomModal
            open={isOpenModal}
            type="warning"
            title="Xoá Học Sinh"
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