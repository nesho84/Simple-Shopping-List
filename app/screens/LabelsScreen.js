import React, { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
// Contexts
import { TasksContext } from "../context/TasksContext";
import { LanguageContext } from "../context/LanguageContext";
// Custom Components
import AppScreen from "../components/AppScreen";
import AppNavbar from "../components/AppNavbar";
import AppLoading from "../components/AppLoading";
import AppModal from "../components/AppModal";
import LabelsList from "../components/labels/LabelsList";
import AddLabel from "../components/labels/AddLabel";
import EditLabel from "../components/labels/EditLabel";
import AddLabelButton from "../components/labels/AddLabelButton";
import useAppUpdate from "../hooks/useAppUpdate";

export default function LabelsScreen() {
  const { lang } = useContext(LanguageContext);
  const { labels, isLoading, addLabel, editLabel, orderLabels } = useContext(
    TasksContext
  );

  // Custom Hooks
  const { runUpdate, notifyUpdate } = useAppUpdate(lang);

  // Initialize App Update
  runUpdate();
  // Notify if the app is Updated
  !isLoading && notifyUpdate();

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [labelToEdit, setLabelToEdit] = useState(null);

  // Handle Add Label
  const handleAddLabel = (text, color) => {
    addLabel(text, color);
    setAddModalVisible(false);
  };

  // Open modal for editing Label
  const handleEditModal = (item) => {
    setLabelToEdit(item);
    setEditModalVisible(true);
  };

  // Handle Edit Label
  const handleEditLabel = (labelKey, input, color) => {
    editLabel(labelKey, input, color);
    setEditModalVisible(false);
  };

  return (
    <AppScreen>
      <AppNavbar />

      {isLoading ? (
        <AppLoading />
      ) : (
        // -----Main View START-----
        <View style={styles.container}>
          {/* -----Labels List----- */}
          <LabelsList
            labels={labels}
            orderLabels={orderLabels}
            handleEditModal={handleEditModal}
            lang={lang}
          />

          {/* Add Label Button -> Footer */}
          <AddLabelButton setModalVisible={setAddModalVisible} />

          {/* Add Label Modal */}
          <AppModal
            modalVisible={addModalVisible}
            setModalVisible={setAddModalVisible}
          >
            <AddLabel handleAddLabel={handleAddLabel} lang={lang} />
          </AppModal>

          {/* Edit Label Modal */}
          <AppModal
            modalVisible={editModalVisible}
            setModalVisible={setEditModalVisible}
          >
            <EditLabel
              labelToEdit={labelToEdit}
              handleEditLabel={handleEditLabel}
              lang={lang}
            />
          </AppModal>
        </View>
        // -----Main View END-----
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
