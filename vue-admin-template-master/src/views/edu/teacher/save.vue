<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number
          v-model="teacher.sort"
          controls-position="right"
          :min="0"
        />
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
              数据类型一定要和取出的json中的一致，否则没法回填
              因此，这里value使用动态绑定的值，保证其数据类型是number
            -->
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career" />
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea" />
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image='String(teacher.avatar)' />
        <!-- 文件上传按钮 -->
        <el-button
          type="primary"
          icon="el-icon-upload"
          @click="imagecropperShow = true"
          >更换头像
        </el-button>

        <!--
v-show：是否显示上传组件
:key：类似于id，如果一个页面多个图片上传控件，可以做区分
:url：后台上传的url地址
@close：关闭上传组件
@crop-upload-success：上传成功后的回调 -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API + '/eduoss/fileoss'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacherApi from "@/api/edu/teacher";
import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";
export default {
  components: { ImageCropper, PanThumb },
  data() {
    return {
      teacher: {
        name: "",
        sort: 0,
        level: 1,
        career: "",
        intro: "",
        avatar:
          "https://.cdn.sohucs.com/images/20200504/47bc66e063f64d969dbe7e7ab915525c.gif",
      },
      saveBtnDisabled: false, // 保存按钮是否禁用,
      imagecropperShow: false, //弹窗是否显示
      imagecropperKey: 0,
      BASE_API: process.env.BASE_API, //获取dev.env.js里面地址
    };
  },

  //   切换到save页面  this.teacher = {} 不起效果
  //   因为 created() 创建页面默认执行一次
  created() {
    //判断路径是否有id值
    this.init();
  },

  watch: {
    //监听
    $route(to, from) {
      //路由变化的方式，路由发送变化，方法就会执行
      this.init();
    },
  },

  methods: {
    // 点击关闭事件
    close() {
      this.imagecropperShow = false;
      // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1;
    },

    // 上传成功的方法 data 上传的接口的返回值
    cropSuccess(data) {
      // 为了显示缩略图
      console.log(data.url);
      this.teacher.avatar = data.url;
      this.imagecropperShow = false;

      // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1;
    },
    init() {
      if (this.$route.params && this.$route.params.id) {
        //从路径中获取id值
        const id = this.$route.params.id;

        // 调佣根据id查询的方法 回显
        this.getInfo(id);
      } else {
        this.teacher = {};
      }
    },

    saveOrUpdate() {
      // 如何没有id就是保存，否则修改
      if (!this.teacher.id) {
        this.saveBtnDisabled = true;
        this.saveTeacher();
      } else {
        this.updateTeacher();
      }
    },

    // 根据id进行修改
    updateTeacher() {
      teacherApi.updateTeacher(this.teacher).then((respons) => {
        this.$message({
          type: "success",
          message: "修改成功!",
        });

        this.$router.push({ path: "/teacher/table" });
      });
    },

    // 根据讲师id查询的方法
    getInfo(id) {
      teacherApi.getTeacherById(id).then((respons) => {
        this.teacher = respons.data.teacher;
      });
    },

    // 保存
    saveTeacher() {
      teacherApi.addTeacher(this.teacher).then((respons) => {
        this.$message({
          type: "success",
          message: "新增成功!",
        });

        this.$router.push({ path: "/teacher/table" });
      });
    },
  },
};
</script>

