<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>

    <el-steps
      :active="1"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终审核"/>
    </el-steps>

    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placehoder="请输入课程标题"/>
      </el-form-item>

      <!-- 所属分类 TODO -->
      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程分类">
        <el-select v-model="courseInfo.subjectParentId" placeholder="一级分类" @change="subjectLevelOneChanged">
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>
      <!-- 课程讲师 TODO -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :label="teacher.name"
            :value="teacher.id"
            :key="teacher.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>

      <!-- 课程简介 TODO -->
      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>

      <!-- 课程封面 TODO -->
      <el-form-item label="课程封面">
        <!--        文件列表展示  :show-file-list="false" -->
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/eduoss/fileoss'"
          class="avatar-uploader">
          <img :src="courseInfo.cover" style="width: 200px; height: 180px">
        </el-upload>

      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />
        元
      </el-form-item>

      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate"
        >保存并下一步
        </el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import course from '@/api/edu/course'
import subject from '@/api/edu/subject'
import Tinymce from '@/components/Tinymce'

export default {

  // 声明组件
  components: { Tinymce },
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseInfo: {
        title: '',
        subjectId: '',
        teacherId: '',
        lessonNum: 0,
        description: '',
        cover: '/static/面向对象.png',
        price: 0
      },
      teacherList: [],
      subjectOneList: [],
      subjectTwoList: [],
      BASE_API: process.env.BASE_API,
      courseId: ''
    }
  },
  created() {
    // 获取路由id的值
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      this.getInfo()
      // 根据课程id查询课程基本信息
    } else {
      this.getListTeacher()
      // 初始化所有一级分类
      this.getOneSubject()
    }

  },
  watch: {
    //监听
    $route(to, from) {
      // 路由变化的方式，路由发生变化，方法自动执行
      this.init()
    }
  },
  methods: {
    getInfo() {
      course.getCourseInfo(this.courseId).then(response => {
        // 1.获取所有的课程信息
        this.courseInfo = response.data.courseInfoVo
        // 为了让二级分类回显成功

        subject.getSubjectList().then(response => {
          //2. 查询所有的分类，包含一级和二级
          this.subjectOneList = response.data.list
          //3.把所有的一级分类进行遍历
          for (let i = 0; i < this.subjectOneList.length; i++) {
            //获取每个一级分类
            let oneSubject = this.subjectOneList[i]
            //比较当前courseinfo里面的一级分类id和所有的一级分类id
            // 因为我给this.courseInfo 赋值了CourseInfoVo 后端的Vo里面包含了subjectParentId 即使没有定义也会存在
            if (this.courseInfo.subjectParentId == oneSubject.id) {
              //获取一级分类所有的二级分类
              this.subjectTwoList = oneSubject.children
            }
          }
          // 初始化所有讲师

        })
      })
      this.getListTeacher()
    },

    handleAvatarSuccess(res, file) {
      console.log(res)// 上传响应
      console.log(URL.createObjectURL(file.raw))// base64编码
      this.courseInfo.cover = res.data.url
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    subjectLevelOneChanged(value) {
      for (let i = 0; i < this.subjectOneList.length; i++) {
        // 忘记用this取值 报错半小时
        if (this.subjectOneList[i].id === value) {
          this.subjectTwoList = this.subjectOneList[i].children
          this.courseInfo.subjectId = ''
        }
      }
      // 此value就是一级分类的id值
      //  for(item of this.subjectNestedList){
      //   if(value == item.id){
      //     this.subjectTwoList = item.children
      //   }
      //  }
      //  for(let i=0 ;i<this.subjectOneList.length;i++){
      //   // 忘记用this取值 报错半小时
      //   let oneSubject = this.subjectOneList[i]
      //   if(oneSubject.id === value){
      //     this.subjectTwoList = oneSubject.children
      //   }
      //  }

    },

    // 查询所有的一级分类
    getOneSubject() {
      subject.getSubjectList().then(response => {
        this.subjectOneList = response.data.list
      })
    },
    getListTeacher() {
      course.getAllTeacher().then(response => {
        this.teacherList = response.data.items
      })
    },
    //添加课程
    addCourse() {
      course.getSubjectList(this.courseInfo).then((response) => {
        this.$message({
          type: 'success',
          message: '添加课程信息成功!'
        })
        // 跳转到章节的内容
        this.$router.push({
          path: '/course/chapter/' + response.data.courseId
        })
      })
    },
    // 修改课程
    updateCourse() {
      course.updateCourseInfo(this.courseInfo).then(response => {
        this.$message({
          type: 'success',
          message: '修改课程信息成功!'
        })
        // 跳转到章节的内容
        this.$router.push({
          path: '/course/chapter/' + this.courseId
        })
      })

    },
    saveOrUpdate() {

      /**
       * 这里可能做添加,也可能做修改 那么判断的条件是什么  注意id
       * 方式1 判断是修改还是删除 通过路由的id来确定
       *     if (this.$route.params && this.$route.params.id) {
       *         this.updateCourse()
       *       } else {
       *         this.addCourse()
       *       }
       */

      /**
       * 方式2 判断是修改还是删除 通过后端返回的课程ID的参数来确定
       */
      if (!this.courseInfo.id) {
        this.addCourse()
      } else {
        this.updateCourse()
      }

    },
    init() {
      if (this.$route.params && this.$route.params.id) {
      } else {
        this.courseInfo = {}
        // ---清空富文本编辑器内容
        tinyMCE.activeEditor.setContent('')
      }
    }

  }
}
</script>
