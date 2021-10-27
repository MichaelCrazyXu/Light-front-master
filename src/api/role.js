import request from '@/utils/request'
import { httphost } from '@/utils/global'

// export function getRoutes() {
//   return request({
//     url: httphost + '/routes',
//     method: 'get'
//   })
// }

export function getRoutes() {
  return request({
    url: 'http://localhost:9999' + '/menus',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: 'http://localhost:9999' + '/roles',
    // url: httphost + '/roles',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    // url: httphost + '/role',
    url: 'http://localhost:9999' + '/role/create',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    // url: `${httphost}/role/${id}`,
    url: `http://localhost:9999/role/update`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    // url: `${httphost}/role/${id}`,
    url: `http://localhost:9999/role/delete/${id}`,
    method: 'delete'
  })
}
