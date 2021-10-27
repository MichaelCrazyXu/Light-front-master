import request from '@/utils/request'
import { httphost } from '@/utils/global'
export function getMenus() {
  return request({
    url: 'http://localhost:9999' + '/menus',
    method: 'get'
  })
}
export function addMenu(data) {
  return request({
    url: '',
    method: 'post',
    data,
    baseURL: 'http://localhost:9999' + '/menu/create'
  })
}
export function updateMenu(id, data) {
  return request({
    url: '',
    method: 'put',
    data,
    baseURL: 'http://localhost:9999' + '/menu/update'
  })
}
export function deleteMenu(id) {
  return request({
    url: `http://localhost:9999/menu/delete/${id}`,
    method: 'delete'
  })
}
