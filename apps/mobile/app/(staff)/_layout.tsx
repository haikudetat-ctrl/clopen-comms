import { useEffect, useState } from "react";
import { Redirect, Tabs } from "expo-router";
import { theme } from "../../lib/theme";
import { supabase } from "../../lib/supabase";

export default function StaffLayout() {
  const [ready, setReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setIsAuthenticated(Boolean(data.session));
      setReady(true);
    }

    void init();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setIsAuthenticated(Boolean(session));
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (!ready) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        tabBarStyle: { backgroundColor: theme.colors.surface },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="training" options={{ title: "Training" }} />
      <Tabs.Screen name="menu" options={{ title: "Menu" }} />
      <Tabs.Screen name="lineup" options={{ title: "Lineup" }} />
    </Tabs>
  );
}
