import 'react-native-gesture-handler';

import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ScrollView } from 'react-native';
import Home from './src/screens/Home';
import { useFonts } from 'expo-font'
import { SafeArea } from './src/components/safe-area.component';
import Routes from './src/routes';
import { AuthProvider } from './src/context/AuthProvider';
import { Provider as PaperProvider } from 'react-native-paper';
import { pt, registerTranslation } from 'react-native-paper-dates';
import i18n from './src/localization/i18n';
import { I18nextProvider } from 'react-i18next';

export default function App() {
  const [i18nKey, setI18nKey] = useState(0);

  const [loaded] = useFonts({
    QuicksandRegular: require('./src/assets/fonts/Quicksand-Regular.ttf'),
    QuicksandMedium: require('./src/assets/fonts/Quicksand-Medium.ttf'),
    QuicksandBold: require('./src/assets/fonts/Quicksand-Bold.ttf'),
  })
  registerTranslation('pt', pt);

/*   useEffect(() => {
// Force a reload of the i18n configuration after the component mounts
setI18nKey(i18nKey + 1);
  },[]) */

  

  if (!loaded) return null;
  return (
    <SafeArea >
      <I18nextProvider key={i18nKey}  >
      <PaperProvider>
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </PaperProvider>
      </I18nextProvider>
    </SafeArea>
  );
}


