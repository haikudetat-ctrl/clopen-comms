import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View } from "react-native";
import { ScreenCard } from "../../components/screen-card";
import { theme } from "../../lib/theme";

export default function StaffTrainingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.stack}>
        <ScreenCard>
          <Text style={styles.title}>New Hire Foundations</Text>
          <Text style={styles.copy}>4 of 6 modules complete</Text>
        </ScreenCard>
        <ScreenCard>
          <Text style={styles.title}>Spring Menu Knowledge</Text>
          <Text style={styles.copy}>2 of 5 modules complete</Text>
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
    color: theme.colors.muted
  }
});
