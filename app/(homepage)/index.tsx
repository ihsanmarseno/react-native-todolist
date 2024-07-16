import {
  AddIcon,
  Button,
  ButtonIcon,
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
  Toast,
  ToastTitle,
  ToastDescription,
  VStack,
} from "@gluestack-ui/themed";
import { Box } from "@gluestack-ui/themed";
import { ButtonText } from "@gluestack-ui/themed";
import { Text } from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  CheckIcon,
  ChevronDownIcon,
  CircleEllipsisIcon,
  Delete,
  EditIcon,
  GlobeIcon,
  LogOut,
  PaintBucket,
  PuzzleIcon,
  SettingsIcon,
  TrashIcon,
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
import { deleteRequest, postRequest, putRequest } from "@/helper/axios";
import { Select } from "@gluestack-ui/themed";
import { SelectTrigger } from "@gluestack-ui/themed";
import { SelectPortal } from "@gluestack-ui/themed";
import { SelectBackdrop } from "@gluestack-ui/themed";
import { SelectDragIndicatorWrapper } from "@gluestack-ui/themed";
import { Menu } from "@gluestack-ui/themed";
import { MenuItem } from "@gluestack-ui/themed";
import { MenuItemLabel } from "@gluestack-ui/themed";
import { useLoginHomepage } from "@/hooks/useCheckLogin";
import { useToast } from "@gluestack-ui/themed";

