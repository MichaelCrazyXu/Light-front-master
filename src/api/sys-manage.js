import request from '@/utils/request'
import { httphost } from '@/utils/global'

export function fetchSysUserList(data) {
  return request({
    //url: httphost + '/article/list',
    url: 'http://localhost:9999' + '/getSysUsers',
    method: 'post',
    data
  })
}

export function fetchPv(pv) {
  return request({
    url: httphost + '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createSysUser(data) {
  return request({
    url: 'http://localhost:9999' + '/sysuser/create',
    method: 'post',
    data
  })
}

export function updateSysUser(data) {
  return request({
    url: 'http://localhost:9999' + '/sysuser/update',
    method: 'put',
    data
  })
}

export function deleteSysUser(id) {
  return request({
    // url: `${httphost}/sysuser/delete/${id}`,
    url: `http://localhost:9999/sysuser/delete/${id}`,
    method: 'delete'
  })
}
