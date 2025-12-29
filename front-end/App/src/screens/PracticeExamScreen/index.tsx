import { FlatList, ScrollView, Text, View, ActivityIndicator, Image } from "react-native";
import { styles } from "./index.styles";
import ExpandDesSubject from "../../components/ExpandDesSubject";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types/data";
import Header from "../../components/Header";
import SearchBar from "../../components/Search";
import ItemExam from "../../components/ItemExam";
import { Exam } from "../../types/typeObj";
import { useCallback, useEffect, useState, useRef } from "react";
import { LIMIT, TYPE_EXAM } from "../../constants";
import { getExams } from "../../api/exam";
import { FileCIcon, FileIcon, FilePdfIcon } from "phosphor-react-native";
import { Icons } from "../../constants/icons";

type Props = {
  route: RouteProp<RootStackParamList, 'PracticeExamScreen'>;
};

const PracticeExamScreen = (props: Props) => {
  const { route } = props;
  const { subjectId, subjectCode, classCode, classId } = route.params;

  const navigation = useNavigation();

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
    // if (!subjectId && !classId) return;
    if (!subjectCode && !classId) return;
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
        // status?: 'ongoing' | 'upcoming';
        // sort?: 'newest' | 'oldest';
        subjectCodes: !!subjectCode ? [subjectCode] : undefined,
        class_id: classId,
        page: targetPage,
        limit: LIMIT,
        type: TYPE_EXAM.DE_LUYEN,
      };

      console.log("loanhtm list exam practice param: ", params);
      const res = await getExams(params);
      console.log("loanhtm list exam practice res: ", res);
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

  const handleGoBack = () => {
    console.log("go back");
    navigation.goBack();
  };

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

  const renderItemExam = ({ item, index }: { item: Exam; index: number }) => {
    const isSingleItem = exams.length === 1;
    return (
      <View style={{ flex: isSingleItem ? 1 : 0.5 }}>
        <ItemExam
          exam={item}
        // subjectCode={subjectCode}
        />
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
        handleGoBack={handleGoBack}
      />

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{`Làm chủ môn ${exams?.[0]?.subject?.name ?? ""}`}</Text>
          <Text style={styles.text}>Bộ đề được biên soạn theo chuẩn chương trình mới nhất</Text>
          <View style={styles.containTotalExam}>
            {/* <FileIcon style={{ width: 12, height: 20 }} color="#E5FF00" /> */}
            <Image source={Icons.FileFullIcon} style={styles.fileFullIcon} />
            <Text style={styles.totalExam}> {`${totalExam ?? 0} đề thi`}</Text>
          </View>
          <ExpandDesSubject text={exams?.[0]?.subject?.description?.trim() || ''} numberOfLines={5} />
        </View>
        <SearchBar />

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
