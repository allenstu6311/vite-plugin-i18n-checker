export default {
  // 圖表標題和描述
  titles: {
    userGrowth: '用戶成長趨勢',
    revenueAnalysis: '營收分析',
    activityStats: '活動統計',
    conversionFunnel: '轉換漏斗',
    geographicDistribution: '地理分布',
    deviceBreakdown: '設備分析',
    trafficSources: '流量來源',
    performanceMetrics: '效能指標'
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
    title: '用戶成長趨勢',
    subtitle: '過去 12 個月的用戶成長情況',
    type: 'line',
    xAxis: {
      title: '時間',
      type: 'category',
      data: ['2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06']
    },
    yAxis: {
      title: '用戶數',
      type: 'value',
      min: 0,
      max: 20000
    },
    series: [
      {
        name: '新用戶',
        type: 'line',
        data: [1200, 1350, 1500, 1650, 1800, 1950],
        color: '#1890ff',
        smooth: true,
        areaStyle: {
          opacity: 0.3
        }
      },
      {
        name: '活躍用戶',
        type: 'line',
        data: [800, 920, 1100, 1250, 1400, 1550],
        color: '#52c41a',
        smooth: true,
        areaStyle: {
          opacity: 0.3
        }
      },
      {
        name: '總用戶',
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
    title: '營收分析',
    subtitle: '各產品線的營收表現',
    type: 'bar',
    xAxis: {
      title: '月份',
      type: 'category',
      data: ['2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06']
    },
    yAxis: {
      title: '營收 (萬元)',
      type: 'value',
      min: 0,
      max: 200
    },
    series: [
      {
        name: '產品 A',
        type: 'bar',
        data: [50, 55, 60, 65, 70, 75],
        color: '#1890ff',
        stack: 'total'
      },
      {
        name: '產品 B',
        type: 'bar',
        data: [30, 35, 40, 45, 50, 55],
        color: '#52c41a',
        stack: 'total'
      },
      {
        name: '產品 C',
        type: 'bar',
        data: [20, 25, 30, 35, 40, 45],
        color: '#faad14',
        stack: 'total'
      },
      {
        name: '服務收入',
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
    title: '活動統計',
    subtitle: '用戶活動和互動情況',
    type: 'area',
    xAxis: {
      title: '日期',
      type: 'category',
      data: ['2023-06-01', '2023-06-02', '2023-06-03', '2023-06-04', '2023-06-05']
    },
    yAxis: {
      title: '活動數',
      type: 'value',
      min: 0,
      max: 2000
    },
    series: [
      {
        name: '頁面瀏覽',
        type: 'line',
        data: [1200, 1350, 1500, 1650, 1800],
        color: '#1890ff',
        smooth: true,
        areaStyle: {
          opacity: 0.6
        }
      },
      {
        name: '點擊數',
        type: 'line',
        data: [300, 350, 400, 450, 500],
        color: '#52c41a',
        smooth: true,
        areaStyle: {
          opacity: 0.6
        }
      },
      {
        name: '轉換數',
        type: 'line',
        data: [45, 52, 60, 68, 75],
        color: '#faad14',
        smooth: true,
        areaStyle: {
          opacity: 0.6
        }
      },
      {
        name: '下載數',
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
    title: '轉換漏斗',
    subtitle: '用戶轉換流程分析',
    type: 'funnel',
    data: [
      { name: '訪問', value: 10000, color: '#1890ff' },
      { name: '註冊', value: 8000, color: '#52c41a' },
      { name: '試用', value: 6000, color: '#faad14' },
      { name: '付費', value: 4000, color: '#f5222d' },
      { name: '續費', value: 3000, color: '#13c2c2' }
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
    title: '地理分布',
    subtitle: '用戶地理分布情況',
    type: 'map',
    map: 'china',
    data: [
      { name: '北京', value: 1000, color: '#1890ff' },
      { name: '上海', value: 800, color: '#52c41a' },
      { name: '廣州', value: 600, color: '#faad14' },
      { name: '深圳', value: 500, color: '#f5222d' },
      { name: '杭州', value: 400, color: '#13c2c2' }
    ],
    visualMap: {
      min: 0,
      max: 1000,
      left: 'left',
      top: 'bottom',
      text: ['高', '低'],
      calculable: true
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}<br/>用戶數: {c}'
    }
  },

  // 設備分析圖表
  deviceBreakdown: {
    title: '設備分析',
    subtitle: '用戶設備分布情況',
    type: 'pie',
    data: [
      { name: '桌面', value: 45, color: '#1890ff' },
      { name: '手機', value: 35, color: '#52c41a' },
      { name: '平板', value: 15, color: '#faad14' },
      { name: '其他', value: 5, color: '#13c2c2' }
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
          title: '儲存為圖片',
          name: 'chart'
        },
        dataZoom: {
          title: '資料縮放'
        },
        restore: {
          title: '還原'
        }
      }
    }
  },

  // 圖表載入狀態
  loading: {
    text: '載入中...',
    color: '#1890ff',
    textColor: '#000',
    maskColor: 'rgba(255, 255, 255, 0.8)',
    zlevel: 0
  },

  // 圖表錯誤處理
  error: {
    text: '載入失敗',
    color: '#f5222d',
    textColor: '#000',
    maskColor: 'rgba(255, 255, 255, 0.8)',
    zlevel: 0
  }
}
