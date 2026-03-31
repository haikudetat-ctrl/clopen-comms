import { useEffect, useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { theme } from "../../lib/theme";
import { supabase } from "../../lib/supabase";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted && data.session) {
        router.replace("/(staff)");
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  async function onSubmit() {
    setLoading(true);
    setStatus("Signing in...");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setStatus(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setStatus(null);
    router.replace("/(staff)");
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.badge}>Atelier Group</Text>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>Use your invited account credentials.</Text>
        <TextInput
          placeholder="Email"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput placeholder="Password" style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />

        <Pressable style={styles.button} onPress={onSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonLabel}>Continue</Text>}
        </Pressable>

        {status ? <Text style={styles.status}>{status}</Text> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 18,
    backgroundColor: theme.colors.background
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 10
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#E8DECB",
    color: theme.colors.primary,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontWeight: "700"
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: theme.colors.text
  },
  subtitle: {
    color: theme.colors.muted,
    marginBottom: 4
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    padding: 11,
    backgroundColor: "#FFFFFF"
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
  },
  status: {
    color: theme.colors.muted
  }
});
