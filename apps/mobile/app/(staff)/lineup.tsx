import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScreenCard } from "../../components/screen-card";
import { theme } from "../../lib/theme";

export default function StaffLineupScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.stack}>
        <ScreenCard>
          <Text style={styles.title}>Dinner Service - March 9</Text>
          <Text style={styles.copy}>
            VIP allergy note for Table 42, reserve pairing spotlight, and feature language for chef&apos;s tasting menu.
          </Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonLabel}>Mark as Acknowledged</Text>
          </TouchableOpacity>
        </ScreenCard>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
    backgroundColor: theme.colors.background
  },
  stack: {
    gap: 10
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text
  },
  copy: {
    color: theme.colors.muted,
    lineHeight: 21
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    alignItems: "center"
  },
  buttonLabel: {
    color: "white",
    fontWeight: "700"
  }
});
