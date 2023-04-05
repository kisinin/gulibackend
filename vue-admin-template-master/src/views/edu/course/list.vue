<template>
  <div class="app-container">
    <!-- 表格 -->

    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <!-- 可以选择不定义 name属性 -->
        <!-- teacherQuery.name  使用了v-model 给表单传递值 使得传递的对象拥有条件-->

        <el-input v-model="courseQuery.title" placeholder="课程名称"/>
      </el-form-item>

      <el-form-item>
        <el-select v-model="courseQuery.status" clearable placeholder="课程状态">
          <el-option :value="'draft'" label="已发布"/>
          <el-option :value="'Normal'" label="未发布"/>
        </el-select>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getList()"
      >查询
      </el-button
      >
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <el-table :data="list" border fit highlight-current-row>
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="课程名称" width="80"/>

      <el-table-column label="课程状态" width="80">
        <template slot-scope="scope">
          {{ scope.row.status === 'Normal' ? '已发布' : '未发布' }}
        </template>
      </el-table-column>

      <el-table-column prop="lessonNum" label="课时数"/>

      <el-table-column prop="gmtCreate" label="添加时间" width="160"/>

      <el-table-column prop="viewCount" label="浏览数量" width="60"/>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/course/info/' + scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程信息</el-button>
          </router-link>
          <router-link :to="'/course/chapter/' + scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程大纲</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除课程信息
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />
  </div>
</template>


<script>
import course from '../../../api/edu/course'

export default {
  data() {
    return {
      list: null, //查询之后的对象
      page: 1, //当前页
      limit: 5, // 每页的记录数
      total: 0,
      courseQuery: {} //条件封装对象
    }
  },

  //在页面渲染之前执行，一般调用methods的方法

  created() {
    this.getList()
  },

  // 创建具体的方法，调用teacher.js定义的方法
  methods: {
    getList(page = 1) {
      this.page = page
      // 谁给我的page赋值了? 上面等于1 在哪一行赋的值?
      console.log(page)
      course.getCourseListPage(this.page, this.limit, this.courseQuery).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
      })
    },
    //    清空条件查询的内容
    resetData() {
      this.courseQuery = {}
      this.getList()
    },
    // 删除课程信息 同时删除包含章节小节描述信息
    removeDataById(courseId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        course.removeCourse(courseId).then((response) => {
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    }
  }

}
</script>
