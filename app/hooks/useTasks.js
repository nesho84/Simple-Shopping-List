import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Keyboard } from "react-native";
import { v4 as uuidv4 } from "uuid";

export default useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const tasksKey = "@TaskList_Key";

  // Handling Add item function
  const handleAdd = (text) => {
    if (text.length < 3) {
      Alert.alert(
        "Required field",
        "Please insert at least 3 charachters...",
        [{ text: "OK" }],
        { cancelable: false }
      );
    } else {
      const newTask = [
        {
          key: uuidv4(),
          name: text,
          date: new Date(),
          checked: false,
        },
        ...tasks,
      ];
      // First write the item to the storage
      writeToStorage(tasksKey, newTask);
      Keyboard.dismiss();
      setModalVisible(false);
      // Then set the new state
      setTasks(newTask);
    }
  };

  // Edit item from the state and update the storage
  const handleEdit = (taskKey, taskName) => {
    // Update tasks array of objects using 'map' / edit name
    let updatedTasks = tasks.map((task) =>
      task.key === taskKey ? { ...task, name: taskName } : task
    );
    // First write the item to the storage
    writeToStorage(tasksKey, updatedTasks);
    Keyboard.dismiss();
    setModalVisible(false);
    // Update the state
    setTasks(updatedTasks);
  };

  // Change to checked or unchecked item from the state and update the storage
  const handleChecked = (taskKey) => {
    // Update tasks array of objects using 'map' / toggle value 'checked'
    let updatedTasks = tasks.map((task) =>
      task.key === taskKey ? { ...task, checked: !task.checked } : task
    );
    // First write the item to the storage
    writeToStorage(tasksKey, updatedTasks);
    // Update the state
    setTasks(updatedTasks);
  };

  // Ordering Tasks with drag and drop
  const handleOrderedTasks = (orderedTasks) => {
    let unCheckedTasks = tasks.filter((task) => task.checked === false);
    let checkedTasks = tasks.filter((task) => task.checked === true);

    orderedTasks.map((task) => {
      // If the order of unchecked tasks was changed
      if (task.checked === false) {
        writeToStorage(tasksKey, [...orderedTasks, ...checkedTasks]);
        setTasks([...orderedTasks, ...checkedTasks]);
      }
      // If the order of checked tasks was changed
      else if (task.checked === true) {
        writeToStorage(tasksKey, [...orderedTasks, ...unCheckedTasks]);
        setTasks([...orderedTasks, ...unCheckedTasks]);
      }
    });
  };

  // Delete item from the state and update the storage
  const handleDelete = (taskKey) => {
    const filteredTasks = tasks.filter((task) => task.key !== taskKey);
    // First write the item to the storage
    writeToStorage(tasksKey, filteredTasks);
    // Then set the new state
    setTasks(filteredTasks);
  };

  // Write to the storage
  const writeToStorage = async (key, item) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(item));
    } catch (e) {
      console.log(e);
    }
  };

  // Clear stoage or Remove all items from storage
  const clearAllTasks = async () => {
    try {
      await AsyncStorage.removeItem(tasksKey);
      // set state
      setTasks([]);
    } catch (e) {
      console.log(e);
    }
  };

  // Read from storage
  const getAllTasks = async (key) => {
    try {
      let storageTasks = await AsyncStorage.getItem(key);
      storageTasks = JSON.parse(storageTasks);
      // (Fix TypeError: Invalid attempt to spread non-iterable instance)
      storageTasks && setTasks(storageTasks);
    } catch (e) {
      console.log(e);
    }
  };

  // // Filter checked and unchecked Tasks
  // const filterTasks = (tasks) => {
  //   // Filter tasks
  //   const unCheckedTasks = tasks
  //     .filter((task) => task.checked == false)
  //     .sort((a, b) => new Date(b.date) - new Date(a.date));
  //   const checkedTasks = tasks
  //     .filter((task) => task.checked == true)
  //     .sort((a, b) => new Date(b.date) - new Date(a.date));

  //   return [...unCheckedTasks, ...checkedTasks];
  // };

  useEffect(() => {
    getAllTasks(tasksKey);
  }, []);

  return {
    tasks,
    unCheckedTasks: tasks.filter((task) => task.checked === false),
    checkedTasks: tasks.filter((task) => task.checked === true),
    modalVisible,
    setModalVisible,
    handleAdd,
    handleEdit,
    handleChecked,
    handleOrderedTasks,
    handleDelete,
    writeToStorage,
    getAllTasks,
    clearAllTasks,
  };
};
