import request from '@/utils/request'
import { httphost } from '@/utils/global'

export function fetchDeviceList(data) {
  return request({
    //url: httphost + '/article/list',
    url: 'http://localhost:9999/' + 'getDevices',
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

export function createDevice(data) {
  return request({
    url: 'http://localhost:9999' + '/device/create',
    method: 'post',
    data
  })
}

export function updateDevice(data) {
  return request({
    url: 'http://localhost:9999' + '/device/update',
    method: 'put',
    data
  })
}

export function deleteDevice(id) {
  return request({
    // url: `${httphost}/Device/delete/${id}`,
    url: `http://localhost:9999/device/delete/${id}`,
    method: 'delete'
  })
}
