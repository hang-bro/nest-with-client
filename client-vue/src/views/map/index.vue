<template>
  <div>
    <!-- vite 设置https才行 -->
    <div ref="mapContainer" style="width: 100%; height: 600px"></div>
    <p>当前城市: {{ city }}</p>
    <p>天气情况: {{ weather }}</p>
    <p>温度: {{ temperature }}</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { mapConfig } from './config.tsx'

const mapContainer = ref(null)
const city = ref('')
const weather = ref('')
const temperature = ref('')

onMounted(() => {
  initMap()
})

const initMap = async () => {
  const AMap = await AMapLoader.load({
    key: mapConfig.key, // 替换为你的高德开放平台服务key
    version: '2.0',
    plugins: ['AMap.Geocoder', 'AMap.Geolocation'],
    ceter: [139.7492, 35.8313],
  })

  const map = new AMap.Map(mapContainer.value, {
    resizeEnable: true,
  })

  return
  AMap.plugin('AMap.Geolocation', () => {
    const geolocation = new AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
      convert: true,
      showMarker: true,
      showCircle: true,
      panToLocation: true,
      zoomToAccuracy: true,
    })
    map.addControl(geolocation)
    geolocation.getCurrentPosition((status, result) => {
      if (status === 'complete') {
        getCity(result.position)
      } else {
        console.log('获取位置失败')
        console.log(`status, result ==>`, status, result)
      }
    })
  })

  const getCity = (position) => {
    // const lnglatXY = [position.getLng(), position.getLat()]
    const lnglatXY = [35.8313, 139.7492]
    const geo = new AMap.Geocoder({
      radius: 1000,
      extensions: 'base',
    })
    geo.getAddress(lnglatXY, (status, result) => {
      console.log(`status, result ==>`, status, result)
      if (status === 'complete' && result.info === 'OK') {
        city.value = result.regeocode.addressComponent.city
        getWeatherInfo(city.value)
      }
    })
  }

  const getWeatherInfo = (cityName) => {
    const weatherUrl = `https://restapi.amap.com/v3/weather/weatherInfo?key=YOUR_AMAP_KEY&city=${cityName}&extensions=base`
    fetch(weatherUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === '1') {
          weather.value = data.lives[0].weather
          temperature.value = data.lives[0].temperature
        } else {
          console.log('获取天气信息失败')
        }
      })
      .catch((error) => console.log('出错:', error))
  }
}
</script>
