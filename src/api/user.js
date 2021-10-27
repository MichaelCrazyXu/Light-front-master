import request from '@/utils/request'
import { httphost } from '@/utils/global'

export function login(data) {
  return request({
    url: httphost + '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: httphost + '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: httphost + '/user/logout',
    method: 'post'
  })
}
