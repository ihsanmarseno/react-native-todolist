import {
  AddIcon,
  Button,
  CloseIcon,
  Fab,
  FormControl,
  FormControlHelperText,
  HStack,
  Image,
  Input,
  InputField,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ScrollView,
  SelectContent,
  SelectDragIndicator,
  SelectIcon,
  SelectInput,
  SelectItem,
  Spinner,
  StatusBar,
} from "@gluestack-ui/themed";
import { Box } from "@gluestack-ui/themed";
import { ButtonText } from "@gluestack-ui/themed";
import { Text } from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  ChevronDownIcon,
  GlobeIcon,
  LogOut,
  PaintBucket,
  PuzzleIcon,
  SettingsIcon,
} from "lucide-react-native";
import { Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { Card } from "@gluestack-ui/themed";
import { Heading } from "@gluestack-ui/themed";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/helper/fetcher";
import { FabIcon } from "@gluestack-ui/themed";
import { Modal } from "@gluestack-ui/themed";
import { ModalBackdrop } from "@gluestack-ui/themed";
import { ModalContent } from "@gluestack-ui/themed";
import { Icon } from "@gluestack-ui/themed";
import { ModalBody } from "@gluestack-ui/themed";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Task, TaskList } from "@/types/task";
import { addTaskSchema, AddTaskSchema } from "@/schema/addTaskSchema";
import { postRequest } from "@/helper/axios";
import { Select } from "@gluestack-ui/themed";
import { SelectTrigger } from "@gluestack-ui/themed";
import { SelectPortal } from "@gluestack-ui/themed";
import { SelectBackdrop } from "@gluestack-ui/themed";
import { SelectDragIndicatorWrapper } from "@gluestack-ui/themed";
import { Menu } from "@gluestack-ui/themed";
import { MenuItem } from "@gluestack-ui/themed";
import { MenuItemLabel } from "@gluestack-ui/themed";
import { useLoginHomepage } from "@/hooks/useCheckLogin";

