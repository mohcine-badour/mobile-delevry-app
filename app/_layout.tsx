// import React, { useState, useEffect } from "react";
// import { View, StyleSheet, Image } from "react-native";
// import { Stack } from "expo-router";
// import * as SplashScreen from "expo-splash-screen";

// export default function RootLayout() {
//   const [isAppReady, setIsAppReady] = useState(false);

//   useEffect(() => {
//     const prepare = async () => {
//       try {
//         await SplashScreen.preventAutoHideAsync();
//         await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate loading
//       } catch (e) {
//         console.warn(e);
//       } finally {
//         setIsAppReady(true);
//         await SplashScreen.hideAsync();
//       }
//     };

//     prepare();
//   }, []);

//   if (!isAppReady) {
//     return (
//       <View style={styles.splashContainer}>
//         <Image
//           source={require("../assets/images/logo.png")}
//           style={styles.logo}
//           resizeMode="contain"
//         />
//       </View>
//     ); // Show splash screen until ready
//   }

//   return (
//     <Stack>
//       <Stack.Screen name="index" options={{ headerShown: false }} />
//     </Stack>
//   );
// }

// const styles = StyleSheet.create({
//   splashContainer: {
//     flex: 1,
//     backgroundColor: "#fff",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   logo: {
//     width: 200,
//     height: 200,
//   },
// });

import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* <Stack.Screen name="historique" options={{ headerShown: false }} /> */}
    </Stack>
  );
}
