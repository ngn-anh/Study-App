import { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./index.styles";
import { FeatherIcon, FunnelIcon, MagnifyingGlassIcon } from "phosphor-react-native";

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <View style={styles.content}>
            <TouchableOpacity style={styles.searchButton}>
                <MagnifyingGlassIcon size={24} color="#083070" /> {/* Icon tìm kiếm */}
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.filterButton}>
                <FunnelIcon size={24} color="#083070" /> {/* Icon lọc */}
            </TouchableOpacity>
        </View>
    );
};

export default SearchBar;