import { parseTokenInfo } from 'utils'

export function mintTransactionMapper(payload: MintTransaction): Transaction {
  return {
    hash: payload.transaction.id || '',
    timestamp: +payload.transaction.timestamp || 0,
    tokenOne: {
      id: payload.pair.token0.id,
      symbol: parseTokenInfo('symbol', payload.pair?.token0?.id, payload.pair?.token0?.symbol),
      amount: +payload.amount0 || 0
    },
    tokenTwo: {
      id: payload.pair.token1.id,
      symbol: parseTokenInfo('symbol', payload.pair?.token1?.id, payload.pair?.token1?.symbol),
      amount: +payload.amount1 || 0
    },
    amountUSD: +payload.amountUSD || 0,
    account: payload.to || '',
    type: 'mint'
  }
}

export function swapTransactionMapper(payload: SwapTransaction): Transaction {
  const netTokenOne = +payload.amount0In - +payload.amount0Out
  const netTokenTwo = +payload.amount1In - +payload.amount1Out

  const transaction: Transaction = {
    hash: payload.transaction.id || '',
    timestamp: +payload.transaction.timestamp || 0,
    tokenOne: {
      id: payload.pair.token0.id,
      symbol: parseTokenInfo('symbol', payload.pair?.token0?.id, payload.pair?.token0?.symbol),
      amount: 0
    },
    tokenTwo: {
      id: payload.pair.token1.id,
      symbol: parseTokenInfo('symbol', payload.pair?.token1?.id, payload.pair?.token1?.symbol),
      amount: 0
    },
    amountUSD: +payload.amountUSD || 0,
    account: payload.to || '',
    type: 'swap'
  }

  if (netTokenOne < 0) {
    transaction.tokenOne.amount = Math.abs(netTokenOne)
    transaction.tokenTwo.amount = Math.abs(netTokenTwo)
  } else if (netTokenTwo < 0) {
    transaction.tokenOne = {
      id: payload.pair?.token1?.id,
      symbol: parseTokenInfo('symbol', payload.pair?.token1?.id, payload.pair?.token1?.symbol),
      amount: Math.abs(netTokenTwo)
    }
    transaction.tokenTwo = {
      id: payload.pair?.token0?.id,
      symbol: parseTokenInfo('symbol', payload.pair?.token0?.id, payload.pair?.token0?.symbol),
      amount: Math.abs(netTokenOne)
    }
  }
  return transaction
}

export function burnTransactionMapper(payload: BurnTransaction): Transaction {
  return {
    hash: payload.transaction.id || '',
    timestamp: +payload.transaction.timestamp || 0,
    tokenOne: {
      id: payload.pair.token0.id,
      symbol: parseTokenInfo('symbol', payload.pair?.token0?.id, payload.pair?.token0?.symbol),
      amount: +payload.amount0 || 0
    },
    tokenTwo: {
      id: payload.pair.token1.id,
      symbol: parseTokenInfo('symbol', payload.pair?.token1?.id, payload.pair?.token1?.symbol),
      amount: +payload.amount1 || 0
    },
    amountUSD: +payload.amountUSD || 0,
    account: payload.sender || '',
    type: 'burn'
  }
}

export function transactionsMapper(payload: RawTransactions): Transactions {
  return {
    mints: payload?.mints.map(mintTransactionMapper),
    burns: payload?.burns.map(burnTransactionMapper),
    swaps: payload?.swaps.map(swapTransactionMapper)
  }
}
