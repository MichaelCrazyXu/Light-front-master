import request from '@/utils/request'
import { httphost } from '@/utils/global'

export function fetchList(query) {
  return request({
    url: httphost + '/article/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: httphost + '/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: httphost + '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: httphost + '/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: httphost + '/article/update',
    method: 'post',
    data
  })
}
