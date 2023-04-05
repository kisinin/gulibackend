import request from '@/utils/request'

export default {

    getSubjectList() {
        //1.课程列表分类
        return request({
            url: 'eduservice/subject/getAllSubject',
            method: 'get'
        })
    }

}