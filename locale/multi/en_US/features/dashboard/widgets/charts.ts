export default {
  // 圖表標題和描述
  titles: {
    userGrowth: 'User Growth Trend',
    revenueAnalysis: 'Revenue Analysis',
    activityStats: 'Activity Statistics',
    conversionFunnel: 'Conversion Funnel',
    geographicDistribution: 'Geographic Distribution',
    deviceBreakdown: 'Device Analysis',
    trafficSources: 'Traffic Sources',
    performanceMetrics: 'Performance Metrics'
  },

  // 圖表配置
  config: {
    colors: {
      primary: '#1890ff',
      secondary: '#52c41a',
      accent: '#faad14',
      warning: '#f5222d',
      info: '#13c2c2',
      success: '#52c41a',
      error: '#f5222d',
      palette: [
        '#1890ff', '#52c41a', '#faad14', '#f5222d', '#13c2c2',
        '#722ed1', '#eb2f96', '#fa8c16', '#a0d911', '#1890ff'
      ]
    },
    animations: {
      enabled: true,
      duration: 1000,
      easing: 'easeInOutCubic',
      delay: 100,
      stagger: 50
    },
    responsive: {
      enabled: true,
      breakpoints: {
        xs: 480,
        sm: 768,
        md: 1024,
        lg: 1200,
        xl: 1600
      }
    }
  },

  // 用戶成長圖表
  userGrowth: {
    title: 'User Growth Trend',
    subtitle: 'User growth over the past 12 months',
    type: 'line',
    xAxis: {
      title: 'Time',
      type: 'category',
      data: ['2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06']
    },
    yAxis: {
      title: 'User Count',
      type: 'value',
      min: 0,
      max: 20000
    },
    series: [
      {
        name: 'New Users',
        type: 'line',
        data: [1200, 1350, 1500, 1650, 1800, 1950],
        color: '#1890ff',
        smooth: true,
        areaStyle: {
          opacity: 0.3
        }
      },
      {
        name: 'Active Users',
        type: 'line',
        data: [800, 920, 1100, 1250, 1400, 1550],
        color: '#52c41a',
        smooth: true,
        areaStyle: {
          opacity: 0.3
        }
      },
      {
        name: 'Total Users',
        type: 'line',
        data: [5000, 6350, 7850, 9500, 11300, 13250],
        color: '#faad14',
        smooth: true,
        areaStyle: {
          opacity: 0.3
        }
      }
    ],
    legend: {
      show: true,
      position: 'top',
      align: 'center'
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}<br/>{a0}: {c0}<br/>{a1}: {c1}<br/>{a2}: {c2}'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    }
  },

  // 營收分析圖表
  revenueAnalysis: {
    title: 'Revenue Analysis',
    subtitle: 'Revenue performance by product line',
    type: 'bar',
    xAxis: {
      title: 'Month',
      type: 'category',
      data: ['2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06']
    },
    yAxis: {
      title: 'Revenue (10K)',
      type: 'value',
      min: 0,
      max: 200
    },
    series: [
      {
        name: 'Product A',
        type: 'bar',
        data: [50, 55, 60, 65, 70, 75],
        color: '#1890ff',
        stack: 'total'
      },
      {
        name: 'Product B',
        type: 'bar',
        data: [30, 35, 40, 45, 50, 55],
        color: '#52c41a',
        stack: 'total'
      },
      {
        name: 'Product C',
        type: 'bar',
        data: [20, 25, 30, 35, 40, 45],
        color: '#faad14',
        stack: 'total'
      },
      {
        name: 'Service Revenue',
        type: 'bar',
        data: [15, 18, 22, 25, 28, 32],
        color: '#13c2c2',
        stack: 'total'
      }
    ],
    legend: {
      show: true,
      position: 'top',
      align: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    }
  },

  // 活動統計圖表
  activityStats: {
    title: 'Activity Statistics',
    subtitle: 'User activity and interaction',
    type: 'area',
    xAxis: {
      title: 'Date',
      type: 'category',
      data: ['2023-06-01', '2023-06-02', '2023-06-03', '2023-06-04', '2023-06-05']
    },
    yAxis: {
      title: 'Activity Count',
      type: 'value',
      min: 0,
      max: 2000
    },
    series: [
      {
        name: 'Page Views',
        type: 'line',
        data: [1200, 1350, 1500, 1650, 1800],
        color: '#1890ff',
        smooth: true,
        areaStyle: {
          opacity: 0.6
        }
      },
      {
        name: 'Clicks',
        type: 'line',
        data: [300, 350, 400, 450, 500],
        color: '#52c41a',
        smooth: true,
        areaStyle: {
          opacity: 0.6
        }
      },
      {
        name: 'Conversions',
        type: 'line',
        data: [45, 52, 60, 68, 75],
        color: '#faad14',
        smooth: true,
        areaStyle: {
          opacity: 0.6
        }
      },
      {
        name: 'Downloads',
        type: 'line',
        data: [120, 135, 150, 165, 180],
        color: '#13c2c2',
        smooth: true,
        areaStyle: {
          opacity: 0.6
        }
      }
    ],
    legend: {
      show: true,
      position: 'top',
      align: 'center'
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}<br/>{a0}: {c0}<br/>{a1}: {c1}<br/>{a2}: {c2}<br/>{a3}: {c3}'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    }
  },

  // 轉換漏斗圖表
  conversionFunnel: {
    title: 'Conversion Funnel',
    subtitle: 'User conversion flow analysis',
    type: 'funnel',
    data: [
      { name: 'Visit', value: 10000, color: '#1890ff' },
      { name: 'Register', value: 8000, color: '#52c41a' },
      { name: 'Trial', value: 6000, color: '#faad14' },
      { name: 'Purchase', value: 4000, color: '#f5222d' },
      { name: 'Renewal', value: 3000, color: '#13c2c2' }
    ],
    legend: {
      show: true,
      position: 'right',
      orient: 'vertical'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    }
  },

  // 地理分布圖表
  geographicDistribution: {
    title: 'Geographic Distribution',
    subtitle: 'User geographic distribution',
    type: 'map',
    map: 'china',
    data: [
      { name: 'Beijing', value: 1000, color: '#1890ff' },
      { name: 'Shanghai', value: 800, color: '#52c41a' },
      { name: 'Guangzhou', value: 600, color: '#faad14' },
      { name: 'Shenzhen', value: 500, color: '#f5222d' },
      { name: 'Hangzhou', value: 400, color: '#13c2c2' }
    ],
    visualMap: {
      min: 0,
      max: 1000,
      left: 'left',
      top: 'bottom',
      text: ['High', 'Low'],
      calculable: true
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}<br/>User Count: {c}'
    }
  },

  // 設備分析圖表
  deviceBreakdown: {
    title: 'Device Analysis',
    subtitle: 'User device distribution',
    type: 'pie',
    data: [
      { name: 'Desktop', value: 45, color: '#1890ff' },
      { name: 'Mobile', value: 35, color: '#52c41a' },
      { name: 'Tablet', value: 15, color: '#faad14' },
      { name: 'Other', value: 5, color: '#13c2c2' }
    ],
    legend: {
      show: true,
      position: 'right',
      orient: 'vertical'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    label: {
      show: true,
      formatter: '{b}: {d}%'
    }
  },

  // 圖表互動
  interactions: {
    zoom: {
      enabled: true,
      type: 'inside',
      xAxisIndex: [0],
      yAxisIndex: [0]
    },
    brush: {
      enabled: true,
      type: 'lineX',
      xAxisIndex: [0]
    },
    dataZoom: {
      enabled: true,
      type: 'inside',
      start: 0,
      end: 100
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {
          title: 'Save as Image',
          name: 'chart'
        },
        dataZoom: {
          title: 'Data Zoom'
        },
        restore: {
          title: 'Restore'
        }
      }
    }
  },

  // 圖表載入狀態
  loading: {
    text: 'Loading...',
    color: '#1890ff',
    textColor: '#000',
    maskColor: 'rgba(255, 255, 255, 0.8)',
    zlevel: 0
  },

  // 圖表錯誤處理
  error: {
    text: 'Loading failed',
    color: '#f5222d',
    textColor: '#000',
    maskColor: 'rgba(255, 255, 255, 0.8)',
    zlevel: 0
  }
}
