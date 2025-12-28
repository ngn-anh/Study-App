import "./index.less";
import { Button, Col, Row, Tag, Tooltip, Upload, message } from "antd";
import PageContainerFixed from "../../component/PageContainerFixed";
import ProTableFixed from "../../component/ProTableFixed";
import { Plus, NotePencil, Trash, Question, FileArrowUp, MagnifyingGlass } from "phosphor-react";
import { useRef, useState } from "react";
import {
    getExams,
    // deleteExam, 
    getExamDetail
} from "../../api/exam";
import CustomModal from "../../component/CustomModal";
import { PermissionGuard } from "../../components/PermissionGuard";
import CreateUpdateExam from "./components/createUpdateExamDrawer";
import type { Exam } from "../../types/typeObj";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import QuestionModal from "../Question";
import * as XLSX from "xlsx";
import { ProForm, ProFormSelect, ProFormText } from "@ant-design/pro-components";

const ExamPage = () => {
    const actionRef = useRef<any>();
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [examId, setExamId] = useState<string | undefined>();
    const [examDetail, setExamDetail] = useState<Exam>();
    const [openDelete, setOpenDelete] = useState(false);
    const [openQuestion, setOpenQuestion] = useState(false);
    const [filterParams, setFilterParams] = useState<{
        name?: string;
        type?: number;
        sort?: "newest" | "oldest";
    }>({});


    const navigate = useNavigate();

    const requestGetDataSource = async (param: any) => {
        const res = await getExams({
            page: param.current,
            limit: param.pageSize,
            name: filterParams.name,
            type: filterParams.type,
            sort: filterParams.sort, // backend cần nhận param này để sort
        });

        return {
            data: res.data.map((e: Exam) => ({
                id: e._id,
                name: e.name ?? "",
                type: e.type ?? 0,
                duration: e.duration ?? 0,
                startDate: e.start_date ?? null,
                endDate: e.end_date ?? null,
                createdAt: e.created_at ?? null,
                updatedAt: e.updated_at ?? null,
            })),
            total: res.total || 0,
        };
    };


    const onOpenDelete = async (id: string) => {
        const res = await getExamDetail(id);
        setExamDetail(res);
        setExamId(id);
        setOpenDelete(true);
    };

    const handleAddExam = () => {
        setExamId(undefined);
        setIsOpenDrawer(true);
    }

    const handleEditExam = (examId: string) => {
        setExamId(examId);
        setIsOpenDrawer(true);
    }

    const handleDelete = async () => {
        // await deleteExam(examId);
        message.success("Xóa đề thi thành công");
        setOpenDelete(false);
        actionRef.current?.reload();
    };

    const handleOpenQuestion = (examId: string) => {
        setExamId(examId);
        setOpenQuestion(true);
        // setIsOpenDrawer(true);
        // navigate(`/exam/${examId}/question`);
    };

    const handleImportExcel = async (examId: string, file: File) => {
        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

            console.log("Excel data for examId:", examId, jsonData);

            // TODO: map jsonData thành định dạng câu hỏi & gọi API tạo câu hỏi cho examId
            // await createQuestionsBulk(examId, jsonData);

            message.success(`Import ${jsonData.length} câu hỏi cho đề thi thành công!`);
            actionRef.current?.reload();
        } catch (err) {
            console.error(err);
            message.error("Import Excel thất bại");
        }
    };

    const columns = [
        {
            title: "STT",
            dataIndex: "index",
            width: 60,
            fixed: "left",
            align: "center",
            render: (_text: string, _row: any, index: number) => {
                // Lấy current page và pageSize từ actionRef
                // Nếu chưa có thì dùng mặc định từ pagination của table
                const defaultPageSize = actionRef.current?.paginationProps?.pageSize || 10;
                const currentPage = actionRef.current?.paginationProps?.current || 1;
                const pageSize = actionRef.current?.paginationProps?.pageSize || defaultPageSize;

                return (currentPage - 1) * pageSize + index + 1;
            },
        },
        {
            title: "Tên đề thi",
            dataIndex: "name",
            width: 230,
            fixed: "left",
            render: (text: string) => {
                return (
                    <div className="name-exam">{text}</div>
                );
            },
        },
        {
            title: "Loại đề thi",
            dataIndex: "type",
            width: 70,
            render: (v: number) =>
                v === 1 ? (
                    <Tag color="blue">Thi thử</Tag>
                ) : (
                    <Tag color="green">Đề luyện</Tag>
                ),
        },
        {
            title: "Thời gian thi (phút)",
            dataIndex: "duration",
            width: 100,
            align: "center",
            render: (text: string) => {
                return (
                    <div className="duration-exam">{text}</div>
                );
            },
        },
        {
            title: "Bắt đầu",
            dataIndex: "startDate",
            width: 100,
            render: (text: Date) => {
                return (
                    <div className="startDate-exam">
                        {text
                            ? dayjs(text).format("DD/MM/YYYY HH:mm")
                            : "--"}
                    </div>
                );
            },
        },
        {
            title: "Kết thúc",
            dataIndex: "endDate",
            width: 100,
            render: (text: Date) => {
                return (
                    <div className="endDate-exam">
                        {text
                            ? dayjs(text).format("DD/MM/YYYY HH:mm")
                            : "--"}
                    </div>
                );
            },
        },
        {
            title: "Tác vụ",
            width: 80,
            fixed: "right",
            align: "center",
            render: (_text: string, row: any) => (
                <div className="cpn-action">
                    {/* Import Excel */}
                    <PermissionGuard requiredPermissions="question.create">
                        <Tooltip title="Import Excel">
                            <Upload
                                accept=".xlsx,.xls"
                                showUploadList={false}
                                beforeUpload={(file) => {
                                    handleImportExcel(row.id, file);
                                    return false; // ngăn upload tự submit
                                }}
                            >
                                <FileArrowUp className="cursor-pointer" size={16} color="#1890ff" />
                            </Upload>
                        </Tooltip>
                    </PermissionGuard>

                    <PermissionGuard requiredPermissions="exam.update">
                        {/* <PermissionGuard requiredPermissions="question.read"> */}
                        <Tooltip title="Danh sách câu hỏi">
                            <Question
                                className="cursor-pointer"
                                color="#22A112"
                                size={15}
                                onClick={() => handleOpenQuestion(row.id)}
                            />
                        </Tooltip>
                    </PermissionGuard>
                    <PermissionGuard requiredPermissions="exam.update">
                        <Tooltip title="Sửa">
                            <NotePencil
                                className="cursor-pointer"
                                color="#0c4299"
                                onClick={() => handleEditExam(row.id)}
                            />
                        </Tooltip>
                    </PermissionGuard>
                    <PermissionGuard requiredPermissions="exam.delete">
                        <Tooltip title="Xóa">
                            <Trash
                                className="cursor-pointer"
                                color="#d63b3bff"
                                onClick={() => onOpenDelete(row.id)}
                            />
                        </Tooltip>
                    </PermissionGuard>
                </div>
            ),
        },
    ];

    return (
        <PageContainerFixed
            header={{
                title: "Quản lý đề thi",
                extra: (
                    <PermissionGuard requiredPermissions="exam.create">
                        <Button
                            type="primary"
                            onClick={handleAddExam}
                        >
                            <Plus /> Tạo đề thi
                        </Button>
                    </PermissionGuard>
                ),
            }}
        >
            <div className="subject-list-page">
                {/* Search */}
                <ProForm
                    submitter={false}
                    layout="inline"
                    style={{ marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}
                    onFinish={(values) => {
                        setFilterParams(values);
                        actionRef.current?.reload();
                    }}
                >
                    {/* Tìm theo tên */}
                    <ProFormText
                        name="name"
                        placeholder="Tìm theo tên đề thi"
                        fieldProps={{
                            prefix: <MagnifyingGlass color="#083070" weight="bold" />,
                            allowClear: true,
                        }}
                        style={{ minWidth: 200 }}
                    />

                    {/* Gộp Loại đề + Thời gian */}
                    <ProForm.Group>
                        <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                            <ProFormSelect
                                name="type"
                                placeholder="Loại đề thi"
                                options={[
                                    { label: "Thi thử", value: 1 },
                                    { label: "Đề luyện", value: 2 },
                                ]}
                                allowClear
                                style={{ minWidth: 150 }}
                            />
                            <ProFormSelect
                                name="sort"
                                placeholder="Thời gian"
                                options={[
                                    { label: "Mới nhất", value: "newest" },
                                    { label: "Cũ nhất", value: "oldest" },
                                ]}
                                allowClear
                                style={{ minWidth: 150 }}
                            />
                        </div>
                    </ProForm.Group>

                    {/* Buttons căn phải */}
                    <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                        <Button
                            onClick={() => {
                                setFilterParams({});
                                actionRef.current?.reload();
                            }}
                        >
                            Xóa bộ lọc
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Tìm kiếm
                        </Button>
                    </div>
                </ProForm>

                <div>
                    <ProTableFixed
                        // headerFixedHeight={350}
                        // params={filterParams}
                        actionRef={actionRef}
                        request={requestGetDataSource}
                        columns={columns}
                        rowKey="id"
                        tableAlertRender={false}
                    />
                </div>

                {/* Modal Question */}
                <QuestionModal
                    open={openQuestion}
                    examId={examId}
                    onClose={() => {
                        setOpenQuestion(false);
                        setExamId(undefined);
                    }}
                />

                <CreateUpdateExam
                    isOpenDrawer={isOpenDrawer}
                    setIsOpenDrawer={setIsOpenDrawer}
                    examId={examId}
                    setExamId={setExamId}
                    actionRef={actionRef}
                />

                {/* <CreateUpdateSubject
                    isOpenDrawer={openForm}
                    setIsOpenDrawer={setOpenForm}
                    idSubject={idSubject}
                    setIdSubject={setIdSubject}
                    actionRef={actionRef}
                /> */}

                <CustomModal
                    open={openDelete}
                    title="Xóa đề thi"
                    type="warning"
                    content={
                        <>
                            Bạn có chắc muốn xóa đề <b>{examDetail?.name}</b> không?
                        </>
                    }
                    handleOk={handleDelete}
                    handleCancel={() => setOpenDelete(false)}
                />
            </div>
        </PageContainerFixed>
    );
}

export default ExamPage;