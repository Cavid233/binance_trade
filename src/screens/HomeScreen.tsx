/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

// @ts-ignore
import Binance from 'binance-api-react-native';
import SymbolCard from '../components/SymbolCard';
import {ISymbol, listOfSymbols} from '../data/symbols';
import AskOrder from '../assets/svgs/AskOrder';
import BidOrder from '../assets/svgs/BidOrder';
import BothOrder from '../assets/svgs/BothOrder';
import DropDown from '../assets/svgs/DropDown';

const client = Binance();

enum KindOfOrderEnum {
  ASK = 'ASK',
  BID = 'BID',
  BOTH = 'BOTH',
}

export interface ITicker {
  eventType: string;
  eventTime: number;
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvg: string;
  prevDayClose: string;
  curDayClose: string;
  closeTradeQuantity: string;
  bestBid: string;
  bestBidQnt: string;
  bestAsk: string;
  bestAskQnt: string;
  open: string;
  high: string;
  low: string;
  volume: string;
  volumeQuote: string;
  openTime: number;
  closeTime: number;
  firstTradeId: number;
  lastTradeId: number;
  totalTrades: number;
}

interface IDepthData {
  eventType: string;
  eventTime: number;
  symbol: string;
  firstUpdateId: number;
  finalUpdateId: number;
  bidDepth: {
    price: string;
    quantity: string;
  }[];
  askDepth: {
    price: string;
    quantity: string;
  }[];
}

interface IHomeScreen {
  selectPriceLevel: number;
  setIsSheetVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

function roundNum(num: number, level: number) {
  const value = Math.round(num / level) * level;
  if (level === 0.1) {
    return value.toFixed(1);
  }

  return value.toString();
}

const HomeScreen: React.FC<IHomeScreen> = props => {
  const [selectedSymbol, setSelectedSymbol] = useState(listOfSymbols[0]);
  const selectedSymbolIdRef = React.useRef(selectedSymbol.id);
  const [selectedKindOfOrder, setSelectedKindOfOrder] = useState(
    KindOfOrderEnum.BOTH,
  );
  const [depthData, setDepthData] = useState<IDepthData | null>(null);
  const [symbolsList, setSymbolsList] = useState<ITicker[]>([]);

  const [priceValue, setPriceValue] = useState('');
  const prevPriceValue = React.useRef(priceValue);

  const changeKindOfOrderHandler = () => {
    switch (selectedKindOfOrder) {
      case KindOfOrderEnum.ASK:
        setSelectedKindOfOrder(KindOfOrderEnum.BID);
        break;
      case KindOfOrderEnum.BID:
        setSelectedKindOfOrder(KindOfOrderEnum.BOTH);
        break;
      case KindOfOrderEnum.BOTH:
        setSelectedKindOfOrder(KindOfOrderEnum.ASK);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setDepthData(null);

    const depthWS = client.ws.depth(selectedSymbol.id, (depth: IDepthData) => {
      const askDepth = depth.askDepth.map(item => ({
        ...item,
        price: roundNum(Number(item.price), Number(props.selectPriceLevel)),
      }));
      const bidDepth = depth.bidDepth.map(item => ({
        ...item,
        price: roundNum(Number(item.price), Number(props.selectPriceLevel)),
      }));

      setDepthData(() => ({...depth, askDepth, bidDepth}));
    });

    return () => {
      depthWS();
    };
  }, [selectedSymbol.id, props.selectPriceLevel]);

  useEffect(() => {
    const tickerWS = client.ws.allTickers((allTickersList: ITicker[]) => {
      const listOfSymbolsIds = listOfSymbols.map(item => item.id);
      const newSymbols = allTickersList.filter(item =>
        listOfSymbolsIds.includes(item.symbol),
      );
      setSymbolsList(() => [...newSymbols]);

      const findSymbol = newSymbols.find(
        item => item.symbol === selectedSymbolIdRef.current,
      );
      setPriceValue(prev => {
        prevPriceValue.current = prev;
        return findSymbol?.curDayClose ?? '';
      });
    });
    return () => {
      tickerWS();
    };
  }, [selectedSymbol.id]);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <SymbolCard
            symbolsList={symbolsList}
            selectedSymbol={selectedSymbol}
            setSelectedSymbolHandler={(value: ISymbol) => {
              setPriceValue('');
              selectedSymbolIdRef.current = value.id;
              setSelectedSymbol(value);
            }}
          />
        </ScrollView>
      </View>

      <View style={{flex: 1}}>
        <View style={styles.depthWrapper}>
          <Text style={{color: 'gray'}}>
            Fiyat:{'\n'}({selectedSymbol.to})
          </Text>
          <Text style={{color: 'gray'}}>
            Miktar:{'\n'}({selectedSymbol.from})
          </Text>
        </View>
        <ScrollView>
          {depthData &&
            (selectedKindOfOrder === KindOfOrderEnum.ASK ||
              selectedKindOfOrder === KindOfOrderEnum.BOTH) && (
              <>
                {depthData.askDepth.slice(0, 6).map((item, index) => (
                  <View key={index} style={styles.depthWrapper}>
                    <Text style={{color: 'red'}}>{item.price}</Text>
                    <Text style={{color: 'white'}}>{item.quantity}</Text>
                  </View>
                ))}
              </>
            )}
          {!!depthData &&
            (selectedKindOfOrder === KindOfOrderEnum.BID ||
              selectedKindOfOrder === KindOfOrderEnum.BOTH) && (
              <>
                {priceValue && (
                  <Text
                    style={[
                      styles.priceText,
                      {
                        color:
                          parseFloat(prevPriceValue.current) <=
                          parseFloat(priceValue)
                            ? 'green'
                            : 'red',
                      },
                    ]}>
                    {priceValue}$
                  </Text>
                )}
                {depthData.bidDepth.slice(0, 6).map((item, index) => (
                  <View key={index} style={styles.depthWrapper}>
                    <Text style={{color: 'green'}}>{item.price}</Text>
                    <Text style={{color: 'white'}}>{item.quantity}</Text>
                  </View>
                ))}
              </>
            )}
        </ScrollView>

        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.selectButtonWrapper}
            onPress={() => {
              props.setIsSheetVisible(true);
            }}>
            <View style={styles.selectButton}>
              <Text style={{color: 'white', fontSize: 18}}>
                {props.selectPriceLevel}
              </Text>
              <DropDown />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={changeKindOfOrderHandler}>
            {selectedKindOfOrder === KindOfOrderEnum.ASK && <AskOrder />}
            {selectedKindOfOrder === KindOfOrderEnum.BID && <BidOrder />}
            {selectedKindOfOrder === KindOfOrderEnum.BOTH && <BothOrder />}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    flexDirection: 'row',
  },
  depthWrapper: {
    flexDirection: 'row',
    padding: 30,
    justifyContent: 'space-between',
  },
  priceText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  selectButtonWrapper: {flex: 1, justifyContent: 'center'},
  selectButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerContainer: {
    height: 50,
    flexDirection: 'row',
    paddingHorizontal: 30,
  },
});

export default HomeScreen;
