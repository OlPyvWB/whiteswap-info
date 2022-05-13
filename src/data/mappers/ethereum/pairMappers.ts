import { EthereumPair } from 'data/controllers/types/ethTypes'

export function pairMapper(payload: EthereumPair, ethPrice: number): Pair {
  const tokenOnePrice = payload.reserve1 && payload.reserve0 ? +payload.reserve1 / +payload.reserve0 : 0
  const tokenTwoPrice = payload.reserve1 && payload.reserve0 ? +payload.reserve0 / +payload.reserve1 : 0
  const apy = (+payload.oneDayVolumeUSD * 0.003 * 365 * 100) / +payload.reserveUSD
  const dayFees = +payload.oneDayVolumeUSD * 0.003

  return {
    id: payload.id || '',
    tokenOne: {
      id: payload.token0?.id || '',
      symbol: payload.token0?.symbol || '',
      price: tokenOnePrice,
      priceUSD: (payload.token0.derivedETH || 0) * ethPrice
    },
    tokenTwo: {
      id: payload.token1?.id || '',
      symbol: payload.token1?.symbol || '',
      price: tokenTwoPrice,
      priceUSD: (payload.token1.derivedETH || 0) * ethPrice
    },
    dayFees,
    apy,
    reserveOne: payload.reserve0 ? +payload.reserve0 : 0,
    reserveTwo: payload.reserve1 ? +payload.reserve1 : 0,
    totalSupply: +payload.totalSupply || 0,
    totalLiquidityUSD: payload.reserveUSD ? +payload.reserveUSD : 0,
    untrackedVolumeUSD: payload.untrackedVolumeUSD ? payload.untrackedVolumeUSD.toString() : '',
    dayVolumeUSD: payload.oneDayVolumeUSD ? +payload.oneDayVolumeUSD : 0,
    weekVolumeUSD: payload.oneWeekVolumeUSD ? +payload.oneWeekVolumeUSD : 0,
    volumeChangeUSD: payload.volumeChangeUSD ? +payload.volumeChangeUSD : 0,
    oneDayVolumeUntracked: payload.oneDayVolumeUntracked ? +payload.oneDayVolumeUntracked : 0,
    volumeChangeUntracked: payload.volumeChangeUntracked ? +payload.volumeChangeUntracked : 0,
    trackedReserveUSD: +payload.trackedReserveUSD ?? 0,
    liquidityChangeUSD: payload.liquidityChangeUSD ? +payload.liquidityChangeUSD : 0
  }
}

export function pairListMapper(payload: EthereumPair[], ethPrice: number): Pair[] {
  return payload.map(pair => pairMapper(pair, ethPrice))
}
