import request from '@/utils/request'
export default {
  //添加小节
  addVideo(video) {
    return request({
      // 注意结尾没打/ 测试
      url: '/eduservice/video/addVideo/',
      method: 'post',
      data: video
    })
  },
  //删除小节
  deleteVideo(id) {
    return request({
      url: `/eduservice/video/${id}`,
      method: 'delete',
    })
  },
  //修改小节
  updateVideo(video) {
    return request({
      url: `/eduservice/video/updateVideo`,
      method: 'post',
      data:video
    })
  },

  // 根据id查询小节
  getVideoById(id){
    return request({
      url: `/eduservice/video/getVideoInfo/${id}`,
      method: 'get'
    })
  },
  removeAlyVideoById(id){
    return request({
      url: `/eduvod/video/removeAlyVideo/${id}`,
      method: 'delete'
    })
  }




}
