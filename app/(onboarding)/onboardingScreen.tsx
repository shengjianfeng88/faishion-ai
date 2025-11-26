import { styles } from "@/styles/onboarding.styles";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    text: "Get smart suggestions for every occasion. Your AI assistant knows your style, your fit, and your calendar.",
    image: require("@/assets/images/onboarding-1.png"),
  },
  {
    id: "2",
    text: "Every try-on is saved in one spot. Mix, match, and create outfits from your virtual closet.",
    image: require("@/assets/images/onboarding-2.png"),
  },
  {
    id: "3",
    text: "Snap a photo and see how clothes fit you, no guesswork, just realistic try-ons from your favorite brands.",
    image: require("@/assets/images/onboarding-3.png"),
  },
];

export default function OnboardingScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);
  const router = useRouter();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const pageIndex = Math.round(
      event.nativeEvent.contentOffset.x / width
    );
    setPage(pageIndex);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide, index) => (
          <View key={slide.id} style={styles.slide}>
            <Image source={slide.image} style={styles.image} />
            <Text style={styles.text}>{slide.text}</Text>
            {index === slides.length - 1 && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => router.replace("/(tabs)/homepage")}
              >
                <Text style={styles.buttonText}>Get Started</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i === page ? "#6A5ACD" : "#ccc" },
            ]}
          />
        ))}
      </View>
    </View>
  );
}
