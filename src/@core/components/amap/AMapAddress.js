import { useEffect, useRef, useState } from 'react'
import { Button, Input } from 'reactstrap'
import axios from 'axios'
import './AMapAddress.scss'
let sdkPromise
function loadMap(config) {
  const base = String(axios.defaults.baseURL || window.location.origin).replace(/\/$/, '')
  window._AMapSecurityConfig = { serviceHost: `${base}/amap-proxy/${config.ticket}/_AMapService` }
  if (window.AMap) return Promise.resolve(window.AMap)
  if (!sdkPromise) sdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    const timer = setTimeout(() => { script.remove(); reject(new Error('timeout')) }, 15000)
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(config.jsKey)}`
    script.onload = () => { clearTimeout(timer); window.AMap ? resolve(window.AMap) : reject(new Error('unavailable')) }
    script.onerror = () => { clearTimeout(timer); script.remove(); reject(new Error('unavailable')) }
    document.head.appendChild(script)
  }).catch(error => { sdkPromise = null; throw error })
  return sdkPromise
}
export default function AMapAddress({ value, onChange }) {
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('')
  const [results, setResults] = useState([])
  const [busy, setBusy] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')
  const [config, setConfig] = useState(null)
  const [mapError, setMapError] = useState('')
  const [mapReady, setMapReady] = useState(false)
  const container = useRef(null), map = useRef(null), marker = useRef(null)
  useEffect(() => {
    let active = true
    axios.get('/admin/amap/config').then(r => { if (active) setConfig(r.data) }).catch(() => { if (active) setError('고덕지도 설정을 불러오지 못했습니다. 페이지를 다시 열어 주세요.') })
    return () => { active = false }
  }, [])
  useEffect(() => {
    let active = true
    setResults([]); setSearched(false); setBusy(false)
    if (!config?.searchReady || query.trim().length < 2) return () => { active = false }
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setBusy(true); setError('')
      try {
        const r = await axios.get('/admin/amap/places', { params: { keywords: query.trim(), region: region.trim() || undefined }, signal: controller.signal })
        if (active) { setResults(r.data || []); setSearched(true) }
      } catch (e) { if (active) setError(e.response?.data?.error?.msg || '장소 검색에 실패했습니다. 잠시 후 다시 검색해 주세요.') } finally { if (active) setBusy(false) }
    }, 300)
    return () => { active = false; clearTimeout(timer); controller.abort() }
  }, [query, region, config])
  useEffect(() => {
    if (!config?.jsKey) return undefined
    let active = true
    loadMap(config).then(AMap => {
      if (!active || !container.current) return
      map.current = new AMap.Map(container.current, { zoom: 11, center: [121.4737, 31.2304], viewMode: '2D' })
      setMapReady(true)
    }).catch(() => { if (active) setMapError('지도 미리보기를 불러오지 못했습니다. 검색 결과는 선택할 수 있습니다.') })
    return () => { active = false; map.current?.destroy(); map.current = null; marker.current = null }
  }, [config])
  useEffect(() => {
    if (!mapReady || !map.current || !window.AMap) return
    if (marker.current) { map.current.remove(marker.current); marker.current = null }
    if (value) {
      marker.current = new window.AMap.Marker({ position: [value.longitude, value.latitude] })
      map.current.add(marker.current)
      map.current.setZoomAndCenter(16, [value.longitude, value.latitude])
    }
  }, [value, mapReady])
  const select = place => { onChange(place); setQuery(''); setResults([]); setSearched(false) }
  return <div className="amap-address">
    <div className="amap-search-row">
      <Input aria-label="고덕지도 도시" placeholder="도시 (선택, 예: 上海)" value={region} maxLength={50} onChange={e => setRegion(e.target.value)} />
      <Input aria-label="고덕지도 장소 검색" placeholder="주소 또는 장소명 검색 (2자 이상)" value={query} maxLength={100} onChange={e => setQuery(e.target.value)} autoComplete="off" disabled={config?.searchReady === false} />
    </div>
    <small className="text-muted">선택 입력 · 검색 결과를 선택하면 미니프로그램에 표시됩니다.</small>
    {config?.searchReady === false && <div className="amap-message">고덕지도 검색 설정을 준비 중입니다. 선택하지 않아도 캠페인을 저장할 수 있습니다.</div>}
    <div aria-live="polite">{busy && <div className="amap-message">검색 중…</div>}{error && <div className="text-danger">{error}</div>}{searched && !busy && results.length === 0 && <div className="amap-message">검색 결과가 없습니다. 도시 또는 검색어를 변경해 주세요.</div>}</div>
    {results.length > 0 && <ul className="amap-results" aria-label="고덕지도 검색 결과">{results.map(place => <li key={place.poiId}><button type="button" onClick={() => select(place)}><strong>{place.name}</strong><span>{place.address}</span></button></li>)}</ul>}
    {value && <div className="amap-selected"><div><strong>{value.name}</strong><div>{value.address}</div></div><Button type="button" color="flat-danger" size="sm" onClick={() => { onChange(null); setQuery('') }}>선택 해제</Button></div>}
    <div className="amap-preview" aria-label="고덕지도 미리보기"><div ref={container} className="amap-canvas" />{(!config?.jsKey || mapError) && <div className="amap-map-message">{mapError || config?.mapMessage || '고덕지도 미리보기 설정을 준비 중입니다.'}</div>}</div>
  </div>
}
