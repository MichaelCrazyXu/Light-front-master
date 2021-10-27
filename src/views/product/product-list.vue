<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="产品名称" min-width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="ProductKey" min-width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.productKey }}</span>
        </template>
      </el-table-column>
      <el-table-column label="节点类型" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.nodeType | nodeTypeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品描述" width="200" align="center">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备数量" width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.deviceCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间日期" width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.gmtCreate | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100" style="width: 400px; margin-left:50px;">
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="temp.product_name" />
        </el-form-item>
        <el-form-item label="节点类型" prop="nodeType">
          <el-select v-model="temp.nodeType" class="filter-item" placeholder="Please select">
            <el-option v-for="item in nodeTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品类型" prop="aliyunCommodityCode">
          <el-select v-model="temp.aliyunCommodityCode" class="filter-item" placeholder="Please select">
            <el-option v-for="item in aliyunCommodityCodeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品数据格式" prop="dataFormat">
          <el-select v-model="temp.dataFormat" class="filter-item" placeholder="Please select">
            <el-option v-for="item in dataFormatOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型" prop="categoryId">
          <el-input v-model="temp.categoryId" />
        </el-form-item>
        <el-form-item label="protocolType" prop="protocolType">
          <el-input v-model="temp.protocolType" />
        </el-form-item>
        <el-form-item label="netType" prop="netType">
          <el-select v-model="temp.netType" class="filter-item" placeholder="Please select">
            <el-option v-for="item in netTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="authType" prop="authType">
          <el-select v-model="temp.authType" class="filter-item" placeholder="Please select">
            <el-option v-for="item in authTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品描述" prop="description">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="temp.description" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchProductList, fetchPv, createProduct, updateProduct, deleteProduct  } from '@/api/product'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

//产品的节点类型
const nodeTypeOptions = [
  { key: 0, display_name: '设备' },
  { key: 1, display_name: '网关' }
]

//产品类型数据格式
const dataFormatOptions = [
  { key: 0, display_name: '透传' },
  { key: 1, display_name: 'Alink协议' }
]

//连网方式
const netTypeOptions = [
  { key: 'WIFI', display_name: 'WiFi' },
  { key: 'CELLULAR', display_name: '蜂窝网' },
  { key: 'ETHERNET', display_name: '以太网' },
  { key: 'LORA', display_name: 'LoRaWAN' },
  { key: 'OTHER', display_name: '其他' }
]

//产品类型
const aliyunCommodityCodeOptions = [
  { key: 'iothub_senior', display_name: '使用物模型' },
  { key: 'iothub', display_name: '不使用物模型' }
]

//产品下的设备接入物联网平台的认证方式
const authTypeOptions = [
  { key: 'secret', display_name: '使用设备密钥进行设备身份认证' },
  { key: 'id2', display_name: '使用物联网设备身份认证ID²' },
  { key: 'x509', display_name: '使用设备X.509证书进行设备身份认证' }
]

const nodeTypeKeyValue = nodeTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const dataFormatKeyValue = dataFormatOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const netTypeKeyValue = netTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const aliyunCommodityKeyValue = aliyunCommodityCodeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const authTypeKeyValue = authTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})


export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    roleFilter(role) {
      return roleKeyValue[role]
    },
    nodeTypeFilter(nodeType) {
      return nodeTypeKeyValue[nodeType]
    },
    formatDate: function (value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? ('0' + MM) : MM;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      let h = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      let m = date.getMinutes();
      m = m < 10 ? ('0' + m) : m;
      let s = date.getSeconds();
      s = s < 10 ? ('0' + s) : s;
      return y + '/' + MM + '/' + d + ' ' + h + ':' + m + ':' + s;
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        sort: 'asc'
      },
      temp: {
        productKey: '',
        productName: '',
        nodeType: 0,
        aliyunCommodityCode: '',
        dataFormat: '',
        categoryId: '',
        description: '',
        protocolType: '',
        authType: '',
        netType: 'WIFI',
        gmtCreate: 0,
        deviceCount: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑产品',
        create: '添加新产品'
      },
      nodeTypeOptions,
      dataFormatOptions,
      netTypeOptions,
      aliyunCommodityCodeOptions,
      authTypeOptions,
      dialogPvVisible: false,
      pvData: [],
      rules: {
        productName: [{ required: true, message: '产品名称是必须', trigger: 'blur' }],
        nodeType: [{ required: true, message: '产品的节点类型是必须', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  mounted() {

  },
  methods: {
    getList() {
      this.listLoading = true
      fetchProductList(this.listQuery).then(response => {
       this.list = response.data
        this.total = response.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })

    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = 'asc'
      } else {
        this.listQuery.sort = 'desc'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        productKey: '',
        productName: '',
        nodeType: 0,
        aliyunCommodityCode: '',
        dataFormat: 0,
        categoryId: '',
        description: '',
        protocolType: '',
        authType: '',
        netType: 'WIFI',
        gmtCreate: 0,
        deviceCount: 0
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {

          createProduct(this.temp).then(response => {
            console.log(response);
            this.temp.productKey = response.data.productKey
            this.temp.gmtCreate = this.dateFormatter();
            this.temp.deviceCount = 0
            this.temp.aliyunCommodityCode = response.data.aliyunCommodityCode
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })

          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          //tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateProduct(tempData).then(() => {
            const index = this.list.findIndex(v => v.productKey === this.temp.productKey)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$confirm('确定删除这个产品吗?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          console.log('productKey==' + row.productKey)
          await deleteProduct(row.productKey)
          this.list.splice(index, 1)
          this.total = this.total - 1
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => { console.error(err) })
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    /**
      * 时间格式yyyy-MM-dd HH:mm:ss
    */
    dateFormatter () {
        const date = new Date();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const strDate = date.getDate().toString().padStart(2, '0');
        return `${date.getFullYear()}/${month}/${strDate} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }
  }
}
</script>