export default function InProgressScreen() {
  const [name, setName] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const { data: tasksData, isLoading } = useSWR<TaskList>(
    `/tasks?status=${statusFilter || ""}`,
    fetcher
  );
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddTaskSchema>({
    resolver: zodResolver(addTaskSchema),
  });

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("name");
    await AsyncStorage.removeItem("tokenExpiry");

    router.replace("/(onboarding)/login");
  };

  useEffect(() => {
    const fetchName = async () => {
      const storedName = await AsyncStorage.getItem("name");
      setName(storedName);
    };
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      setToken(storedToken);
      if (!storedToken) {
        router.replace("/(onboarding)/login");
      }
    };
    fetchName();
    fetchToken();
    useLoginHomepage();
  }, []);

  const onSubmit = async (data: AddTaskSchema) => {
    console.log(data);

    const response = await postRequest("/tasks/create", data);

    if (response.status === 201) {
      mutate(`/tasks?status=${statusFilter || ""}`);
      Alert.alert("Success", "Task created successfully");
    } else {
      Alert.alert("Error", "Failed to create task");
    }
    setShowModalAdd(false);
    reset();
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="default" />
      <Image
        source={require("@/assets/images/ellipse.png")}
        style={styles.ellipseImage}
        alt="Ellipse"
      />
      <HStack justifyContent="space-between" p={20} alignItems="center">
        <Text fontFamily="Poppins_700Bold" fontSize={18}>
          Welcome,{"\n"}
          <Text fontFamily="Poppins_600SemiBold" color="#1F41BB" fontSize={24}>
            {name}
          </Text>
        </Text>
        <Button
          backgroundColor="#D32F2F"
          borderRadius={10}
          rounded={10}
          shadowColor="#1F41BB"
          shadowOffset={{ width: 0, height: 10 }}
          shadowOpacity={0.25}
          shadowRadius={10}
          elevation={5}
          onPress={handleLogout}
        >
          <LogOut size={16} color="white" />
        </Button>
      </HStack>

      <Select mx={20} mb={4} rounded={10} onValueChange={handleStatusChange}>
        <SelectTrigger variant="outline" size="md">
          <SelectInput
            placeholder="Select status"
            fontFamily="Poppins_400Regular"
          />
          <SelectIcon as={ChevronDownIcon} mx={2} />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            <SelectItem label="All" value="" />
            <SelectItem label="In Progress" value="in_progress" />
            <SelectItem label="Done" value="done" />
            <SelectItem label="Overdue" value="overdue" />
          </SelectContent>
        </SelectPortal>
      </Select>

      <ScrollView showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <Box flex={1} justifyContent="center" alignItems="center">
            <Spinner size="large" color={"#1F41BB"} />
          </Box>
        ) : (
          tasksData?.data?.map((task: Task) => (
            <Box px={20} key={task.task_id} py={6}>
              <Box></Box>
              <Card
                size="sm"
                variant="filled"
                backgroundColor="#F1F4FF"
                rounded={10}
              >
                <Heading size="md" mb={1} fontFamily="Poppins_600SemiBold">
                  {task.title}
                </Heading>
                <Text size="sm" fontFamily="Poppins_600SemiBold">
                  {task.description}
                </Text>
                <Text size="sm" fontFamily="Poppins_400Regular">
                  {task.due_date}
                </Text>
              </Card>

              <Menu
                offset={5}
                placement="bottom"
                trigger={({ ...triggerProps }) => {
                  return (
                    <Button {...triggerProps}>
                      <ButtonText>Menu</ButtonText>
                    </Button>
                  );
                }}
              >
                <MenuItem key="Community" textValue="Community">
                  <Icon as={GlobeIcon} size="sm" />
                  <MenuItemLabel size="sm" fontFamily="Poppins_400Regular">
                    Done
                  </MenuItemLabel>
                </MenuItem>
                <MenuItem key="Plugins" textValue="Plugins">
                  {/* PuzzleIcon is imported from 'lucide-react-native' */}
                  <Icon as={PuzzleIcon} size="sm" />
                  <MenuItemLabel size="sm" fontFamily="Poppins_400Regular">
                    Edit
                  </MenuItemLabel>
                </MenuItem>
                <MenuItem key="Theme" textValue="Theme">
                  {/* PaintBucket is imported from 'lucide-react-native' */}
                  <Icon as={PaintBucket} size="sm" />
                  <MenuItemLabel size="sm" fontFamily="Poppins_400Regular">
                    Delete
                  </MenuItemLabel>
                </MenuItem>
                <MenuItem key="Settings" textValue="Settings">
                  <Icon as={SettingsIcon} size="sm" />
                  <MenuItemLabel size="sm" fontFamily="Poppins_400Regular">
                    Settings
                  </MenuItemLabel>
                </MenuItem>
                <MenuItem key="Add account" textValue="Add account">
                  <Icon as={AddIcon} size="sm" />
                  <MenuItemLabel size="sm">Add account</MenuItemLabel>
                </MenuItem>
              </Menu>
            </Box>
          ))
        )}
      </ScrollView>

      <Fab
        size="lg"
        bgColor="#1F41BB"
        placement="bottom right"
        isHovered={false}
        isDisabled={false}
        isPressed={false}
        onPress={() => setShowModalAdd(true)}
      >
        <FabIcon as={AddIcon} />
      </Fab>

      <Modal
        isOpen={showModalAdd}
        onClose={() => {
          setShowModalAdd(false);
        }}
      >
        <ModalBackdrop />
        <ModalContent backgroundColor="white">
          <ModalHeader>
            <Heading size="md" fontFamily="Poppins_600SemiBold">
              Add New Task
            </Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} size="md" />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <FormControl isInvalid={!!errors.title}>
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <Input rounded={10}>
                      <InputField
                        placeholder="Title"
                        type="text"
                        fontFamily="Poppins_400Regular"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    </Input>
                    <FormControlHelperText>
                      {errors.title && (
                        <Text
                          color="red"
                          fontFamily="Poppins_400Regular"
                          fontSize={12}
                        >
                          {errors.title.message}
                        </Text>
                      )}
                    </FormControlHelperText>
                  </>
                )}
              />
            </FormControl>

            <FormControl isInvalid={!!errors.description}>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <Input rounded={10}>
                      <InputField
                        placeholder="Description"
                        type="text"
                        fontFamily="Poppins_400Regular"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    </Input>
                    <FormControlHelperText>
                      {errors.description && (
                        <Text
                          color="red"
                          fontFamily="Poppins_400Regular"
                          fontSize={12}
                        >
                          {errors.description.message}
                        </Text>
                      )}
                    </FormControlHelperText>
                  </>
                )}
              />
            </FormControl>

            <FormControl isInvalid={!!errors.due_date}>
              <Controller
                control={control}
                name="due_date"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <Input rounded={10}>
                      <InputField
                        placeholder="Due Date"
                        fontFamily="Poppins_400Regular"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    </Input>
                    <FormControlHelperText>
                      {errors.due_date && (
                        <Text
                          color="red"
                          fontFamily="Poppins_400Regular"
                          fontSize={12}
                        >
                          {errors.due_date.message}
                        </Text>
                      )}
                    </FormControlHelperText>
                  </>
                )}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              size="md"
              action="secondary"
              onPress={() => {
                setShowModalAdd(false);
              }}
              rounded={10}
              marginRight={8}
            >
              <ButtonText fontFamily="Poppins_400Regular">Cancel</ButtonText>
            </Button>
            <Button
              size="md"
              action="positive"
              onPress={handleSubmit(onSubmit)}
              rounded={10}
              bgColor="#1F41BB"
            >
              <ButtonText fontFamily="Poppins_400Regular">Add Task</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  ellipseImage: {
    position: "absolute",
    right: 0,
    top: 0,
    width: "100%",
    resizeMode: "contain",
  },
});
