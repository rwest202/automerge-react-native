import "react-native-get-random-values";

import { StyleSheet, TextInput } from "react-native";
import * as WebAssembly from "react-native-webassembly";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";

import { initializeWasm } from "@automerge/automerge/slim";

if (!global.WebAssembly) {
  global.WebAssembly = WebAssembly;
}

initializeWasm(
  fetch("https://esm.sh/@automerge/automerge@3.1.2/dist/automerge.wasm")
    .then((resp) => resp.arrayBuffer())
    .then((data) => new Uint8Array(data))
);

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="pencil.circle"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
        >
          Write
        </ThemedText>
      </ThemedView>
      <TextInput multiline={true} />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
