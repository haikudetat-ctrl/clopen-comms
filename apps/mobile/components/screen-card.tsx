import { PropsWithChildren } from "react";
import { View, StyleSheet } from "react-native";
import { theme } from "../lib/theme";

export function ScreenCard({ children }: PropsWithChildren) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 8
  }
});
