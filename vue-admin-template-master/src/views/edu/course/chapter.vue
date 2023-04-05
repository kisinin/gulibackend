<template>
  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>
    <el-button type="text" @click="openChapterDialog">添加章节</el-button>


    <!-- 章节 -->
    <ul class="chanpterList">
      <li
        v-for="chapter in chapterVideoList"
        :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
             <el-button type="text" @click="openVideo(chapter.id)">添加小节</el-button>
              <el-button type="text" @click="openEditChapter(chapter.id)">编辑</el-button>
              <el-button type="text" @click="deleteChapter(chapter.id)">删除</el-button>
          </span>
        </p>
        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li
            v-for="video in chapter.children"
            :key="video.id">
            <p>{{ video.title }}
              <span class="acts">
              <el-button type="text" @click="openEditVideo(video.id)">编辑</el-button>
              <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
          </span>
            </p>

          </li>
        </ul>
      </li>
    </ul>

    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>


    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/eduvod/video/uploadAlyVideo'"
            :limit="1"
            class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateVideo">确 定</el-button>
        <!--        :disabled="saveVideoBtnDisabled"-->
      </div>
    </el-dialog>

  </div>
</template>

<script>
import chapter from '../../../api/edu/chapter'
import course from '../../../api/edu/course'
import video from '../../../api/edu/video'

export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      chapterVideoList: [],
      courseId: '',//课程id
      chapter: {
        title: '',
        sort: 0
      }, //章节的数据
      dialogChapterFormVisible: false, // 表示章节弹框的值
      dialogVideoFormVisible: false,  //表示小节弹框的值
      video: {
        title: '',
        sort: 0,
        free: 0,
        videoSourceId: '',
        videoOriginalName: ''//视频名称
      },
      fileList: [],//上传文件列表
      BASE_API: process.env.BASE_API // 接口API地址
    }
  },

  created() {
    //获取路由的id
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
    }
    // 根据课程id查询章节和小节
    this.getChapterVideo()
  },

  methods: {
    // 点击确认调用的方法
    handleVodRemove() {
      // 调用接口删除视频的方法
      video.removeAlyVideoById(this.video.videoSourceId).then(response => {
        this.$message({
          type: 'success',
          message: '删除视频成功!'
        })
        // 把文件列表清空
        this.fileList = []
        //删除之后把视频id清空 把视频名称清空
        this.video.videoSourceId = ''
        this.video.videoOriginalName = ''

      })
    },
    beforeVodRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 上传视频成功调用的方法 回调方法不执行
    //问题 要后台上传成功 才会回调这个方法 网速差的情况下回有bug
    handleVodUploadSuccess(response, file, fileList) {
      alert('================')
      console.log('==' + response.data.videoId)
      // 获取视屏上传的id
      this.video.videoSourceId = response.data.videoId
      //上传视频的名称
      this.video.videoOriginalName = file.name
    },
    handleUploadExceed() {
      this.$message.warning('想要重写上传视频，请先删除已上传的视频')
    },
    /**=========================小节操作========================*/
    // 打开编辑框 回显小节信息
    openEditVideo(id) {
      this.dialogVideoFormVisible = true
      video.getVideoById(id).then(response => {
        this.video = response.data.videoInfo
      })
    },

    // 修改小节
    editVideo() {
      video.updateVideo(this.video).then(response => {
        //关闭弹框
        this.dialogVideoFormVisible = false
        //提示信息
        this.$message({
          type: 'success',
          message: '修改小节成功!'
        })
        //刷新请求
        this.getChapterVideo()
      })
    },
    //删除小节
    removeVideo(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        video.deleteVideo(id).then(response => {
          this.$message({
            type: 'success',
            message: '删除小节成功!'
          })
          //3 刷新页面请求所有的信息
          this.getChapterVideo()
        })
      })

    },
    addVideo() {
      //设置小节的课程id
      this.video.courseId = this.courseId
      video.addVideo(this.video).then(response => {
        this.dialogVideoFormVisible = false
        this.$message({
          type: 'success',
          message: '添加小节成功!'
        })
        this.getChapterVideo()
      })

    },

    //添加或修改小节
    saveOrUpdateVideo() {
      if (this.video.id != null) {
        this.editVideo()
      } else {
        this.addVideo()
      }

    },
    //添加小节
    openVideo(chapterId) {
      //设置小节的章节id
      this.video.chapterId = chapterId
      // this.chapter.id = chapterId
      this.dialogVideoFormVisible = true
      //  表单数据清空 清空上一次添加遗留的信息
      this.video.title = ''
      this.video.sort = 0
      this.video.free = 0
      this.video.videoSourceId = ''
    },

    /**=========================章节操作========================*/
    // 删除章节信息
    deleteChapter(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        chapter.deleteChapter(id).then(response => {
          this.$message({
            type: 'success',
            message: '删除章节成功!'
          })
          //3 刷新页面请求所有的信息
          this.getChapterVideo()
        })
      })
    },
    openEditChapter(id) {
      this.dialogChapterFormVisible = true
      chapter.getChapter(id).then(response => {
        // 修改的回显 就是在这里给chapter对象赋值了id
        this.chapter = response.data.chapterInfo
      })
    },
    // 弹出添加页面内容
    openChapterDialog() {
      // 显示弹框
      this.dialogChapterFormVisible = true
      //  表单数据清空 清空上一次添加遗留的信息
      this.chapter.title = ''
      this.chapter.sort = 0
    },
    //添加章节
    addChapter() {
      // 因为数据库字段不能为null,给章节添加id值 另一个错误是章节的id没有设置自动生成input
      this.chapter.courseId = this.courseId
      chapter.addChapter(this.chapter).then(response => {
        //1 关闭弹框
        this.dialogChapterFormVisible = false
        //2 提示信息
        this.$message({
          type: 'success',
          message: '添加章节成功!'
        })
        //3 刷新页面请求所有的信息
        this.getChapterVideo()
      })
      // // 添加之后清空章节信息 防止点击出现之前的信息
      // this.chapter = {}
    },
    // 修改章节
    updateChapter() {
      chapter.updateChapter(this.chapter).then(response => {
        //1 关闭弹框
        this.dialogChapterFormVisible = false
        //2 提示信息
        this.$message({
          type: 'success',
          message: '修改章节成功!'
        })
        //3 刷新页面请求所有的信息
        this.getChapterVideo()
      })

    },
    saveOrUpdate() {
      //查询出章节id是否存在
      if (this.chapter.id != null) {
        this.updateChapter()
      } else {
        this.addChapter()
      }

    },

    // 根据课程id查询章节和小节
    getChapterVideo() {
      chapter.getChapterVideoById(this.courseId).then(res => {
        this.chapterVideoList = res.data.allChapterVideo
      })
    },
    previous() {
      this.$router.push({ path: '/course/info/' + this.courseId })
    },
    next() {
      this.$router.push({ path: '/course/publish/' + this.courseId })
    }
  }
}
</script>
<style scoped>
.chanpterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}

.chanpterList li {
  position: relative;
}

.chanpterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}

.chanpterList .acts {
  float: right;
  font-size: 14px;
}

.videoList {
  padding-left: 50px;
}

.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
</style>
