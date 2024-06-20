import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import PriceLevelBottomSheet from './src/components/PriceLevelBottomSheet';
import HomeScreen from './src/screens/HomeScreen';
import React, {useState} from 'react';

const App = () => {
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [selectPriceLevel, setSelectPriceLevel] = useState<number>(1);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <BottomSheetModalProvider>
        <PriceLevelBottomSheet
          isSheetVisible={isSheetVisible}
          setIsSheetVisible={setIsSheetVisible}
          selectPriceLevel={selectPriceLevel}
          setSelectPriceLevel={setSelectPriceLevel}
        />
        <HomeScreen
          selectPriceLevel={selectPriceLevel}
          setIsSheetVisible={setIsSheetVisible}
        />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default App;
