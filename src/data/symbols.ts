export interface ISymbol {
  id: string;
  from: string;
  to: string;
  name: string;
}
export const listOfSymbols: ISymbol[] = [
  {
    id: 'BTCUSDT',
    from: 'BTC',
    to: 'USDT',
    name: 'BTC/USDT',
  },
  {
    id: 'BNBUSDT',
    from: 'BNB',
    to: 'USDT',
    name: 'BNB/USDT',
  },
  {
    id: 'ETHUSDT',
    from: 'ETH',
    to: 'USDT',
    name: 'ETH/USDT',
  },
  {
    id: 'SOLUSDT',
    from: 'SOL',
    to: 'USDT',
    name: 'SOL/USDT',
  },
  {
    id: 'PEPEUSDT',
    from: 'PEPE',
    to: 'USDT',
    name: 'PEPE/USDT',
  },
  {
    id: 'DOGEUSDT',
    from: 'DOGE',
    to: 'USDT',
    name: 'DOGE/USDT',
  },
  {
    id: 'ETHBTC',
    from: 'ETH',
    to: 'BTC',
    name: 'ETH/BTC',
  },
  {
    id: 'BNBBTC',
    from: 'BNB',
    to: 'BTC',
    name: 'BNB/BTC',
  },
  {
    id: 'SOLBTC',
    from: 'SOL',
    to: 'BTC',
    name: 'SOL/BTC',
  },
];
