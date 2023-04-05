import request from '@/utils/request'

export default {

  //添加课程基本信息
  getSubjectList(courseInfo) {
    return request({
      url: 'eduservice/course/addCourseInfo',
      method: 'post',
      data: courseInfo
    })
  },

  //查询所有的教师
  getAllTeacher() {
    return request({
      url: 'eduservice/teacher/findAll',
      method: 'get'
    })
  },

  //根据课程id查询课程基本信息
  getCourseInfo(courseId) {
    return request({
      url: 'eduservice/course/getCourseInfo/' + courseId,
      method: 'get'
    })
  },

  //修改课程信息
  updateCourseInfo(courseInfo) {
    return request({
      url: 'eduservice/course/updateCourseInfo',
      method: 'post',
      data: courseInfo
    })
  },

  // 根据课程id查询课程确认信息
  getCoursePublishVoById(courseId) {
    return request({
      url: 'eduservice/course/course-publish-info/' + courseId,
      method: 'get'
    })
  },

  //最终发布 修改课程状态
  updatePublishStatus(courseId) {
    return request({
      url: 'eduservice/course/publishCourse/' + courseId,
      method: 'post'
    })
  },

  //最终发布 课程列表
  getCourseList() {
    return request({
      url: 'eduservice/course',
      method: 'get'
    })
  },

  //课程列表(条件分页查询)
  getCourseListPage(current, limit, courseQuery) {
    return request({
      url:'/eduservice/course/pageCourseCondition/'+current+"/"+limit,
      method:'post',
      data:courseQuery
    })
  },

  //删除课程信息 同时删除描述章节小节信息
  removeCourse(courseId){
    return request({
      url:'/eduservice/course/'+courseId,
      method:'delete'
    })
  }

}
