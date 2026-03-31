import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View } from "react-native";
import { ScreenCard } from "../../components/screen-card";
import { theme } from "../../lib/theme";

export default function StaffMenuScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.stack}>
        <ScreenCard>
          <Text style={styles.title}>Dry-Aged Duck Breast</Text>
          <Text style={styles.copy}>Allergens: dairy. Pairing: Burgundy Pinot Noir.</Text>
        </ScreenCard>
        <ScreenCard>
          <Text style={styles.title}>Crudo of Hamachi</Text>
          <Text style={styles.copy}>Allergens: fish, citrus. Pairing: Sancerre.</Text>
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
