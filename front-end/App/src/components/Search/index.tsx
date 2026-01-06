// import { useState } from "react";
// import { TextInput, TouchableOpacity, View } from "react-native";
// import { styles } from "./index.styles";
// import { FunnelIcon, MagnifyingGlassIcon } from "phosphor-react-native";


// const SearchBar = () => {
//     const [searchQuery, setSearchQuery] = useState("");

//     return (
//         <View style={styles.content}>
//             <View style={styles.contentSearch}>
//                 <TouchableOpacity style={styles.searchButton}>
//                     <MagnifyingGlassIcon size={20} color="#0C4299" />
//                 </TouchableOpacity>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Tìm kiếm..."
//                     value={searchQuery}
//                     onChangeText={setSearchQuery}
//                 />
//             </View>
//             <TouchableOpacity style={styles.filterButton}>
//                 <FunnelIcon size={24} color="#083070" />
//             </TouchableOpacity>
//         </View>
//     );
// };

// export default SearchBar;

import { styles } from "./index.styles";
import { TextInput, TouchableOpacity, View } from "react-native";
import { FunnelSimpleIcon, MagnifyingGlassIcon } from "phosphor-react-native";

interface Props {
    searchText: string;
    handleSearch: () => void;
    handleSearchTextChange: (text: string) => void
    openFilterModal: () => void;
}

const SearchBar = (props: Props) => {
    const { searchText, handleSearch, handleSearchTextChange, openFilterModal } = props;

    return (
        <View style={styles.content}>
            <View style={styles.contentSearch}>
                <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
                    <MagnifyingGlassIcon size={20} color="#B9D2FA" />
                </TouchableOpacity>
                <TextInput
                    placeholder="Tìm kiếm..."
                    placeholderTextColor="#999"
                    value={searchText}
                    onChangeText={handleSearchTextChange}
                    style={styles.input}
                />
            </View>
            <TouchableOpacity style={styles.filterButton} onPress={openFilterModal} >
                <FunnelSimpleIcon size={24} color="#1669EF" weight="bold" />
            </TouchableOpacity>
        </View>
    );
}

export default SearchBar;