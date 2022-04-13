import { Block } from 'api/types'
import { gql } from 'apollo-boost'
import { BUNDLE_ID, FACTORY_ADDRESS } from '../../constants'

export const SUBGRAPH_HEALTH = gql`
  query health {
    indexingStatusForCurrentVersion(subgraphName: "whiteswapfi/whiteswap") {
      synced
      health
      chains {
        chainHeadBlock {
          number
        }
        latestBlock {
          number
        }
      }
    }
  }
`

export const GET_BLOCK = gql`
  query blocks($timestampFrom: Int!, $timestampTo: Int!) {
    blocks(
      first: 1
      orderBy: timestamp
      orderDirection: asc
      where: { timestamp_gt: $timestampFrom, timestamp_lt: $timestampTo }
    ) {
      id
      number
      timestamp
    }
  }
`

export const GET_BLOCKS = (timestamps: number[]) => {
  let queryString = 'query blocks {'
  queryString += timestamps.map(timestamp => {
    return `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${
      timestamp + 600
    } }) {
      number
    }`
  })
  queryString += '}'
  return gql(queryString)
}

export const PRICES_BY_BLOCK = (tokenAddress: string, blocks: Block[]) => {
  let queryString = 'query blocks {'
  queryString += blocks.map(
    block => `
      t${block.timestamp}:token(id:"${tokenAddress}", block: { number: ${block.number} }) {
        derivedETH
      }
    `
  )
  queryString += ','
  queryString += blocks.map(
    block => `
      b${block.timestamp}: bundle(id:"1", block: { number: ${block.number} }) {
        ethPrice
      }
    `
  )

  queryString += '}'
  return gql(queryString)
}

export const SHARE_VALUE = (pairAddress: string, blocks: Block[]) => {
  let queryString = 'query blocks {'
  queryString += blocks.map(
    block => `
      t${block.timestamp}:pair(id:"${pairAddress}", block: { number: ${block.number} }) {
        reserve0
        reserve1
        reserveUSD
        totalSupply
        token0{
          derivedETH
        }
        token1{
          derivedETH
        }
      }
    `
  )
  queryString += ','
  queryString += blocks.map(
    block => `
      b${block.timestamp}: bundle(id:"1", block: { number: ${block.number} }) {
        ethPrice
      }
    `
  )

  return gql(queryString)
}

export const ETH_PRICE = (block?: number) => {
  const queryString = block
    ? `
    query bundles {
      bundles(where: { id: ${BUNDLE_ID} } block: {number: ${block}}) {
        id
        ethPrice
      }
    }
  `
    : ` query bundles {
      bundles(where: { id: ${BUNDLE_ID} }) {
        id
        ethPrice
      }
    }
  `
  return gql(queryString)
}

export const GLOBAL_CHART = gql`
  query whiteSwapDayDatas($startTime: Int!, $skip: Int!) {
    whiteSwapDayDatas(first: 1000, skip: $skip, where: { date_gt: $startTime }, orderBy: date, orderDirection: asc) {
      id
      date
      totalVolumeUSD
      dailyVolumeUSD
      dailyVolumeETH
      totalLiquidityUSD
      totalLiquidityETH
    }
  }
`

export const GLOBAL_DATA = (block?: number) => {
  const queryString = ` query whiteSwapFactories {
      whiteSwapFactories(
       ${block ? `block: { number: ${block}}` : ``}
       where: { id: "${FACTORY_ADDRESS}" }) {
        id
        totalVolumeUSD
        totalVolumeETH
        untrackedVolumeUSD
        totalLiquidityUSD
        totalLiquidityETH
        txCount
        pairCount
      }
    }`
  return gql(queryString)
}

export const GLOBAL_TXNS = gql`
  query transactions {
    transactions(first: 100, orderBy: timestamp, orderDirection: desc) {
      mints(orderBy: timestamp, orderDirection: desc) {
        transaction {
          id
          timestamp
        }
        pair {
          token0 {
            id
            symbol
          }
          token1 {
            id
            symbol
          }
        }
        to
        liquidity
        amount0
        amount1
        amountUSD
      }
      burns(orderBy: timestamp, orderDirection: desc) {
        transaction {
          id
          timestamp
        }
        pair {
          token0 {
            id
            symbol
          }
          token1 {
            id
            symbol
          }
        }
        sender
        liquidity
        amount0
        amount1
        amountUSD
      }
      swaps(orderBy: timestamp, orderDirection: desc) {
        transaction {
          id
          timestamp
        }
        pair {
          token0 {
            id
            symbol
          }
          token1 {
            id
            symbol
          }
        }
        amount0In
        amount0Out
        amount1In
        amount1Out
        amountUSD
        to
      }
    }
  }
`