export default function InProgressScreen() {
  const [name, setName] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const toast = useToast();

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

  const {
    control: controlEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    reset: resetEdit,
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

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setShowModalEdit(true);
    resetEdit({
      title: task.title,
      description: task.description,
      due_date: task.due_date,
    });
  };

  const onSubmit = async (data: AddTaskSchema) => {
    const response = await postRequest("/tasks/create", data);

    const result = await response.data;

    if (response.status === 201) {
      mutate(`/tasks?status=${statusFilter || ""}`);
      toast.show({
        placement: "bottom",
        duration: 3000,
        render: () => (
          <Toast variant="accent" action="success">
            <VStack gap={4}>
              <ToastTitle>Success</ToastTitle>
              <ToastDescription>{result.message}</ToastDescription>
            </VStack>
          </Toast>
        ),
      });
    } else {
      toast.show({
        placement: "bottom",
        duration: 3000,
        render: () => (
          <Toast variant="accent" action="error">
            <VStack gap={4}>
              <ToastTitle>Error</ToastTitle>
              <ToastDescription>{result.message}</ToastDescription>
            </VStack>
          </Toast>
        ),
      });
    }
    setShowModalAdd(false);
    reset();
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
  };

  const onSubmitEdit = async (data: AddTaskSchema) => {
    const response = await putRequest(
      `/tasks/update/${selectedTask?.task_id}`,
      data
    );

    const result = await response.data;

    if (response.status === 200) {
      mutate(`/tasks?status=${statusFilter || ""}`);
      toast.show({
        placement: "bottom",
        duration: 3000,
        render: () => (
          <Toast variant="accent" action="success">
            <VStack gap={4}>
              <ToastTitle>Success</ToastTitle>
              <ToastDescription>{result.message}</ToastDescription>
            </VStack>
          </Toast>
        ),
      });
    } else {
      toast.show({
        placement: "bottom",
        duration: 3000,
        render: () => (
          <Toast variant="accent" action="error">
            <VStack gap={4}>
              <ToastTitle>Error</ToastTitle>
              <ToastDescription>{result.message}</ToastDescription>
            </VStack>
          </Toast>
        ),
      });
    }
    setShowModalEdit(false);
    resetEdit();
  };

  const handlePutStatus = async (task_id: string, status: string) => {
    const response = await putRequest(`/tasks/update-status/${task_id}`, {
      status,
    });

    const result = await response.data;

    if (response.status === 200) {
      mutate(`/tasks?status=${statusFilter || ""}`);
      toast.show({
        placement: "bottom",
        duration: 3000,
        render: () => (
          <Toast variant="accent" action="success">
            <VStack gap={4}>
              <ToastTitle>Success</ToastTitle>
              <ToastDescription>{result.message}</ToastDescription>
            </VStack>
          </Toast>
        ),
      });
    } else {
      toast.show({
        placement: "bottom",
        duration: 3000,
        render: () => (
          <Toast variant="accent" action="error">
            <VStack gap={4}>
              <ToastTitle>Error</ToastTitle>
              <ToastDescription>{result.message}</ToastDescription>
            </VStack>
          </Toast>
        ),
      });
    }
  };

  const handleDeleteTask = async (task_id: string) => {
    const response = await deleteRequest(`/tasks/delete/${task_id}`);

    const result = await response.data;

    if (response.status === 200) {
      mutate(`/tasks?status=${statusFilter || ""}`);
      toast.show({
        placement: "bottom",
        duration: 3000,
        render: () => (
          <Toast variant="accent" action="success">
            <VStack gap={4}>
              <ToastTitle>Success</ToastTitle>
              <ToastDescription>{result.message}</ToastDescription>
            </VStack>
          </Toast>
        ),
      });
    } else {
      toast.show({
        placement: "bottom",
        duration: 3000,
        render: () => (
          <Toast variant="accent" action="error">
            <VStack gap={4}>
              <ToastTitle>Error</ToastTitle>
              <ToastDescription>{result.message}</ToastDescription>
            </VStack>
          </Toast>
        ),
      });
    }
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
                justifyContent="space-between"
                flexDirection="row"
                alignItems="center"
              >
                <Box>
                  <Heading size="md" mb={1} fontFamily="Poppins_600SemiBold">
                    {task.title}
                  </Heading>
                  <Text size="sm" fontFamily="Poppins_600SemiBold">
                    {task.description}
                  </Text>
                  <Text size="sm" fontFamily="Poppins_400Regular">
                    {task.due_date}
                  </Text>
                </Box>
                {task.status !== "done" ? (
                  <Menu
                    width="$1/2"
                    offset={5}
                    placement="bottom"
                    trigger={({ ...triggerProps }) => {
                      return (
                        <CircleEllipsisIcon
                          size={28}
                          color="#1F41BB"
                          {...triggerProps}
                        />
                      );
                    }}
                  >
                    <MenuItem
                      textValue="Done"
                      onPress={() => handlePutStatus(task.task_id, "done")}
                    >
                      <Icon as={CheckIcon} size="sm" mr={4} />
                      <MenuItemLabel size="sm" fontFamily="Poppins_400Regular">
                        Done
                      </MenuItemLabel>
                    </MenuItem>
                    <MenuItem
                      textValue="Edit"
                      onPress={() => openEditModal(task)}
                    >
                      <Icon as={EditIcon} size="sm" mr={4} />
                      <MenuItemLabel size="sm" fontFamily="Poppins_400Regular">
                        Edit
                      </MenuItemLabel>
                    </MenuItem>
                    <MenuItem
                      textValue="Done"
                      onPress={() => handleDeleteTask(task.task_id)}
                    >
                      <Icon as={TrashIcon} size="sm" mr={4} />
                      <MenuItemLabel size="sm" fontFamily="Poppins_400Regular">
                        Delete
                      </MenuItemLabel>
                    </MenuItem>
                  </Menu>
                ) : null}
              </Card>
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

      <Modal
        isOpen={showModalEdit}
        onClose={() => {
          setShowModalEdit(false);
          resetEdit(); // Reset form jika modal ditutup
        }}
      >
        <ModalBackdrop />
        <ModalContent backgroundColor="white">
          <ModalHeader>
            <Heading size="md" fontFamily="Poppins_600SemiBold">
              Edit Task
            </Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} size="md" />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <FormControl isInvalid={!!errorsEdit.title}>
              <Controller
                control={controlEdit}
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
                      {errorsEdit.title && (
                        <Text
                          color="red"
                          fontFamily="Poppins_400Regular"
                          fontSize={12}
                        >
                          {errorsEdit.title.message}
                        </Text>
                      )}
                    </FormControlHelperText>
                  </>
                )}
              />
            </FormControl>

            <FormControl isInvalid={!!errorsEdit.description}>
              <Controller
                control={controlEdit}
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
                      {errorsEdit.description && (
                        <Text
                          color="red"
                          fontFamily="Poppins_400Regular"
                          fontSize={12}
                        >
                          {errorsEdit.description.message}
                        </Text>
                      )}
                    </FormControlHelperText>
                  </>
                )}
              />
            </FormControl>

            <FormControl isInvalid={!!errorsEdit.due_date}>
              <Controller
                control={controlEdit}
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
                      {errorsEdit.due_date && (
                        <Text
                          color="red"
                          fontFamily="Poppins_400Regular"
                          fontSize={12}
                        >
                          {errorsEdit.due_date.message}
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
                setShowModalEdit(false);
                resetEdit(); // Reset form jika modal ditutup
              }}
              rounded={10}
              marginRight={8}
            >
              <ButtonText fontFamily="Poppins_400Regular">Cancel</ButtonText>
            </Button>
            <Button
              size="md"
              action="positive"
              onPress={handleSubmitEdit(onSubmitEdit)}
              rounded={10}
              bgColor="#1F41BB"
            >
              <ButtonText fontFamily="Poppins_400Regular">
                Save Changes
              </ButtonText>
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
