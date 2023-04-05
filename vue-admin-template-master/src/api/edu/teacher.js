import request from '@/utils/request'

export default {
    //1讲师列表（条件查询分页）
    //current当前页 limit每页记录数 teacherQuery条件对象

    getTeacherListPage(current, limit, teacherQuery) {
        return request({
            url: 'eduservice/teacher/pageTeacherCondition/' + current + "/" + limit,
            // url: `eduservice/teacher/pageTeacherCondition/${current}/${limit}`,

            //提交没有写请求方式 默认是get提交 出现跨域问题
            method: 'post',
            data: teacherQuery
        })

    },

    // 根据id删除教师
    removeTeacherById(id) {
        return request({
            // url: '/eduservice/teacher' + "/" + id,
            url: `/eduservice/teacher/${id}`,
            method: 'delete'
        })

    },



    // 这里传递一个对象 我为什么要在url后面加teacher？？？

    addTeacher(teacher) {
        return request({
            url: `/eduservice/teacher/addTeacher`,
            method: 'post',
            data: teacher
        })
    },

    getTeacherById(id) {
        return request({
            url: `/eduservice/teacher/getTeacher/${id}`,
            method: 'get'
        })
    },


    updateTeacher(teacher) {
        return request({
            url: `/eduservice/teacher/updateTeacher`,
            method: 'post',
            data: teacher
        })
    },



}
