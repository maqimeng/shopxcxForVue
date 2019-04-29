import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => { require(['../components/common/Home.vue'], resolve)},
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/dashboard',
                    component: resolve => { require(['../components/page/Dashboard.vue'], resolve)},
                    meta: { title: '系统首页' }
                },
                {
                    path: '/icon',
                    component: resolve => { require(['../components/page/Icon.vue'], resolve)},
                    meta: { title: '自定义图标' }
                },
                {
                    path: '/bannerTable',
                    component: resolve => { require(['../components/page/BannerTable.vue'], resolve)},
                    meta: { title: 'Banner管理' }
                },
                {
                    path: '/AdminUserTable',
                    component: resolve => { require(['../components/page/AdminUserTable.vue'], resolve)},
                    meta: { title: '用户管理' }
                },
                {
                    path: '/ConsultationTable',
                    component: resolve => { require(['../components/page/ConsultationTable.vue'], resolve)},
                    meta: { title: '咨询管理' }
                },
                {
                    path: '/ParticipantTable',
                    component: resolve => { require(['../components/page/ParticipantTable.vue'], resolve)},
                    meta: { title: '查看参与者' }
                },
                {
                    path: '/AdminRoleTable',
                    component: resolve => { require(['../components/page/AdminRoleTable.vue'], resolve)},
                    meta: { title: '角色管理' }
                },
                {
                    path: '/PrizeTable',
                    component: resolve => { require(['../components/page/PrizeTable.vue'], resolve)},
                    meta: { title: '奖品管理' }
                },
                {
                    path: '/ActivityRulesTable',
                    component: resolve => { require(['../components/page/ActivityRulesTable.vue'], resolve)},
                    meta: { title: '规则管理' }
                },
                {
                    path: '/InCodeTable',
                    component: resolve => { require(['../components/page/InCodeTable.vue'], resolve)},
                    meta: { title: '内部码管理' }
                },
                {
                    path: '/WinPrizeTable',
                    component: resolve => { require(['../components/page/WinPrizeTable.vue'], resolve)},
                    meta: { title: '中奖名单管理' }
                },
                {
                    path: '/GrantPrizeTable',
                    component: resolve => { require(['../components/page/GrantPrizeTable.vue'], resolve)},
                    meta: { title: '发放礼品管理' }
                },
                {
                    path: '/WechatUserTable',
                    component: resolve => { require(['../components/page/WechatUserTable.vue'], resolve)},
                    meta: { title: '裂变用户管理' }
                },
                {
                    path: '/StepParticipantTable',
                    component: resolve => { require(['../components/page/StepParticipantTable.vue'], resolve)},
                    meta: { title: '查看参与者' }
                },
                {
                    path: '/StepCouponTable',
                    component: resolve => { require(['../components/page/StepCouponTable.vue'], resolve)},
                    meta: { title: '领券人员名单' }
                },
                {
                    path: '/StepWaitingTable',
                    component: resolve => { require(['../components/page/StepWaitingTable.vue'], resolve)},
                    meta: { title: '等待抽奖名单' }
                },
                {
                    path: '/StepInYesTable',
                    component: resolve => { require(['../components/page/StepInYesTable.vue'], resolve)},
                    meta: { title: '内定中奖人员' }
                },
                {
                    path: '/StepPrizeTable',
                    component: resolve => { require(['../components/page/StepPrizeTable.vue'], resolve)},
                    meta: { title: '优惠券奖品' }
                },
                {
                    path: '/StepGiftTable',
                    component: resolve => { require(['../components/page/StepGiftTable.vue'], resolve)},
                    meta: { title: '抽奖奖品' }
                },
                {
                    path: '/tabs',
                    component: resolve => { require(['../components/page/Tabs.vue'], resolve)},
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/form',
                    component: resolve => { require(['../components/page/BaseForm.vue'], resolve)},
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: resolve => { require(['../components/page/VueEditor.vue'], resolve)},
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: resolve => { require(['../components/page/Markdown.vue'], resolve)},
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: resolve => { require(['../components/page/Upload.vue'], resolve)},
                    meta: { title: '文件上传' }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: resolve => { require(['../components/page/BaseCharts.vue'], resolve)},
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: resolve => { require(['../components/page/DragList.vue'], resolve)},
                    meta: { title: '拖拽列表' }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: resolve => { require(['../components/page/DragDialog.vue'], resolve)},
                    meta: { title: '拖拽弹框' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: resolve => { require(['../components/page/Permission.vue'], resolve)},
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: resolve => { require(['../components/page/404.vue'], resolve)},
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => { require(['../components/page/403.vue'], resolve)},
                    meta: { title: '403' }
                },
                {
                    path: '/StepRulesTable',
                    component: resolve => { require(['../components/page/StepRulesTable.vue'], resolve)},
                    meta: { title: '规则管理' }
                },
            ]
        },
        {
            path: '/login',
            component: resolve => { require(['../components/page/Login.vue'], resolve)}
        },
        {
            path: '*',
            component: resolve => { require(['../components/page/404.vue'], resolve)}
        }
    ]
})
