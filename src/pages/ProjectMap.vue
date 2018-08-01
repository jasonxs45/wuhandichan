<template>
  <div class="project-map">
    <div class="map" ref="map"></div>
  </div>
</template>
<script>
import BMap from 'common/utils/BMap'
import {tounicode} from 'common/utils/unicode'
// 引入 ECharts 主模块
let echarts = require('echarts/lib/echarts')
// 引入地图
require('echarts/extension/bmap/bmap')
require('echarts/lib/chart/scatter')
let chinaCities = require('echarts/map/json/china-cities').features
const cities = [
  '北京',
  '沈阳',
  '天津',
  '大连',
  '西安',
  '郑州',
  '烟台',
  '青岛',
  '武汉',
  '扬州',
  '南京',
  '常州',
  '无锡',
  '苏州',
  '上海',
  '杭州',
  '绍兴',
  '金华',
  '宁波',
  '长沙',
  '广州',
  '东莞',
  '深圳',
  '佛山',
  '珠海',
  '昆明'
]
let data = []
/* eslint-disable no-unused-vars */
let usedCities = chinaCities.filter((item, index) => {
  if (cities.join('|').includes(item.properties.name)) {
    data.push({
      name: item.properties.name,
      value: item.properties.cp
    })
  }
  return cities.join('|').includes(item.properties.name)
})
let effectData = data.filter(item => item.name === '郑州' || item.name === '武汉' || item.name === '长沙')
effectData.forEach(item => {
  item.value.push({
    name: 'projectintro',
    params: {
      name: tounicode(item.name)
    }
  })
})
data = data.filter(item => item.name !== '郑州' && item.name !== '武汉' && item.name !== '长沙')
let bmap = BMap.CONFIG
let series = [
  {
    type: 'scatter',
    coordinateSystem: 'bmap',
    symbol: 'circle',
    symbolSize: 12,
    label: {
      normal: {
        show: false,
        formatter: '{b}',
        color: '#ea5532',
        position: 'right',
        textStyle: {
          fontSize: 10
        }
      }
    },
    itemStyle: {
      normal: {
        color: '#ea5532',
        shadowBlur: 10,
        shadowColor: 'rgba(0,0,0,.2)'
      },
      emphasis: {
        borderColor: '#fff',
        borderWidth: 0.5
      }
    },
    data
  },
  {
    type: 'effectScatter',
    coordinateSystem: 'bmap',
    symbolSize: 18,
    showEffectOn: 'render',
    rippleEffect: {
      brushType: 'stroke'
    },
    label: {
      normal: {
        show: true,
        formatter: '{b}',
        color: '#ea5532',
        position: 'top'
      }
    },
    itemStyle: {
      normal: {
        color: '#ea5532',
        shadowBlur: 10,
        shadowColor: 'rgba(0,0,0,.5)'
      },
      emphasis: {
        borderColor: '#fff',
        borderWidth: 0.5
      }
    },
    data: effectData
  }
]
let option = {
  tooltip: {
    trigger: 'item',
    formatter: '{b}'
  },
  bmap,
  series
}
export default {
  name: 'ProjectMap',
  data () {
    return {
      mapEchart: null
    }
  },
  computed: {
    map () {
      return this.mapEchart ? this.mapEchart.getModel().getComponent('bmap').getBMap() : {}
    }
  },
  mounted () {
    BMap.init().then(res => {
      this.initMap()
      this.map.setMinZoom(5)
      this.map.setMaxZoom(10)
      let geolocationControl = new window.BMap.GeolocationControl({
        anchor: window.BMAP_ANCHOR_BOTTOM_RIGHT
      })
      this.map.addControl(geolocationControl)
      this.map.addEventListener('zoomend', () => {
        bmap.zoom = this.map.getZoom()
        bmap.center = [this.map.getCenter().lng, this.map.getCenter().lat]
        if (this.map.getZoom() > 7) {
          series[0].label.normal.show = true
        } else {
          series[0].label.normal.show = false
        }
        this.mapEchart.setOption(option)
      }, false)
    })
  },
  methods: {
    initMap () {
      this.mapEchart = echarts.init(this.$refs.map)
      this.mapEchart.setOption(option)
      this.mapEchart.on('click', params => {
        if (params.componentType === 'series') {
          if (params.seriesType === 'effectScatter') {
            this.$router.push(params.value[2])
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.project-map {
  .map {
    width: 100vw;
    height: 100vh;
  }
}
</style>
