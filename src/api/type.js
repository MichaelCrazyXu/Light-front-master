import request from '@/utils/request'
import { httphost } from '@/utils/global'

export function fetchTypeList(data) {
  return request({
    //url: httphost + '/article/list',
    url: 'http://localhost:9999/' + 'getTypes',
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

export function createType(data) {
  return request({
    url: 'http://localhost:9999' + '/type/create',
    method: 'post',
    data
  })
}

export function updateType(data) {
  return request({
    url: 'http://localhost:9999' + '/type/update',
    method: 'put',
    data
  })
}

export function deleteType(id) {
  return request({
    // url: `${httphost}/Type/delete/${id}`,
    url: `http://localhost:9999/type/delete/${id}`,
    method: 'delete'
  })
}
