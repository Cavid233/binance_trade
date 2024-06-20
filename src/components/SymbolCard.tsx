/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ISymbol, listOfSymbols} from '../data/symbols';
import {ITicker} from '../screens/HomeScreen';

interface ISymbolCard {
  selectedSymbol: ISymbol;
  setSelectedSymbolHandler: (symbol: ISymbol) => void;
  symbolsList: ITicker[];
}

const SymboCard: React.FC<ISymbolCard> = props => {
  return (
    <>
      {listOfSymbols.map((symbol: ISymbol) => {
        const findSymbol = props.symbolsList.find(
          item => item.symbol === symbol.id,
        );

        return (
          <TouchableOpacity
            key={symbol.id}
            onPress={() => {
              props.setSelectedSymbolHandler(symbol);
            }}>
            <View
              style={[
                styles.card,
                {
                  backgroundColor:
                    symbol.id === props.selectedSymbol.id
                      ? '#82B366'
                      : '#6C8EBF',
                },
              ]}>
              <Text style={styles.cardText}>{symbol.name}:</Text>
              <Text style={styles.cardText}>
                {findSymbol?.curDayClose
                  ? Number(findSymbol.curDayClose).toFixed(4)
                  : ''}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 100,
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    padding: 5,
    gap: 10,
  },
  cardText: {
    color: 'white',
  },
});

export default SymboCard;
