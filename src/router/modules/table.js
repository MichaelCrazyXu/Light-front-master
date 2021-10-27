/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/product',
  component: Layout,
  redirect: '/product/complex-table',
  name: 'product',
  meta: {
    title: '产品管理',
    icon: 'table'
  },
  children: [
    {
      path: 'product-list',
      component: () => import('@/views/product/product-list'),
      name: 'ComplexTable',
      meta: { title: '产品列表' }
    },
    {
      path: 'drag-table',
      component: () => import('@/views/product/type-list'),
      name: 'DragTable',
      meta: { title: '型号管理' }
    },
    {
      path: 'inline-edit-table',
      component: () => import('@/views/product/inline-edit-table'),
      name: 'InlineEditTable',
      meta: { title: '备用1' }
    },
    {
      path: 'dynamic-table',
      component: () => import('@/views/product/device-list'),
      name: 'DynamicTable',
      meta: { title: '设备管理' }
    }
  ]
}
export default tableRouter
