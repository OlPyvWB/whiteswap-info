import { useState, useMemo, useEffect, useRef } from 'react'
import { timeframeOptions } from '../../constants'
import { useGlobalChartDataSelector, useGlobalDataSelector } from 'state/features/global/selectors'
import { useMedia } from 'react-use'
import DropdownSelect from '../DropdownSelect'
import TradingViewChart, { CHART_TYPES } from '../TradingviewChart'
import { getTimeframe } from '../../utils'
import Panel from '../Panel'
import { useTranslation } from 'react-i18next'

const CHART_VIEW = {
  VOLUME: 'Volume',
  LIQUIDITY: 'Liquidity'
}

const VOLUME_WINDOW = {
  WEEKLY: 'WEEKLY',
  DAYS: 'DAYS'
}
const GlobalChart = ({ display }) => {
  const { t } = useTranslation()
  // chart options
  const [chartView, setChartView] = useState(display === 'volume' ? CHART_VIEW.VOLUME : CHART_VIEW.LIQUIDITY)

  // time window and window size for chart
  const timeWindow = timeframeOptions.ALL_TIME
  const [volumeWindow] = useState(VOLUME_WINDOW.DAYS)

  // global historical data
  const chartData = useGlobalChartDataSelector()
  const { totalLiquidityUSD, oneDayVolumeUSD, volumeChangeUSD, liquidityChangeUSD, oneWeekVolume, weeklyVolumeChange } =
    useGlobalDataSelector()

  // based on window, get starttim
  let utcStartTime = getTimeframe(timeWindow)

  const chartDataFiltered = useMemo(() => {
    return (
      chartData &&
      Object.keys(chartData)
        ?.map(key => {
          let item = chartData[key]
          if (item.date > utcStartTime) {
            return item
          } else {
            return
          }
        })
        .filter(item => {
          return !!item
        })
    )
  }, [chartData, utcStartTime, volumeWindow])
  const below800 = useMedia('(max-width: 800px)')

  // update the width on a window resize
  const ref = useRef()
  const isClient = typeof window === 'object'
  const [width, setWidth] = useState(ref?.current?.container?.clientWidth)
  useEffect(() => {
    if (!isClient) {
      return false
    }
    function handleResize() {
      setWidth(ref?.current?.container?.clientWidth ?? width)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isClient, width]) // Empty array ensures that effect is only run on mount and unmount

  return chartDataFiltered ? (
    <>
      {below800 && (
        <DropdownSelect options={CHART_VIEW} active={chartView} setActive={setChartView} color={'#2E69BB'} />
      )}
      {chartDataFiltered && chartView === CHART_VIEW.LIQUIDITY && (
        <Panel>
          <TradingViewChart
            data={chartData}
            base={totalLiquidityUSD}
            baseChange={liquidityChangeUSD}
            title={t('liquidity')}
            field="totalLiquidityUSD"
            width={width}
            type={CHART_TYPES.AREA}
          />
        </Panel>
      )}
      {chartDataFiltered && chartView === CHART_VIEW.VOLUME && (
        <Panel>
          <TradingViewChart
            data={chartDataFiltered}
            base={volumeWindow === VOLUME_WINDOW.WEEKLY ? oneWeekVolume : oneDayVolumeUSD}
            baseChange={volumeWindow === VOLUME_WINDOW.WEEKLY ? weeklyVolumeChange : volumeChangeUSD}
            title={volumeWindow === VOLUME_WINDOW.WEEKLY ? `${t('volume')} (7d)` : t('volume')}
            field={volumeWindow === VOLUME_WINDOW.WEEKLY ? 'weeklyVolumeUSD' : 'dailyVolumeUSD'}
            width={width}
            type={CHART_TYPES.BAR}
            useWeekly={volumeWindow === VOLUME_WINDOW.WEEKLY}
          />
        </Panel>
      )}
      {/* {display === 'volume' && (
        <RowFixed
          style={{
            bottom: '70px',
            position: 'absolute',
            left: '20px',
            zIndex: 10,
          }}
        >
          <OptionButton
            active={volumeWindow === VOLUME_WINDOW.DAYS}
            onClick={() => setVolumeWindow(VOLUME_WINDOW.DAYS)}
          >
            <TYPE.body>D</TYPE.body>
          </OptionButton>
          <OptionButton
            style={{ marginLeft: '4px' }}
            active={volumeWindow === VOLUME_WINDOW.WEEKLY}
            onClick={() => setVolumeWindow(VOLUME_WINDOW.WEEKLY)}
          >
            <TYPE.body>W</TYPE.body>
          </OptionButton>
        </RowFixed>
      )} */}
    </>
  ) : (
    ''
  )
}

export default GlobalChart
