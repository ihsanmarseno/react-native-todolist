import React, { useEffect } from "react";
import { Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Box,
  Button,
  ButtonText,
  HStack,
  StatusBar,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { router } from "expo-router";
import { useCheckLogin } from "@/hooks/useCheckLogin";

export default function HomeScreen() {
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

      <Box style={styles.welcomeContainer}>
        <Image
          source={require("@/assets/images/welcome.png")}
          alt="Welcome"
          style={styles.welcomeImage}
        />
      </Box>

      <VStack
        justifyContent="center"
        paddingHorizontal={40}
        width="100%"
        alignItems="center"
      >
        <Text
          color="#1F41BB"
          fontFamily="Poppins_600SemiBold"
          fontSize={35}
          textAlign="center"
        >
          Discover Your Dream Job here
        </Text>
        <Text
          color="black"
          fontFamily="Poppins_400Regular"
          fontSize={14}
          textAlign="center"
        >
          Explore all the existing job roles based on your interest and study
          major
        </Text>
        <Box flexDirection="row" marginTop={40} gap={20}>
          <Button
            backgroundColor="#1F41BB"
            borderRadius={10}
            paddingHorizontal={40}
            paddingVertical={10}
            height={50}
            shadowOffset={{ width: 0, height: 10 }}
            shadowOpacity={0.25}
            shadowRadius={10}
            elevation={5}
            onPress={() => {
              router.push("/(onboarding)/login");
            }}
          >
            <ButtonText
              color="white"
              fontFamily="Poppins_600SemiBold"
              fontSize={16}
            >
              Login
            </ButtonText>
          </Button>
          <Button
            backgroundColor="white"
            borderRadius={10}
            paddingHorizontal={40}
            paddingVertical={10}
            height={50}
            onPress={() => {
              router.push("/(onboarding)/register");
            }}
          >
            <ButtonText
              color="black"
              fontFamily="Poppins_600SemiBold"
              fontSize={16}
            >
              Register
            </ButtonText>
          </Button>
        </Box>
      </VStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white", // Ensure the background is white
  },
  ellipseImage: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 300,
    height: 300,
  },
  welcomeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 100,
  },
  welcomeImage: {
    width: 300,
    height: 300,
  },
});
