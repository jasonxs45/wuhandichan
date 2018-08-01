let BMap = {
  init () {
    return new Promise((resolve, reject) => {
      const oScript = document.createElement('script')
      oScript.src = 'http://api.map.baidu.com/getscript?v=2.0&ak=PNhhMFEMvIgiZ8LO09zFNeBd3pHtnM7r&services=&t=20170511202040'
      oScript.type = 'text/javascript'
      document.head.appendChild(oScript)
      oScript.onload = () => {
        resolve(window.BMap)
      }
    })
  },
  CONFIG: {
    center: [114.298572, 30.583255],
    zoom: 5,
    roam: true,
    mapStyle: {
      styleJson: [
        {
          'featureType': 'boundary',
          'elementType': 'all',
          'stylers': {
            'color': '#ffffff',
            'visibility': 'on'
          }
        },
        {
          'featureType': 'land',
          'elementType': 'all',
          'stylers': {
            'color': '#f7d9d2ff',
            'visibility': 'on'
          }
        },
        {
          'featureType': 'label',
          'elementType': 'all',
          'stylers': {
              'visibility': 'off'
          }
        },
        {
          'featureType': 'road',
          'elementType': 'all',
          'stylers': {
            'visibility': 'off'
          }
        }
      ]
    }
  }
}
export default BMap
