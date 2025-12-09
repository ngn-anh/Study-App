// import { FlatList, ScrollView, Text, View } from "react-native";
// import { styles } from "./index.styles";
// import ExpandDesSubject from "../../components/ExpandDesSubject";
// import { RouteProp } from "@react-navigation/native";
// import { RootStackParamList } from "../../types/data";
// import Header from "../../components/Header";
// import SearchBar from "../../components/Search";
// import ItemExam from "../../components/ItemExam";
// import { verticalScale } from "../../utils/responsive";
// import { Exam } from "../../types/typeObj";
// import { useCallback, useState } from "react";
// import { LIMIT, TYPE_EXAM } from "../../constants";
// import { getExams } from "../../api/exam";

// type Props = {
//   route: RouteProp<RootStackParamList, 'PracticeExamScreen'>;
// };

// const PracticeExamScreen = (props: Props) => {
//   const { route } = props;
//   const { subjectId, subjectCode, classCode, classId } = route.params;
//   const [exams, setExams] = useState<Exam[]>([]);
//   const [totalExam, setTotalExam] = useState<number>(0);
//   const [page, setPage] = useState<number>(1);

//   // const listExam: Exam[] = [
//   //   {
//   //     id: "1",
//   //     image: "https://res.cloudinary.com/dr0ncakbs/image/upload/v1762674778/exam_w1rblh.png",
//   //     name: "Đề thi tốt nghiệp THPT môn Toán -  Đề số 1",
//   //     number: 50,
//   //     duration: 120,
//   //     createdAt: "2023-11-05T10:00:00Z",
//   //     difficulty: 3
//   //   },
//   //   {
//   //     id: "2",
//   //     image: "https://res.cloudinary.com/dr0ncakbs/image/upload/v1762674778/exam_w1rblh.png",
//   //     name: "Đề thi tốt nghiệp THPT môn Toán -  Đề số 2",
//   //     number: 40,
//   //     duration: 90,
//   //     createdAt: "2023-11-06T14:30:00Z",
//   //     difficulty: 2
//   //   },
//   //   {
//   //     id: "3",
//   //     image: "https://res.cloudinary.com/dr0ncakbs/image/upload/v1762674778/exam_w1rblh.png",
//   //     name: "Đề thi tốt nghiệp THPT môn Toán -  Đề số 3",
//   //     number: 30,
//   //     duration: 60,
//   //     createdAt: "2023-11-05T09:15:00Z",
//   //     difficulty: 4
//   //   },
//   //   {
//   //     id: "4",
//   //     image: "https://res.cloudinary.com/dr0ncakbs/image/upload/v1762674778/exam_w1rblh.png",
//   //     name: "Đề thi tốt nghiệp THPT môn Toán -  Đề số 4",
//   //     number: 50,
//   //     duration: 120,
//   //     createdAt: "2023-11-03T11:45:00Z",
//   //     difficulty: 3
//   //   },
//   //   {
//   //     id: "5",
//   //     image: "https://res.cloudinary.com/dr0ncakbs/image/upload/v1762674778/exam_w1rblh.png",
//   //     name: "Đề thi tốt nghiệp THPT môn Toán -  Đề số 5",
//   //     number: 45,
//   //     duration: 100,
//   //     createdAt: "2023-11-02T08:00:00Z",
//   //     difficulty: 5
//   //   }
//   // ]

//   const fetchExams = useCallback(async () => {
//     // if (!user?.id || !classInfo?.code) return;
//     if (!subjectId && !classId) return;

//     try {
//       // setLoading(true);
//       const params = {
//         // currentClassCode: classCode,
//         class_id: classId,
//         type: TYPE_EXAM.DE_LUYEN,
//         subjectCode: subjectCode,
//         // user_id: user.id,
//         page: page,
//         limit: LIMIT,
//       };
//       console.log("home exam params", params);

//       const res = await getExams(params);

