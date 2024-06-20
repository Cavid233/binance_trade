import {BottomSheetModal} from '@gorhom/bottom-sheet';

import React, {useEffect, useRef} from 'react';
import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Success from '../assets/svgs/Success';

const priceLevels = [0.1, 1, 10, 50];

interface IPriceLevelBottomSheet {
  isSheetVisible: boolean;
  setIsSheetVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectPriceLevel: number;
  setSelectPriceLevel: React.Dispatch<React.SetStateAction<number>>;
}

const PriceLevelBottomSheet: React.FC<IPriceLevelBottomSheet> = props => {
  const bottomSheetModalRef = useRef<BottomSheetModal | null>(null);

  useEffect(() => {
    if (props.isSheetVisible) {
      bottomSheetModalRef?.current?.present();
    } else {
      bottomSheetModalRef?.current?.dismiss();
    }
  }, [props.isSheetVisible]);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={[350]}
      onDismiss={() => {
        props.setIsSheetVisible(false);
      }}>
      <View style={styles.container}>
        {priceLevels.map(price => (
          <TouchableOpacity
            key={price.toString()}
            style={styles.card}
            onPress={() => {
              props.setSelectPriceLevel(price);
              props.setIsSheetVisible(false);
            }}>
            <View style={styles.subCard}>
              <Text style={{fontSize: 18}}>{price}</Text>
              {price === props.selectPriceLevel && <Success />}
            </View>
          </TouchableOpacity>
        ))}
        <View style={styles.buttonWrapper}>
          <Button
            title="Iptal Et"
            onPress={() => {
              props.setIsSheetVisible(false);
            }}
          />
        </View>
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, paddingHorizontal: 15},
  card: {
    flex: 1,
    justifyContent: 'center',
  },
  subCard: {flexDirection: 'row', justifyContent: 'space-between'},
  buttonWrapper: {height: 100, justifyContent: 'center'},
});

export default PriceLevelBottomSheet;
