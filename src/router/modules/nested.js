/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const endUserRouter = {
  path: '/end-user',
  component: Layout,
  redirect: '/end-user/menu4/menu4-1',
  name: 'Nested',
  meta: {
    title: '终端用户管理',
    icon: 'nested'
  },
  children: [
    {
      path: 'menu2',
      name: 'Menu2',
      component: () => import('@/views/end-user/menu2/index'),
      meta: { title: '用户注册信息列表' }
    },
    {
      path: 'menu3',
      name: 'Menu3',
      component: () => import('@/views/end-user/menu3/index'),
      meta: { title: '用户分类' }
    },
    {
      path: 'menu4',
      component: () => import('@/views/end-user/menu4/index'), // Parent router-view
      name: 'Menu4',
      meta: { title: '备用' },
      redirect: '/end-user/menu4/menu4-1',
      children: [
        {
          path: 'menu4-1',
          component: () => import('@/views/end-user/menu4/menu4-1'),
          name: 'Menu4-1',
          meta: { title: '备用1' }
        },
        {
          path: 'menu4-2',
          component: () => import('@/views/end-user/menu4/menu4-2'),
          name: 'Menu4-2',
          redirect: '/end-user/menu4/menu4-2/menu4-2-1',
          meta: { title: '备用2' },
          children: [
            {
              path: 'menu4-2-1',
              component: () => import('@/views/end-user/menu4/menu4-2/menu4-2-1'),
              name: 'Menu4-2-1',
              meta: { title: 'Menu 4-2-1' }
            },
            {
              path: 'menu1-2-2',
              component: () => import('@/views/end-user/menu4/menu4-2/menu4-2-2'),
              name: 'Menu4-2-2',
              meta: { title: 'Menu 4-2-2' }
            }
          ]
        },
        {
          path: 'menu4-3',
          component: () => import('@/views/end-user/menu4/menu4-3'),
          name: 'Menu4-3',
          meta: { title: '备用3' }
        },
      ]
    }
  ]
}

export default endUserRouter
