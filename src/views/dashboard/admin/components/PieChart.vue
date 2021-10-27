<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        title: {
          text: '设备状态',
          x: 'center',
          textStyle: {
            fontWeight: 'normal',
            color: 'black',
            fontSize: 18
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['设备在线', '设备离线', '设备未激活']
        },
        series: [
          {
            name: '销售量',
            type: 'pie',
            // roseType: 'radius',
            radius: [45, 65],
            center: ['50%', '38%'],
            data: [
              { value: 320, name: '设备在线' },
              { value: 240, name: '设备离线' },
              { value: 149, name: '设备未激活' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      },
      )
    }
  }
}
</script>
