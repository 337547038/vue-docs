/**
 * Created by 337547038 on 2018/8/16 0016.
 */
import test from '../docs/test.md'

const router = [
  {
    path: '/test',
    name: 'test',
    component: test
  },
  {
    path: '/button',
    name: 'button',
    component: r => require.ensure([], () => r(require('../docs/button.md')))
  },
  {
    path: '/table',
    name: 'table',
    component: r => require.ensure([], () => r(require('../docs/table.md')))
  }
]
export default router
