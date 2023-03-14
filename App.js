import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ScrollView } from 'react-native';
import Home from './src/screens/Home';
import { useFonts } from 'expo-font'
import { SafeArea } from './src/components/safe-area.component';
import Routes from './src/routes';
import { AuthProvider } from './src/context/AuthProvider';
import { Provider as PaperProvider } from 'react-native-paper';
import { pt, registerTranslation } from 'react-native-paper-dates';


export default function App() {

  const [loaded] = useFonts({
    QuicksandRegular: require('./src/assets/fonts/Quicksand-Regular.ttf'),
    QuicksandMedium: require('./src/assets/fonts/Quicksand-Medium.ttf'),
    QuicksandBold: require('./src/assets/fonts/Quicksand-Bold.ttf'),
  })
  registerTranslation('pt', pt);

  if (!loaded) return null;
  return (
    <SafeArea >
      <PaperProvider>
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </PaperProvider>
    </SafeArea>
  );
}


