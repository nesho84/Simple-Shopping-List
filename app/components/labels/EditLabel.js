import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../../config/colors";

export default function EditLabel(props) {
  const bgColors = [
    "#5CD859",
    "#24A6D9",
    "#595BD9",
    "#8022D9",
    "#D159D8",
    "#D85963",
    "#D88559",
  ];

  const [input, setInput] = useState(props.labelToEdit.title);
  const [labelColor, setLabelColor] = useState(props.labelToEdit.color);

  const handleAdd = () => {
    if (input.length < 1) {
      Alert.alert(
        "Required field",
        "Please insert at least one or more charachters.",
        [{ text: "OK" }],
        { cancelable: false }
      );
      return false;
    } else {
      props.handleEditLabel(props.labelToEdit.key, input, labelColor);
      setInput("");
    }
  };

  const RenderColors = () => {
    return bgColors.map((color) => {
      return (
        <TouchableOpacity
          key={color}
          style={[styles.selectColor, { backgroundColor: color }]}
          onPress={() => setLabelColor(color)}
        >
          {labelColor === color && (
            <MaterialIcons name="check" size={30} color="white" />
          )}
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: labelColor }]}>Edit Label</Text>

      <TextInput
        onChangeText={(text) => setInput(text)}
        style={styles.input}
        multiline
        placeholder="Enter text..."
        value={input}
      />

      <View style={styles.selectColorContainer}>
        <RenderColors />
      </View>

      <TouchableOpacity
        style={[styles.btnEdit, { backgroundColor: labelColor }]}
        onPress={handleAdd}
      >
        <Text style={styles.btnEditText}>SAVE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "80%",
  },
  title: {
    marginBottom: 25,
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    minHeight: 50,
    backgroundColor: "#fff",
    color: colors.dark,
    fontSize: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.light,
    borderBottomColor: "#DEE9F3",
    borderRadius: 5,
    paddingHorizontal: 15,
  },
  selectColorContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 12,
  },
  selectColor: {
    width: 30,
    height: 30,
    borderRadius: 5,
  },
  btnEdit: {
    height: 50,
    justifyContent: "center",
    marginTop: 20,
    padding: 11,
    borderRadius: 5,
  },
  btnEditText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 17,
    color: "white",
  },
});