//       setExams(res.data || []);
//       setTotalExam(res.total || 0);
//     } catch (err) {
//       console.error("Lỗi khi tải danh sách bài thi:", err);
//     } finally {
//       // setLoading(false);
//     }
//   }, [classCode, page]);

//   const renderItemExam = ({ item }: any) => {
//     const isSingleItem = exams.length === 1;
//     return (
//       <View style={{ flex: isSingleItem ? 1 : 0.5 }}>
//         <ItemExam exam={item} />
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Header data={exams?.[0]?.subject} />
//       <ScrollView>
//         {/* <View> */}
//         <View style={styles.content}>
//           <Text style={styles.title}>Làm chủ môn {exams?.[0]?.subject?.name}</Text>
//           <ExpandDesSubject text={exams?.[0]?.subject?.description.trim() || ''} numberOfLines={5} />
//         </View>
//         <SearchBar />
//         <FlatList
//           data={exams}
//           renderItem={renderItemExam}
//           keyExtractor={(item) => item._id}
//           numColumns={2} // Hiển thị 2 item trên mỗi hàng
//           columnWrapperStyle={{ justifyContent: 'space-between' }} // Căn giữa các item
//           contentContainerStyle={{ paddingHorizontal: 10, paddingTop: verticalScale(20) }} // Thêm khoảng cách cho các item
//         />
//       </ScrollView >
//       {/* </View> */}
//     </View>

//   );
// }

// export default PracticeExamScreen;

import { FlatList, ScrollView, Text, View, ActivityIndicator } from "react-native";
import { styles } from "./index.styles";
import ExpandDesSubject from "../../components/ExpandDesSubject";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types/data";
import Header from "../../components/Header";
import SearchBar from "../../components/Search";
import ItemExam from "../../components/ItemExam";
import { verticalScale } from "../../utils/responsive";
import { Exam } from "../../types/typeObj";
import { useCallback, useEffect, useState, useRef } from "react";
import { LIMIT, TYPE_EXAM } from "../../constants";
import { getExams } from "../../api/exam";


type Props = {
  route: RouteProp<RootStackParamList, 'PracticeExamScreen'>;
};

