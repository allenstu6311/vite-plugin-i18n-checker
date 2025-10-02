export default {
  // 表格標題和描述
  titles: {
    dataTable: 'Data Table',
    userList: 'User List',
    productList: 'Product List',
    orderList: 'Order List',
    reportTable: 'Report Table'
  },

  // 表格狀態
  states: {
    loading: 'Loading...',
    empty: 'No data available',
    error: 'Failed to load',
    noResults: 'No matching data found',
    retry: 'Retry',
    refresh: 'Refresh'
  },

  // 分頁控制
  pagination: {
    total: 'Total {total} records',
    page: 'Page {page} of {totalPages}',
    itemsPerPage: 'Items per page',
    goToPage: 'Go to page',
    first: 'First',
    last: 'Last',
    previous: 'Previous',
    next: 'Next',
    jump: 'Jump',
    showing: 'Showing {start} to {end} of {total} records'
  },

  // 排序控制
  sorting: {
    sortBy: 'Sort by',
    ascending: 'Ascending',
    descending: 'Descending',
    unsorted: 'Unsorted',
    multiSort: 'Multi-column sort',
    clearSort: 'Clear sort'
  },

  // 篩選控制
  filters: {
    title: 'Filters',
    search: 'Search',
    clear: 'Clear filters',
    apply: 'Apply filters',
    reset: 'Reset filters',
    advanced: 'Advanced filters',
    quickFilters: 'Quick filters',
    dateRange: 'Date range',
    status: 'Status',
    category: 'Category',
    tags: 'Tags',
    custom: 'Custom filter'
  },

  // 欄位配置
  columns: {
    id: 'ID',
    name: 'Name',
    title: 'Title',
    description: 'Description',
    email: 'Email',
    phone: 'Phone',
    status: 'Status',
    role: 'Role',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
    lastLogin: 'Last Login',
    actions: 'Actions',
    select: 'Select',
    index: 'Index'
  },

  // 操作按鈕
  actions: {
    view: 'View',
    edit: 'Edit',
    delete: 'Delete',
    duplicate: 'Duplicate',
    export: 'Export',
    import: 'Import',
    download: 'Download',
    upload: 'Upload',
    share: 'Share',
    archive: 'Archive',
    restore: 'Restore',
    approve: 'Approve',
    reject: 'Reject',
    activate: 'Activate',
    deactivate: 'Deactivate',
    suspend: 'Suspend',
    unsuspend: 'Unsuspend'
  },

  // 批量操作
  bulkActions: {
    title: 'Bulk Actions',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    selected: '{count} items selected',
    selectPage: 'Select Page',
    selectAllPages: 'Select All Pages',
    clearSelection: 'Clear Selection',
    actions: [
      {
        id: 'bulkDelete',
        label: 'Bulk Delete',
        icon: 'trash',
        confirm: 'Are you sure you want to delete {count} selected items?'
      },
      {
        id: 'bulkExport',
        label: 'Bulk Export',
        icon: 'download',
        confirm: 'Are you sure you want to export {count} selected items?'
      },
      {
        id: 'bulkUpdate',
        label: 'Bulk Update',
        icon: 'edit',
        confirm: 'Are you sure you want to update {count} selected items?'
      },
      {
        id: 'bulkArchive',
        label: 'Bulk Archive',
        icon: 'archive',
        confirm: 'Are you sure you want to archive {count} selected items?'
      }
    ]
  },

  // 表格設定
  settings: {
    title: 'Table Settings',
    columns: {
      title: 'Display Columns',
      show: 'Show',
      hide: 'Hide',
      reset: 'Reset to Default',
      customize: 'Customize Columns'
    },
    density: {
      title: 'Density',
      compact: 'Compact',
      normal: 'Normal',
      comfortable: 'Comfortable'
    },
    height: {
      title: 'Height',
      auto: 'Auto',
      fixed: 'Fixed',
      maxHeight: 'Max Height'
    },
    sticky: {
      title: 'Sticky Settings',
      header: 'Sticky Header',
      columns: 'Sticky Columns',
      left: 'Left Sticky',
      right: 'Right Sticky'
    }
  },

  // 資料類型顯示
  dataTypes: {
    text: {
      ellipsis: '...',
      expand: 'Expand',
      collapse: 'Collapse',
      copy: 'Copy',
      search: 'Search content'
    },
    number: {
      format: {
        currency: 'Currency format',
        percentage: 'Percentage format',
        decimal: 'Decimal format',
        integer: 'Integer format'
      }
    },
    date: {
      format: {
        full: 'Full date time',
        date: 'Date',
        time: 'Time',
        relative: 'Relative time'
      },
      relative: {
        now: 'Now',
        minutesAgo: '{count} minutes ago',
        hoursAgo: '{count} hours ago',
        daysAgo: '{count} days ago',
        weeksAgo: '{count} weeks ago',
        monthsAgo: '{count} months ago',
        yearsAgo: '{count} years ago'
      }
    },
    status: {
      active: 'Active',
      inactive: 'Inactive',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      suspended: 'Suspended',
      archived: 'Archived'
    },
    boolean: {
      true: 'Yes',
      false: 'No',
      yes: 'Yes',
      no: 'No',
      enabled: 'Enabled',
      disabled: 'Disabled'
    }
  },

  // 表格工具列
  toolbar: {
    search: {
      placeholder: 'Search table content...',
      clear: 'Clear search',
      advanced: 'Advanced search'
    },
    filters: {
      active: '{count} filters active',
      clear: 'Clear all filters',
      apply: 'Apply filters'
    },
    view: {
      list: 'List View',
      grid: 'Grid View',
      card: 'Card View',
      table: 'Table View'
    },
    density: {
      compact: 'Compact',
      normal: 'Normal',
      comfortable: 'Comfortable'
    },
    refresh: 'Refresh',
    exportData: 'Export',
    settings: 'Settings'
  },

  // 表格選單
  contextMenu: {
    copyText: 'Copy',
    copyValue: 'Copy Value',
    copyRow: 'Copy Row',
    copyColumn: 'Copy Column',
    editItem: 'Edit',
    deleteItem: 'Delete',
    duplicateItem: 'Duplicate Item',
    viewItem: 'View',
    shareItem: 'Share',
    exportItem: 'Export',
    print: 'Print'
  },

  // 表格載入狀態
  loading: {
    skeleton: 'Loading...',
    spinner: 'Loading...',
    progress: 'Loading progress: {percent}%',
    message: 'Loading data, please wait...'
  },

  // 表格錯誤處理
  errors: {
    network: 'Network connection error',
    server: 'Server error',
    permission: 'Insufficient permissions',
    notFound: 'Data not found',
    timeout: 'Request timeout',
    unknown: 'Unknown error',
    retry: 'Retry',
    contact: 'Contact technical support'
  }
}
