import { useState, useEffect } from 'react'
import { useLocation, useParams, Navigate } from 'react-router-dom'
import { Text } from 'rebass'
import Link from 'components/Link'
import Panel from 'components/Panel'
import TokenLogo from 'components/TokenLogo'
import PairList from 'components/PairList'
import Loader from 'components/LocalLoader'
import { AutoRow, RowBetween, RowFixed } from 'components/Row'
import Column, { AutoColumn } from 'components/Column'
import { ButtonLight, ButtonDark } from 'components/ButtonStyled'
import TxnList from 'components/TxnList'
import TokenChart from 'components/TokenChart'
import { BasicLink } from 'components/Link'
import Search from 'components/Search'
import {
  formattedNum,
  getPoolLink,
  getSwapLink,
  localNumber,
  getBlockChainScanLink,
  getViewOnScanKey,
  isValidAddress
} from 'utils'
import { useTokenData, useTokenTransactions, useTokenPairsIds, useTokenPairs } from 'state/features/token/hooks'
import { useFormatPath, useColor } from 'hooks'
import { OVERVIEW_TOKEN_BLACKLIST } from 'constants/index'
import CopyHelper from 'components/Copy'
import { useMedia } from 'react-use'
import Warning from 'components/Warning'
import { usePathDismissed, useSavedTokens } from 'state/features/user/hooks'
import { PageWrapper, ContentWrapper } from 'components'
import FormattedName from 'components/FormattedName'
import { useListedTokens } from 'state/features/application/hooks'
import { TYPE, DashboardWrapper } from 'Theme'
import { useTranslation } from 'react-i18next'
import { useActiveNetworkId } from 'state/features/application/selectors'
import Percent from 'components/Percent'
import { PanelWrapper, TokenDetailsLayout, WarningGrouping, StyledBookmark } from './styled'