const PracticeExamScreen = (props: Props) => {
  const { route } = props;
  const { subjectId, subjectCode, classCode, classId } = route.params;
  const [exams, setExams] = useState<Exam[]>([]);
  const [totalExam, setTotalExam] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const scrollViewRef = useRef<ScrollView>(null);
  const isFetchingRef = useRef<boolean>(false);
  const [liking, setLiking] = useState(false);

  // Fetch exams khi page thay đổi
  const fetchExams = useCallback(async (isLoadMore: boolean = false) => {
    if (!subjectId && !classId) return;
    if (isFetchingRef.current) return;

    const targetPage = isLoadMore ? page + 1 : 1;

    try {
      isFetchingRef.current = true;

      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const params = {
        class_id: classId,
        type: TYPE_EXAM.DE_LUYEN,
        subjectCode: subjectCode,
        page: targetPage,
        limit: LIMIT,
      };

      const res = await getExams(params);

      if (isLoadMore) {
        // Load more: append data
        setExams(prev => [...prev, ...(res.data || [])]);
        setPage(targetPage);
      } else {
        // Load mới: replace data
        setExams(res.data || []);
        setPage(1);
      }

      setTotalExam(res.total || 0);
      setHasMore((res.data?.length || 0) === LIMIT);
    } catch (err) {
      console.error("Lỗi khi tải danh sách bài thi:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [classId, subjectCode, page]);

  // Fetch exams khi component mount
  useEffect(() => {
    fetchExams();
  }, []);

  // Reset page và fetch lại khi params thay đổi
  useEffect(() => {
    setPage(1);
    setExams([]);
    fetchExams();
  }, [subjectId, classId]);

  // Xử lý load more khi scroll đến cuối
  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    // Kiểm tra nếu đã scroll đến gần cuối
    const paddingToBottom = 50; // Khoảng cách từ cuối để trigger load more
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;

    // Nếu scroll đến gần cuối và không đang loading, còn data để load
    if (isCloseToBottom && !loading && !loadingMore && hasMore) {
      handleLoadMore();
    }
  };

  // Xử lý load more
  const handleLoadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      fetchExams(true);
    }
  };

  /** --------------------------------------------------------------
   *  Toggle like / unlike cho exam hiện tại
   * -------------------------------------------------------------- */
  const handleToggleLike = async () => {
    if (!user?.id || !examInfo) {
      console.warn("User hoặc examInfo chưa sẵn sàng");
      return;
    }

    const currentlyLiked = examInfo.is_like ?? 0;          // 0 or 1
    const newLikeState = currentlyLiked === 1 ? 0 : 1;    // flip

    try {
      setLiking(true);

      // ---- 1️⃣ optimistic UI -------------------------------------------------
      setExamInfo(prev => ({
        ...prev!,
        is_like: newLikeState,
        total_like: (prev?.total_like ?? 0) + (newLikeState === 1 ? 1 : -1),
      }));

      // ---- 2️⃣ gọi API --------------------------------------------------------
      const resp = await toggleExamLike(user.id, examInfo._id, newLikeState);

      if (resp.errorCode !== 0) {
        // API báo lỗi → rollback
        setExamInfo(prev => ({
          ...prev!,
          is_like: currentlyLiked,
          total_like:
            (prev?.total_like ?? 0) + (currentlyLiked === 1 ? 1 : -1),
        }));
        console.warn("Like API error:", resp.message);
      }
      // nếu muốn luôn reload lại dữ liệu mới nhất từ server:
      // await fetchGetExamInfo();
    } catch (err) {
      // network error → rollback
      setExamInfo(prev => ({
        ...prev!,
        is_like: currentlyLiked,
        total_like:
          (prev?.total_like ?? 0) + (currentlyLiked === 1 ? 1 : -1),
      }));
      console.error("❌ toggleLike failed:", err);
    } finally {
      setLiking(false);
    }
  };

  const renderItemExam = ({ item, index }: { item: Exam; index: number }) => {
    const isSingleItem = exams.length === 1;
    const isLastInRow = index % 2 === 1 || index === exams.length - 1;

    return (
      <View
        style={[
          { flex: 1, marginHorizontal: 5 },
          !isLastInRow && { marginRight: 10 }
        ]}
      >
        <ItemExam exam={item} />
      </View>
    );
  };

  // Hiển thị loading indicator khi load more
  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoading}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={{ marginLeft: 10 }}>Đang tải thêm...</Text>
      </View>
    );
  };

  // Hiển thị empty state
  const renderEmpty = () => {
    if (loading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText} >Không có đề thi nào.</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        data={exams?.[0]?.subject}
        title={exams?.[0]?.subject?.name || "Luyện thi"}
      />

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Làm chủ môn {exams?.[0]?.subject?.name}</Text>
          <ExpandDesSubject text={exams?.[0]?.subject?.description.trim() || ''} numberOfLines={5} />
        </View>
        <SearchBar />

        {/* <View style={styles.examListContainer}>
          <Text style={styles.sectionTitle}>
            Danh sách đề thi ({totalExam})
          </Text> */}

        <FlatList
          data={exams}
          renderItem={renderItemExam}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          scrollEnabled={false} // Vẫn giữ false vì có ScrollView bên ngoài
          showsVerticalScrollIndicator={false}
        />
        {/* </View> */}
      </ScrollView>

      {/* Hiển thị loading khi fetch lần đầu */}
      {loading && exams.length === 0 && (
        <View style={styles.fullScreenLoading}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 10 }}>Đang tải đề thi...</Text>
        </View>
      )}
    </View>
  );
};

export default PracticeExamScreen;
