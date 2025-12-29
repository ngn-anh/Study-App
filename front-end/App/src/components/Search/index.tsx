import { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./index.styles";
import { FunnelIcon, MagnifyingGlassIcon } from "phosphor-react-native";

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <View style={styles.content}>
            <View style={styles.contentSearch}>
                <TouchableOpacity style={styles.searchButton}>
                    <MagnifyingGlassIcon size={20} color="#0C4299" />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder="Tìm kiếm..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            <TouchableOpacity style={styles.filterButton}>
                <FunnelIcon size={24} color="#083070" />
            </TouchableOpacity>
        </View>
    );
};

export default SearchBar;