const TokenPage = () => {
  const { t } = useTranslation()
  const formatPath = useFormatPath()

  const location = useLocation()
  const { tokenAddress } = useParams()
  const activeNetworkId = useActiveNetworkId()

  if (OVERVIEW_TOKEN_BLACKLIST.includes(tokenAddress.toLowerCase()) || !isValidAddress(tokenAddress, activeNetworkId)) {
    return <Navigate to={formatPath('/')} />
  }

  const {
    id,
    name,
    symbol,
    priceUSD,
    oneDayVolumeUSD,
    totalLiquidityUSD,
    volumeChangeUSD,
    oneDayVolumeUT,
    volumeChangeUT,
    priceChangeUSD,
    liquidityChangeUSD,
    oneDayTxns,
    txnChange
  } = useTokenData(tokenAddress)

  // detect color from token
  const backgroundColor = useColor(id, symbol)

  const tokenPairIds = useTokenPairsIds(tokenAddress)

  // pairs to show in pair list
  const pairsList = useTokenPairs(tokenPairIds)
  // all transactions with this token
  const transactions = useTokenTransactions(tokenAddress)

  // price
  const price = priceUSD ? formattedNum(priceUSD, true) : ''

  // volume
  const volume =
    oneDayVolumeUSD || oneDayVolumeUSD === 0
      ? formattedNum(oneDayVolumeUSD === 0 ? oneDayVolumeUT : oneDayVolumeUSD, true)
      : oneDayVolumeUSD === 0
      ? '$0'
      : '-'

  // mark if using untracked volume
  const [usingUtVolume, setUsingUtVolume] = useState(false)
  useEffect(() => {
    setUsingUtVolume(oneDayVolumeUSD === 0 ? true : false)
  }, [oneDayVolumeUSD])

  const volumeChange = !usingUtVolume ? volumeChangeUSD : volumeChangeUT

  // liquidity
  const liquidity = totalLiquidityUSD ? formattedNum(totalLiquidityUSD, true) : totalLiquidityUSD === 0 ? '$0' : '-'

  // transactions

  const below1080 = useMedia('(max-width: 1080px)')
  const below1024 = useMedia('(max-width: 1024px)')
  const below600 = useMedia('(max-width: 600px)')
  const below440 = useMedia('(max-width: 440px)')

  // format for long symbol
  const LENGTH = below1080 ? 10 : 16
  const formattedSymbol = symbol?.length > LENGTH ? symbol.slice(0, LENGTH) + '...' : symbol

  const [dismissed, markAsDismissed] = usePathDismissed(location.pathname)
  const [savedTokens, addToken, removeToken] = useSavedTokens()
  const isTokenSaved = savedTokens[tokenAddress] ? true : false

  const listedTokens = useListedTokens()

  return (
    <PageWrapper>
      <Warning
        type={'token'}
        show={!dismissed && listedTokens.length > 0 && !listedTokens.includes(tokenAddress)}
        setShow={markAsDismissed}
        address={tokenAddress}
      />
      <ContentWrapper>
        <RowBetween style={{ flexWrap: 'wrap', alingItems: 'start' }}>
          <AutoRow align="flex-end" style={{ width: 'fit-content' }}>
            <TYPE.body>
              <BasicLink to={formatPath(`/tokens`)}>{`${t('tokens')} `}</BasicLink>→ {symbol}
              {'  '}
            </TYPE.body>
            <Link
              style={{ width: 'fit-content' }}
              color={backgroundColor}
              external
              href={getBlockChainScanLink(activeNetworkId, tokenAddress, 'token')}
            >
              <Text style={{ marginLeft: '.15rem' }} fontSize={'14px'} fontWeight={400}>
                ({tokenAddress.slice(0, 8) + '...' + tokenAddress.slice(36, 42)})
              </Text>
            </Link>
          </AutoRow>
          {!below600 && <Search small={true} />}
        </RowBetween>

        <WarningGrouping disabled={!dismissed && listedTokens && !listedTokens.includes(tokenAddress)}>
          <DashboardWrapper style={{ marginTop: below1080 ? '0' : '1rem' }}>
            <RowBetween
              style={{
                flexWrap: 'wrap',
                marginBottom: '2rem',
                alignItems: 'flex-start'
              }}
            >
              <RowFixed style={{ flexWrap: 'wrap' }}>
                <RowFixed style={{ alignItems: 'baseline' }}>
                  <TokenLogo
                    alt={symbol}
                    address={tokenAddress}
                    size={below440 ? '22px' : '32px'}
                    style={{ alignSelf: 'center' }}
                  />
                  <TYPE.main
                    fontSize={!below1080 ? '2.5rem' : below440 ? '1.25rem' : '1.5rem'}
                    style={{ margin: '0 1rem' }}
                  >
                    <RowFixed gap="6px">
                      <FormattedName text={name ? name + ' ' : ''} maxCharacters={16} style={{ marginRight: '6px' }} />{' '}
                      {formattedSymbol ? `(${formattedSymbol})` : ''}
                    </RowFixed>
                  </TYPE.main>{' '}
                  {!below1080 && (
                    <>
                      <TYPE.main fontSize={'1.5rem'} fontWeight={500} style={{ marginRight: '1rem' }}>
                        {price}
                      </TYPE.main>
                      {priceChangeUSD ? <Percent percent={priceChangeUSD} /> : ''}
                    </>
                  )}
                </RowFixed>
              </RowFixed>
              <RowFixed>
                <StyledBookmark
                  $saved={isTokenSaved}
                  onClick={() => {
                    isTokenSaved ? removeToken(tokenAddress) : addToken(tokenAddress)
                  }}
                />
                <Link href={getPoolLink(activeNetworkId, tokenAddress)} target="_blank">
                  <ButtonLight color={backgroundColor}>{t('addLiquidity')}</ButtonLight>
                </Link>
                <Link href={getSwapLink(activeNetworkId, tokenAddress)} target="_blank">
                  <ButtonDark ml={'.5rem'} color={backgroundColor}>
                    {t('trade')}
                  </ButtonDark>
                </Link>
              </RowFixed>
            </RowBetween>

            <PanelWrapper style={{ marginTop: below1080 ? '0' : '1rem' }}>
              {below1080 && price && (
                <Panel>
                  <AutoColumn gap="20px">
                    <RowBetween>
                      <TYPE.main>{t('price')}</TYPE.main>
                      <div />
                    </RowBetween>
                    <RowBetween align="flex-end">
                      {' '}
                      <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                        {price}
                      </TYPE.main>
                      <TYPE.main>{priceChangeUSD ? <Percent percent={priceChangeUSD} /> : ''}</TYPE.main>
                    </RowBetween>
                  </AutoColumn>
                </Panel>
              )}
              <Panel>
                <AutoColumn gap="20px">
                  <RowBetween>
                    <TYPE.light fontSize={14} fontWeight={500}>
                      {t('totalLiquidity')}
                    </TYPE.light>
                    <div />
                  </RowBetween>
                  <RowBetween align="flex-end">
                    <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                      {liquidity}
                    </TYPE.main>
                    <TYPE.main>
                      <Percent percent={liquidityChangeUSD} />
                    </TYPE.main>
                  </RowBetween>
                </AutoColumn>
              </Panel>
              <Panel>
                <AutoColumn gap="20px">
                  <RowBetween>
                    <TYPE.light fontSize={14} fontWeight={500}>
                      {t('volume24hrs')} {usingUtVolume && `(${t('untracked')})`}
                    </TYPE.light>
                    <div />
                  </RowBetween>
                  <RowBetween align="flex-end">
                    <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                      {volume}
                    </TYPE.main>
                    <TYPE.main>
                      <Percent percent={volumeChange} />
                    </TYPE.main>
                  </RowBetween>
                </AutoColumn>
              </Panel>

              <Panel>
                <AutoColumn gap="20px">
                  <RowBetween>
                    <TYPE.light fontSize={14} fontWeight={500}>
                      {t('transactions')} (24hrs)
                    </TYPE.light>
                    <div />
                  </RowBetween>
                  <RowBetween align="flex-end">
                    <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                      {oneDayTxns ? localNumber(oneDayTxns) : oneDayTxns === 0 ? 0 : '-'}
                    </TYPE.main>
                    <TYPE.main>
                      <Percent percent={txnChange} />
                    </TYPE.main>
                  </RowBetween>
                </AutoColumn>
              </Panel>
              <Panel
                style={{
                  gridColumn: !below1080 ? '2/4' : below1024 ? '1/4' : '2/-1',
                  gridRow: below1080 ? '' : '1/4'
                }}
              >
                <TokenChart address={tokenAddress} color={backgroundColor} base={priceUSD} />
              </Panel>
            </PanelWrapper>
          </DashboardWrapper>

          <DashboardWrapper style={{ marginTop: '1.5rem' }}>
            <TYPE.main fontSize={22} fontWeight={500}>
              {t('topPairs')}
            </TYPE.main>
            {tokenAddress && pairsList ? (
              <PairList color={backgroundColor} address={tokenAddress} pairs={pairsList} />
            ) : (
              <Loader />
            )}
          </DashboardWrapper>

          <DashboardWrapper style={{ marginTop: '1.5rem' }}>
            <TYPE.main fontSize={22} fontWeight={500}>
              {t('transactions')}
            </TYPE.main>
            {transactions ? <TxnList color={backgroundColor} transactions={transactions} /> : <Loader />}
          </DashboardWrapper>
          <DashboardWrapper style={{ marginTop: '1.5rem' }}>
            <TYPE.main fontSize={22} fontWeight={500}>
              Token Information
            </TYPE.main>
            <Panel
              rounded
              style={{
                marginTop: below440 ? '.75rem' : '1.5rem'
              }}
              p={20}
            >
              <TokenDetailsLayout>
                <Column>
                  <TYPE.light>{t('symbol')}</TYPE.light>
                  <TYPE.main style={{ marginTop: '.5rem' }} fontWeight="500">
                    {symbol}
                  </TYPE.main>
                </Column>
                <Column>
                  <TYPE.light>{t('name')}</TYPE.light>
                  <TYPE.main style={{ marginTop: '.5rem' }} fontWeight="500">
                    {name}
                  </TYPE.main>
                </Column>
                <Column>
                  <TYPE.light>{t('address')}</TYPE.light>
                  <RowBetween style={{ marginTop: '-5px' }}>
                    <TYPE.main style={{ marginTop: '.5rem' }} fontWeight="500">
                      {tokenAddress.slice(0, 8) + '...' + tokenAddress.slice(36, 42)}
                    </TYPE.main>
                    <CopyHelper toCopy={tokenAddress} />
                  </RowBetween>
                </Column>
                <ButtonLight color={backgroundColor}>
                  <Link
                    color={backgroundColor}
                    external
                    href={getBlockChainScanLink(activeNetworkId, tokenAddress, 'token')}
                  >
                    {t(getViewOnScanKey(activeNetworkId))} ↗
                  </Link>
                </ButtonLight>
              </TokenDetailsLayout>
            </Panel>
          </DashboardWrapper>
        </WarningGrouping>
      </ContentWrapper>
    </PageWrapper>
  )
}

export default TokenPage
