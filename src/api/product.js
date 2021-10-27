import request from '@/utils/request'
import { httphost } from '@/utils/global'

export function fetchProductList(data) {
  return request({
    //url: httphost + '/article/list',
    url: 'http://localhost:9999/' + 'getProducts',
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

export function createProduct(data) {
  return request({
    url: 'http://localhost:9999' + '/product/create',
    method: 'post',
    data
  })
}

export function updateProduct(data) {
  return request({
    url: 'http://localhost:9999' + '/product/update',
    method: 'put',
    data
  })
}

export function deleteProduct(id) {
  return request({
    // url: `${httphost}/product/delete/${id}`,
    url: `http://localhost:9999/product/delete/${id}`,
    method: 'delete'
  })
}
