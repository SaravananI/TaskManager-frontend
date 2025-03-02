import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "./src/redux/store";
import { setAuthToken } from "./src/redux/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppNavigator from "./src/navigation/AppNavigator";
import { Provider as PaperProvider } from 'react-native-paper';

const Root = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem("token");
      dispatch(setAuthToken(token));
    };
    loadToken();
  }, []);

  return <AppNavigator />;
};

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
      <Root />
      </PaperProvider>
    </Provider>
  );
}
