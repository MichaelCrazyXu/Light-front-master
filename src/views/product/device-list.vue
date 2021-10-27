<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="设备名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.communication_type" placeholder="通信类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in communicationOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-input v-model="listQuery.deviceId" placeholder="设备ID" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
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
      <el-table-column label="序号" prop="id" sortable="custom" align="center" width="70" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备名称" min-width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.device_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="通信类型" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.communication_type | communicationFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备ID" width="150" align="center">
        <template slot-scope="{row}">
          <el-tag>{{ row.device_id }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="版本号" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.version }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间日期" width="130" align="center">
        <template slot-scope="{row}">
          <span>{{ row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="设备状态" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | statusOptFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-radio-group v-model="cloud" size="small">
        <el-radio-button :label="1">阿里云</el-radio-button>
        <el-radio-button :label="2">腾讯云</el-radio-button>
        <el-radio-button :label="3">华为云</el-radio-button>
      </el-radio-group>
      <div style="margin: 20px;"></div>
      
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120" style="width: 400px; margin-left:50px;">
        <el-form-item label="设备名称" prop="uid">
          <el-input v-model="temp.device_name" />
        </el-form-item>
        <el-form-item label="通信类型" prop="role">
          <el-select v-model="temp.communication_type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in communicationOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备ID" prop="name">
          <el-input v-model="temp.device_id" />
        </el-form-item>
        <el-form-item label="版本号" prop="tel">
          <el-input v-model="temp.version" />
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
import { fetchDeviceList, fetchPv, createDevice, updateDevice, deleteDevice  } from '@/api/device'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const communicationOptions = [
  { key: 'iot', display_name: 'IOT通信' },
  { key: 'wifi', display_name: 'WIFI通信' }
]

const statusOptions = [
  { key: 'online', display_name: '在线' },
  { key: 'offline', display_name: '离线' },
  { key: 'inactive', display_name: '未激活' }
]

// arr to obj, such as { admin : "超级管理员", editor : "管理员" }
const communicationKeyValue = communicationOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const statusKeyValue = statusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.status
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        'online': 'success',
        'offline': 'info',
        'inactive': 'danger'
      }
      return statusMap[status]
    },
    communicationFilter(communication_type) {
      return communicationKeyValue[communication_type]
    },
    statusOptFilter(status) {
      return statusKeyValue[status]
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
        device_name: undefined,
        communication_type: undefined,
        device_id: undefined,
        sort: 'asc'
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID 升序', key: 'asc' }, { label: 'ID 降序', key: 'desc' }],
      statusOptions: ['online', 'offline', 'inactive'],
      communicationOptions,
      showReviewer: false,
      temp: {
        id: 0,
        device_name: '',
        communication_type: '',
        device_id: '',
        version: '',
        device_type: ''
      },
      cloud: 1,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑设备',
        create: '添加设备'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        device_name: [{ required: true, message: 'device name is required', trigger: 'change' }],
        //communication_type: [{ required: true, message: 'communication type is required', trigger: 'blur' }],
        device_id: [{ required: true, message: 'device id is required', trigger: 'blur' }]
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
      fetchDeviceList(this.listQuery).then(response => {

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
        id: undefined,
        device_name: '',
        communication_type: '',
        device_id: '',
        version: '',
        device_type: ''
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

          createDevice(this.temp).then(response => {
            this.temp.id = response.data.id;
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
      this.temp.timestamp = new Date(this.temp.timestamp)
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
          updateDevice(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
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
      this.$confirm('确定删除这个设备吗?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          console.log('id==' + row.id)
          await deleteDevice(row.id)
          this.list.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => { console.error(err) })
      // this.$notify({
      //   title: 'Success',
      //   message: 'Delete Successfully',
      //   type: 'success',
      //   duration: 2000
      // })
      // this.list.splice(index, 1)
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
    }
  }
}
</script>
