import "./index.less";
import { Button, Image, Tag, Tooltip, Typography, Upload, message, notification } from "antd";
import PageContainerFixed from "../../component/PageContainerFixed";
import ProTableFixed from "../../component/ProTableFixed";
import { Plus, NotePencil, Trash, Question, FileArrowUp, MagnifyingGlass } from "phosphor-react";
import { useRef, useState } from "react";
import {
    getExams,
    deleteExam
} from "../../api/exam";
import CustomModal from "../../component/CustomModal";
import { PermissionGuard } from "../../components/PermissionGuard";
import CreateUpdateExam from "./components/createUpdateExamDrawer";
import type { Exam, ImportQuestion } from "../../types/typeObj";
import dayjs from "dayjs";
// import { useNavigate } from "react-router-dom";
import QuestionModal from "../Question";
import * as XLSX from "xlsx";
import { ProForm, ProFormSelect, ProFormText } from "@ant-design/pro-components";

const { Paragraph } = Typography;

const ExamPage = () => {
    const actionRef = useRef<any>();
    // const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();

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

    const [importQuestions, setImportQuestions] = useState<ImportQuestion[]>([]);

    const fetchExams = async (param: any) => {
        const res = await getExams({
            page: param.current,
            limit: param.pageSize,
            name: filterParams.name,
            type: filterParams.type,
            sort: filterParams.sort,
        });

        return {
            data: res.data.map((e: Exam) => ({
                id: e._id,
                name: e?.name ?? "",
                description: e?.description ?? "",
                type: e?.type,
                image: e?.image ?? '',
                difficulty: e?.difficulty,
                duration: e?.duration ?? 0,
                startDate: e?.start_date ?? null,
                endDate: e?.end_date ?? null,
                participants: e?.participants ?? 0,
                numberQuestion: e?.numberQuestion ?? 0,
                totalDownload: e?.total_download ?? 0,
                totalLike: e?.total_like ?? 0,
                createdAt: e?.created_at ?? null,
                updatedAt: e?.updated_at ?? null,
            })),
            total: res?.total || 0,
        };
    };

    const onOpenDelete = async (id: string, exam: Exam) => {
        // const res = await getExamDetail(id);
        setExamDetail(exam);
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
        if (!examId) return;
        try {
            await deleteExam(examId);
            setOpenDelete(false);
            message.success("Xóa đề thi thành công!");
            // notification.success({
            //     message: `Xóa đề thi thành công!`,
            //     placement: "topRight",
            // });

            actionRef.current?.reload();
        } catch (err) {
            console.error(err);
            message.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
            // notification.error({
            //     message: `Có lỗi xảy ra. Vui lòng thử lại sau.`,
            //     placement: "topRight",
            // });
        }
    };

    const handleOpenQuestion = (examId: string) => {
        setExamId(examId);
        setOpenQuestion(true);
        // setIsOpenDrawer(true);
        // navigate(`/exam/${examId}/question`);
    };

    const parseQuestionExcel = async (file: File): Promise<ImportQuestion[]> => {
        const buffer = await file.arrayBuffer();
        const wb = XLSX.read(buffer);
        const ws = wb.Sheets[wb.SheetNames[0]];

        const rows: any[] = XLSX.utils.sheet_to_json(ws, { defval: "" });

        return rows.map((row, idx) => {
            const correctIndexes = String(row["Đáp án đúng"])
                .split(",")
                .map((i: string) => Number(i.trim()));

            const answers = [1, 2, 3, 4].map(i => ({
                description: row[`Đáp án ${i}`],
                explanation: row[`Giải thích đáp án ${i}`],
                is_correct: correctIndexes.includes(i),
            })).filter(a => a.description);

            return {
                description: row["Câu hỏi"],
                difficulty: Number(row["Độ khó"]),
                section: Number(row["Phần"]),
                answers,
            };
        });
    };

    const optimizeCloudinary = (
        url?: string,
        w = 120,
        h = 80
    ) =>
        url
            ? url.replace(
                "/upload/",
                `/upload/w_${w},h_${h},c_fill/`
            )
            : "";

    const columns = [
        {
            title: "STT",
            dataIndex: "index",
            width: 50,
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
            title: "Ảnh",
            dataIndex: "image",
            width: 90,
            fixed: "left",
            align: "center",
            render: (src: string) =>
                src ? (
                    <Image
                        src={optimizeCloudinary(src)}
                        width={60}
                        height={40}
                        style={{
                            objectFit: "cover",
                            borderRadius: 6,
                            cursor: "pointer",
                        }}
                        preview={{ mask: "Xem" }}
                        fallback="/images/no-image.png"
                    />
                ) : (
                    <div
                        style={{
                            width: 60,
                            height: 40,
                            background: "#f0f0f0",
                            borderRadius: 6,
                            fontSize: 12,
                            color: "#999",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        No image
                    </div>
                ),
        },
        {
            title: "Tên đề thi",
            dataIndex: "name",
            width: 200,
            fixed: "left",
            render: (text: string) => {
                return (
                    <Paragraph
                        style={{ marginBottom: 0 }}
                        ellipsis={{
                            rows: 2,
                            expandable: true,
                            symbol: 'Xem thêm',
                        }}
                    >
                        <div className="name-exam">{text}</div>
                    </Paragraph>
                );
            },
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            width: 200,
            render: (text: string) => {
                return (
                    // <div className="desc-exam">{text}</div>
                    <Paragraph
                        style={{ marginBottom: 0 }}
                        ellipsis={{
                            rows: 2,
                            expandable: true,
                            symbol: 'Xem thêm',
                        }}
                    >
                        {text}
                    </Paragraph>
                );
            },
        },
        {
            title: "Loại đề thi",
            dataIndex: "type",
            width: 75,
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
            width: 130,
            align: "center",
            render: (text: string) => {
                return (
                    <div className="duration-exam">{text}</div>
                );
            },
        },
        {
            title: "Độ khó",
            dataIndex: "difficulty",
            width: 90,
            align: "center",
            render: (v: number) => {
                if (v === 1) return <Tag color="green">Dễ</Tag>;
                if (v === 2)
                    return <Tag color="orange">Trung bình</Tag>;
                if (v === 3) return <Tag color="red">Khó</Tag>;
                return "--";
            },
        },
        {
            title: "Ngày bắt đầu",
            dataIndex: "startDate",
            width: 140,
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
            title: "Ngày kết thúc",
            dataIndex: "endDate",
            width: 140,
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
            title: "Số câu hỏi",
            dataIndex: "numberQuestion",
            width: 80,
            align: "center",
            render: (v: number) => v || 0,
        },
        {
            title: "Lượt tham gia",
            dataIndex: "participants",
            width: 95,
            align: "center",
            render: (v: number) => v || 0,
        },
        {
            title: "Lượt tải",
            dataIndex: "totalDownload",
            width: 70,
            align: "center",
            render: (v: number) => v || 0,
        },
        {
            title: "Lượt thích",
            dataIndex: "totalLike",
            width: 75,
            align: "center",
            render: (v: number) => v || 0,
        },
        {
            title: "Tác vụ",
            width: 120,
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
                                beforeUpload={async (file) => {
                                    const data = await parseQuestionExcel(file);
                                    setImportQuestions(data);

                                    notification.success({
                                        message: `Đã đọc ${data.length} câu hỏi từ file Excel`,
                                        placement: "topRight",
                                    });

                                    handleOpenQuestion(row.id)
                                    return false;
                                }}
                            >
                                <FileArrowUp
                                    className="cursor-pointer"
                                    size={16}
                                    color="#1890ff"
                                />
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
                                onClick={() => onOpenDelete(row.id, row)}
                            />
                        </Tooltip>
                    </PermissionGuard>
                </div>
            ),
        },
    ];

    return (
        <>
            {contextHolder}
            <PageContainerFixed
                header={{
                    title: "Quản lý đề thi",
                    extra: (
                        <PermissionGuard requiredPermissions="exam.create">
                            <Button
                                type="primary"
                                onClick={handleAddExam}
                            >
                                <Plus /> Thêm đề thi
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
                            headerFixedHeight={380}
                            // params={filterParams}
                            actionRef={actionRef}
                            request={fetchExams}
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
                            actionRef.current?.reload();
                        }}
                        importQuestions={importQuestions}
                        setImportQuestions={setImportQuestions}
                    />

                    {isOpenDrawer && (
                        <CreateUpdateExam
                            isOpenDrawer={isOpenDrawer}
                            setIsOpenDrawer={setIsOpenDrawer}
                            examId={examId}
                            setExamId={setExamId}
                            actionRef={actionRef}
                            notify={api}
                        />
                    )}

                    <CustomModal
                        open={openDelete}
                        title="Xóa đề thi"
                        type="warning"
                        content={
                            <>
                                Bạn có chắc muốn xóa <b>{examDetail?.name}</b> không?
                            </>
                        }
                        handleOk={handleDelete}
                        handleCancel={() => setOpenDelete(false)}
                    />
                </div>
            </PageContainerFixed>
        </>
    );
}

export default ExamPage;