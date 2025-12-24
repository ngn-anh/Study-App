import { Button, Tooltip, Row, Col } from "antd";
import PageContainerFixed from "../../component/PageContainerFixed";
import { Gear, MagnifyingGlass } from "phosphor-react";
import './index.less'
import { ProForm, ProFormText } from "@ant-design/pro-components";
import { useForm } from "antd/es/form/Form";
import ProTableFixed from "../../component/ProTableFixed";
import { useRef, useState } from "react";
import { getPrograms } from "../../api/class";
import ConfigProgramDrawer from "./component/ConfigProgramDrawer";


export default function ProgramPage() {
    const [form] = useForm();
    const filter = useRef({});
    const [filterParams, setFilterParams] = useState<any>({});
    const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);
    const [idClass, setIdClass] = useState<any>();
    const actionRef = useRef<any>();
    

const requestGetDataSource = async (param: any) => {
  const params = {
    ...filterParams,
    page: param.current,
    limit: param.pageSize,
  };

  const res = await getPrograms(params);

  return {
    data: res.data.map((item: any) => ({
      id: item._id,
      name: item.name,
      code: item.code,
      subjects: item.subjects?.map((it: any)=>({...it,id:it._id}))
    })),
    total: res.total
  };
};


  const search = (param = {}) => {
    const filterParamsData = { ...form.getFieldsValue(), ...param };
    setFilterParams(filterParamsData);
  };

  const getTitleTooltip = (subjects: any[]) => {
    // Bỏ môn đầu tiên, render những môn còn lại
    const remaining = subjects.slice(1);

    return (
        <div>
        {remaining.map((item) => (
            <div key={item._id}>{item.name}</div>
        ))}
        </div>
    );
    };

    const getSubjectBadge = (subjects: any[]) => {
        if (subjects && subjects.length > 0) {
            return (
            <div className="subject-badge">
                <div>{subjects[0].name}</div>

                {subjects.length > 1 && (
                <Tooltip title={getTitleTooltip(subjects)}>
                    <div className="subject-badge-item">
                    +{subjects.length - 1}
                    </div>
                </Tooltip>
                )}
            </div>
            );
        }

    return <div className="text-no-description">Chưa có môn học</div>;
    };

  const columns = [
    {
      title: "Tên lớp học",
      dataIndex: 'name',
      key: 'class',
      width: 100,
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
      title: "Môn học",
      dataIndex: 'subject',
      key: 'subject',
      width: 250,
      render: (_?: any, row?: any) => {
        console.log(row)
        return (
           <>{getSubjectBadge(row.subjects)}</>
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
            <Tooltip title={"Cấu hình"} onClick={
              ()=>{
                console.log('row',row)
                setIdClass(row.id)
                setIsOpenDrawer(true)
              }
            }>
              <Gear color ="#0c4299" className="cpn-action-edit cursor-pointer" />
            </Tooltip>
          </div>
        );
      },
    }
    ]

    return (
        <PageContainerFixed
            header={{
                title: "Cấu hình chương trình học",
            }}
    >
        <div className="subject-list-page">
            <ProForm submitter={false} form={form} className="form-search">
              <Row gutter={24}>
                <Col span={10}>
                  <ProFormText
                    width="100%"
                    placeholder={"Nhập tên lớp học để tìm kiếm"}
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
            headerFixedHeight={350}
            params={filterParams}
            actionRef={actionRef}
            request={requestGetDataSource}
            rowKey="id"
            columns={columns}
            tableAlertRender={false}
          />
        </div>

        <ConfigProgramDrawer
          isOpenDrawer={isOpenDrawer}
          setIsOpenDrawer={setIsOpenDrawer}
          idClass={idClass}
          setIdClass={setIdClass}
          actionRef={actionRef}
        />
        </div>
        
    </PageContainerFixed>
    );
}