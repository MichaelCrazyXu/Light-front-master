<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">创建角色</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="角色类型" width="220">
        <template slot-scope="scope">
          {{ scope.row.role_id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.role_name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="描述">
        <template slot-scope="scope">
          {{ scope.row.role_description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色':'创建角色'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="类型">
          <el-input v-model="role.role_id" placeholder="角色类型" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="role.role_name" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="role.role_description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="角色描述"
          />
        </el-form-item>
        <el-form-item label="菜单">
          <el-tree
            ref="routerTree"
            :check-strictly="false"
            :data="routesData"
            :props="defaultProps"
            :default-checked-keys="currentNodes"
            default-expand-all
            show-checkbox
            node-key="menu_id"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { getRoutes, getRoles, addRole, deleteRole, updateRole } from '@/api/role'

const defaultRole = {
  role_id: '',
  role_name: '',
  role_description: '',
  routes: []
}

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      currentNodes: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    this.getRoutes()
    this.getRoles()
  },
  methods: {
    async getRoutes() {
      const res = await getRoutes()
      this.serviceRoutes = res.data
     // this.routes = this.generateRoutes(res.data)
     this.routes = this.filterData(res.data)
     console.log(this.routes)
           debugger;
    },
    async getRoles() {
      const res = await getRoles()
      this.rolesList = res.data
            debugger;
    },

    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []
debugger;
      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title

        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.routerTree) {
        this.$refs.routerTree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
      debugger
      //赋值Node节点
      this.currentNodes = [];
      if (this.$refs.routerTree) {
        this.$refs.routerTree.setCheckedNodes([])
      }
      if (this.role.menuRoleRelations) {
        this.role.menuRoleRelations.forEach(item => {
          this.currentNodes.push(item.menu_id)
        })
      }
      
      console.log(this.currentNodes)
      this.$nextTick(() => {
        // const routes = this.generateRoutes(this.role.routes)
        // this.$refs.routerTree.setCheckedNodes(this.generateArr(routes))
        //const routes = this.filterData(this.role.routes)

        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('确定删除角色?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteRole(row.role_id)
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => { console.error(err) })
    },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'

      const checkedKeys = this.$refs.routerTree.getCheckedKeys();
      this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)

      let checkedKeysStr = checkedKeys.concat().map((obj)=>{return obj}).join(",");

      this.role.checkedKeys = checkedKeysStr;
      
      if (isEdit) {
        await updateRole(this.role)
        for (let index = 0; index < this.rolesList.length; index++) {
          if (this.rolesList[index].role_id === this.role.role_id) {
            this.rolesList.splice(index, 1, Object.assign({}, this.role))
            break
          }
        }
      } else {
        const { data } = await addRole(this.role)
        this.role.role_id = data.role_id
        this.rolesList.push(this.role)
      }

      const { role_description, role_id, role_name } = this.role
      this.dialogVisible = false
      this.getRoutes()
      this.getRoles()
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Role Id: ${role_id}</div>
            <div>Role Name: ${role_name}</div>
            <div>Description: ${role_description}</div>
          `,
        type: 'success'
      })
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    },

    
    /**
     * 过滤数据成树形数据
     * @param list
     * @param pid
     * @returns {[]}
     */
    filterData(list, pid = 0) {
      let itemList = list.filter(item => item.pid === pid);
      let dataList = [];
      itemList.forEach(item => {
          item.children = this.filterData(list, item.menu_id);
          if (item.children.length === 0) {
              delete item.children;
          }

          dataList.push(item);
      })
      return dataList;
    }

  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
