import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View } from "react-native";
import { ScreenCard } from "../../components/screen-card";
import { theme } from "../../lib/theme";

export default function StaffHomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.stack}>
        <ScreenCard>
          <Text style={styles.header}>Today&apos;s Preparation</Text>
          <Text style={styles.copy}>2 lessons due by 4:00 PM. Review lineup and tasting notes.</Text>
        </ScreenCard>
        <ScreenCard>
          <Text style={styles.title}>Certification Status</Text>
          <Text style={styles.copy}>Wine Service Level I: 78% complete</Text>
        </ScreenCard>
        <ScreenCard>
          <Text style={styles.title}>Lineup Reminder</Text>
          <Text style={styles.copy}>Acknowledge tonight&apos;s pre-shift update before arrival.</Text>
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
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text
  },
  copy: {
    color: theme.colors.muted,
    lineHeight: 22
  }
});
