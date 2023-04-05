import request from '@/utils/request'

export default {
  //根据courseId查询章节小节
  getChapterVideoById(courseId) {
    return request({
      url: '/eduservice/chapter/getChapterVideo/' + courseId,
      method: 'get'
    })
  },
  // 添加章节
  addChapter(chapter) {
    return request({
      url: '/eduservice/chapter/addChapter/',
      method: 'post',
      data: chapter
    })
  },
  //根据章节id查询章节信息
  getChapter(chapterId) {
    return request({
      url: '/eduservice/chapter/getChapterInfo/' + chapterId,
      method: 'get'
    })
  },
  //修改章节
  updateChapter(eduChapter) {
    return request({
      url: '/eduservice/chapter/updateChapter/',
      method: 'post',
      data: eduChapter
      //又写成date了
    //   异常 org.springframework.http.converter.HttpMessageNotReadableException
    // Required
    // request
    // body
    // is
    // missing: public
    // com.atguigu.commonutils.R
    // com.atguigu.eduservice.controller.
    // EduChapterController.updateChapter(com.atguigu.eduservice.entity.EduChapter)
  })
  },
  // 删除章节 deleteChapter

  deleteChapter(chapterId) {
    return request({
      url: '/eduservice/chapter/' + chapterId,
      method: 'delete'
    })
  }
}
