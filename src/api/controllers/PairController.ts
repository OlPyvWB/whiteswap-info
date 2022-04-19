import ApiService from 'api/ApiService'
import {
  FILTERED_TRANSACTIONS,
  HOURLY_PAIR_RATES,
  PAIRS_BULK,
  PAIRS_CURRENT,
  PAIRS_HISTORICAL_BULK,
  PAIR_CHART,
  PAIR_DATA,
  PAIR_DAY_DATA_BULK,
  PAIR_SEARCH
} from 'api/queries/pairs'
import { BlockHeight } from 'api/types'
import { SupportedNetwork } from 'constants/networks'
import { IPairController } from './PairController.interface'

class PairController implements IPairController {
  public getFilteredTransactions(allPairs: string[]) {
    switch (ApiService.activeNetwork) {
      case SupportedNetwork.ETHEREUM:
      case SupportedNetwork.TRON:
        return ApiService.graphqlClient.query({
          query: FILTERED_TRANSACTIONS,
          variables: {
            allPairs
          },
          fetchPolicy: 'cache-first'
        })
    }
  }

  public getPairData(pairAddress: string, block?: number) {
    switch (ApiService.activeNetwork) {
      case SupportedNetwork.ETHEREUM:
      case SupportedNetwork.TRON:
        return ApiService.graphqlClient.query({
          query: PAIR_DATA,
          variables: {
            pairAddress,
            block: block ? { number: block } : null
          },
          fetchPolicy: 'cache-first'
        })
    }
  }

  public getPairsBulk(allPairs: string[]) {
    switch (ApiService.activeNetwork) {
      case SupportedNetwork.ETHEREUM:
      case SupportedNetwork.TRON:
        return ApiService.graphqlClient.query({
          query: PAIRS_BULK,
          variables: {
            allPairs
          },
          fetchPolicy: 'cache-first'
        })
    }
  }

  public getPairsHistoricalBulk(block: number, pairs: string[]) {
    switch (ApiService.activeNetwork) {
      case SupportedNetwork.ETHEREUM:
      case SupportedNetwork.TRON:
        return ApiService.graphqlClient.query({
          query: PAIRS_HISTORICAL_BULK,
          variables: {
            pairs,
            block: block ? { number: block } : null
          },
          fetchPolicy: 'cache-first'
        })
    }
  }

  public getPairChart(pairAddress: string, skip: number) {
    switch (ApiService.activeNetwork) {
      case SupportedNetwork.ETHEREUM:
      case SupportedNetwork.TRON:
        return ApiService.graphqlClient.query({
          query: PAIR_CHART,
          variables: {
            pairAddress: pairAddress,
            skip
          },
          fetchPolicy: 'cache-first'
        })
    }
  }

  public getCurrentPairs() {
    switch (ApiService.activeNetwork) {
      case SupportedNetwork.ETHEREUM:
      case SupportedNetwork.TRON:
        return ApiService.graphqlClient.query({
          query: PAIRS_CURRENT,
          fetchPolicy: 'cache-first'
        })
    }
  }

  public getPairHourlyRates(pairAddress: string, blocks: BlockHeight[]) {
    switch (ApiService.activeNetwork) {
      case SupportedNetwork.ETHEREUM:
      case SupportedNetwork.TRON:
        return ApiService.graphqlClient.query({
          query: HOURLY_PAIR_RATES(pairAddress, blocks),
          fetchPolicy: 'cache-first'
        })
    }
  }

  public searchPair(tokens: string[], id: string) {
    switch (ApiService.activeNetwork) {
      case SupportedNetwork.ETHEREUM:
      case SupportedNetwork.TRON:
        return ApiService.graphqlClient.query({
          query: PAIR_SEARCH,
          variables: {
            tokens,
            id
          }
        })
    }
  }

  public getPairDayDataBulk(pairs: string[], startDateTimestamp: number) {
    switch (ApiService.activeNetwork) {
      case SupportedNetwork.ETHEREUM:
      case SupportedNetwork.TRON:
        return ApiService.graphqlClient.query<any>({
          query: PAIR_DAY_DATA_BULK,
          variables: {
            pairs,
            startTimestamp: startDateTimestamp
          }
        })
    }
  }
}

export default PairController