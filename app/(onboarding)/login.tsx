import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonSpinner,
  ButtonText,
  FormControl,
  FormControlHelperText,
  Image,
  Input,
  InputField,
  StatusBar,
  Text,
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
  VStack,
} from "@gluestack-ui/themed";
import { router } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputSlot } from "@gluestack-ui/themed";
import { InputIcon } from "@gluestack-ui/themed";
import { EyeIcon, EyeOffIcon } from "lucide-react-native";
import { LoginSchema, loginSchema } from "@/schema/loginSchema";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCheckLogin } from "@/hooks/useCheckLogin";

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const handleState = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const onSubmit = async (data: LoginSchema) => {
    setIsLoading(true);

    const response = await fetch(
      "https://apitodolist-prisma.vercel.app/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    setIsLoading(false);

    if (response.ok) {
      const expiryTime = Date.now() + 3600000; // 1 hour in milliseconds
      await AsyncStorage.setItem("token", result.token);
      await AsyncStorage.setItem("name", result.name);
      await AsyncStorage.setItem("tokenExpiry", expiryTime.toString());
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
      router.push("/(homepage)");
    } else {
      toast.show({
        placement: "bottom",
        duration: 3000,
        render: () => (
          <Toast variant="solid" action="error">
            <VStack gap={4}>
              <ToastTitle>Error</ToastTitle>
              <ToastDescription>
                Login failed. Please try again.
              </ToastDescription>
            </VStack>
          </Toast>
        ),
      });
    }
  };

  useEffect(() => {
    useCheckLogin();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Image
        source={require("@/assets/images/ellipse.png")}
        style={styles.ellipseImage}
        alt="Ellipse"
      />

      <Box width="100%" alignItems="center" justifyContent="center">
        <Text fontFamily="Poppins_700Bold" color="#1F41BB" fontSize={30}>
          Login here
        </Text>
        <Text
          fontFamily="Poppins_600SemiBold"
          color="black"
          fontSize={16}
          textAlign="center"
          width="70%"
          marginTop={24}
        >
          Welcome back! You’ve been missed!
        </Text>
      </Box>

      <Box
        paddingHorizontal={40}
        marginTop={30}
        width="100%"
        flexDirection="column"
      >
        <FormControl isInvalid={!!errors.email}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Input
                  $focus-borderColor="#1F41BB"
                  borderColor="#F1F4FF"
                  rounded={10}
                  px={4}
                  py={3}
                  h={64}
                  bgColor="#F1F4FF"
                >
                  <InputField
                    placeholder="Email"
                    type="text"
                    keyboardType="email-address"
                    fontFamily="Poppins_400Regular"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </Input>
                <FormControlHelperText>
                  {errors.email && (
                    <Text
                      color="red"
                      fontFamily="Poppins_400Regular"
                      fontSize={12}
                    >
                      {errors.email.message}
                    </Text>
                  )}
                </FormControlHelperText>
              </>
            )}
          />
        </FormControl>

        <FormControl isInvalid={!!errors.password}>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Input
                  $focus-borderColor="#1F41BB"
                  borderColor="#F1F4FF"
                  rounded={10}
                  px={4}
                  py={3}
                  h={64}
                  bgColor="#F1F4FF"
                >
                  <InputField
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    fontFamily="Poppins_400Regular"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  <InputSlot pr="$3" onPress={handleState}>
                    <InputIcon
                      as={showPassword ? EyeIcon : EyeOffIcon}
                      color="$darkBlue500"
                    />
                  </InputSlot>
                </Input>
                <FormControlHelperText>
                  {errors.password && (
                    <Text
                      color="red"
                      fontFamily="Poppins_400Regular"
                      fontSize={12}
                    >
                      {errors.password.message}
                    </Text>
                  )}
                </FormControlHelperText>
              </>
            )}
          />
        </FormControl>

        <Text
          textAlign="right"
          color="#1F41BB"
          fontFamily="Poppins_600SemiBold"
        >
          Forgot your password?
        </Text>

        <Box alignItems="center" marginTop={30}>
          <Button
            backgroundColor="#1F41BB"
            borderRadius={10}
            width="100%"
            rounded={10}
            height={56}
            shadowColor="#1F41BB"
            shadowOffset={{ width: 0, height: 10 }}
            shadowOpacity={0.25}
            shadowRadius={10}
            elevation={5}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ButtonSpinner color="white" />
            ) : (
              <ButtonText
                color="white"
                fontFamily="Poppins_600SemiBold"
                textAlign="center"
                fontSize={20}
              >
                Sign In
              </ButtonText>
            )}
          </Button>
        </Box>

        <Text
          marginTop={40}
          color="#494949"
          fontFamily="Poppins_600SemiBold"
          textAlign="center"
          fontSize={14}
          onPress={() => router.push("/(onboarding)/register")}
        >
          Create new account
        </Text>

        <Text
          marginTop={60}
          color="#494949"
          fontFamily="Poppins_600SemiBold"
          textAlign="center"
          fontSize={14}
        >
          Or continue with
        </Text>

        <Box
          flexDirection="row"
          justifyContent="center"
          gap={10}
          marginTop={20}
        >
          <Button backgroundColor="#ECECEC" borderRadius={10}>
            <Icon name="google" size={24} color="black" />
          </Button>
          <Button backgroundColor="#ECECEC" borderRadius={10}>
            <Icon name="facebook" size={24} color="black" />
          </Button>
          <Button backgroundColor="#ECECEC" borderRadius={10}>
            <Icon name="apple" size={24} color="black" />
          </Button>
        </Box>
      </Box>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  ellipseImage: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 300,
    height: 300,
  },
});
