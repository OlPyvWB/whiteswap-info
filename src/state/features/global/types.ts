import { SupportedNetwork } from 'constants/networks'

export interface ChartDailyItem {
  date: number
  dailyVolumeUSD: number
  totalLiquidityUSD: number
}

export interface GlobalData {
  pairCount: number
  oneDayVolumeUSD: number
  volumeChangeUSD: number
  liquidityChangeUSD: number
  oneDayTxns: number
  oneWeekVolume: number
  weeklyVolumeChange: number
  totalLiquidityUSD: number
}

export interface Token {
  id: string
  symbol: string
}

export interface Pair {
  token0: Token
  token1: Token
}

export interface Transaction {
  id: string
  timestamp: string
}

export type LiquidityPositionUser = {
  id: string
}

export interface LiquidityPosition {
  pairAddress: string
  pairName: string
  token0: string
  token1: string
  usd: number
  user: LiquidityPositionUser
}

export interface GlobalNetworkState {
  globalData?: GlobalData
  chartData?: ChartDailyItem[]
  transactions?: Transactions
  price: number
  oneDayPrice: number
  priceChange: number
}

export type GlobalState = Record<SupportedNetwork, GlobalNetworkState>

export type UpdateGlobalDataPayload = ParamsWithNetwork<{
  data: GlobalData
}>

export type UpdateTransactionsPayload = ParamsWithNetwork<{
  transactions: Transactions
}>

export type UpdateChartPayload = ParamsWithNetwork<{
  data: ChartDailyItem[]
}>

export type UpdatePricePayload = ParamsWithNetwork<{
  price: number
  oneDayPrice: number
  priceChange: number
}>
