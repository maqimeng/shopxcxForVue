<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i class="el-icon-menu"></i>
        </div>
        <div class="logo">西安艺星后台管理系统</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
                <!-- 消息中心 -->
                <!--<div class="btn-bell">-->
                    <!--<el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">-->
                        <!--<router-link to="/tabs">-->
                            <!--<i class="el-icon-bell"></i>-->
                        <!--</router-link>-->
                    <!--</el-tooltip>-->
                    <!--<span class="btn-bell-badge" v-if="message"></span>-->
                <!--</div>-->
                <!-- 用户头像 -->
                <div class="user-avator"><img :src="pic"></div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}} <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">

                        <!--<a href="http://blog.gdfengshuo.com/about/" target="_blank">-->
                            <!--<el-dropdown-item>关于作者</el-dropdown-item>-->
                        <!--</a>-->
                        <!--<a href="https://github.com/lin-xin/vue-manage-system" target="_blank">-->
                            <!--<el-dropdown-item>项目仓库</el-dropdown-item>-->
                        <!--</a>-->
                        <el-dropdown-item  command="handleEdit">修改密码</el-dropdown-item>
                        <el-dropdown-item  command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog title="修改密码" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                <el-form-item label="旧密码" prop="oldpassword">
                    <el-input type="password" v-model="form.oldpassword" placeholder="请输入旧密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newpassword">
                    <el-input type="password" v-model="form.newpassword" placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="isnewpassword">
                    <el-input type="password" v-model="form.isnewpassword" placeholder="请再次输入新密码"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="hideEditVisible">取 消</el-button>
                <el-button type="primary" @click="saveEdit('form')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                editVisible: false,
                collapse: false,
                fullscreen: false,
                name: 'linxin',
                message: 2,
                pic:JSON.parse(localStorage.getItem("userInfo")).pic,
                form:{
                    oldpassword:'',
                    newpassword:'',
                    isnewpassword:'',
                },
                rules: {
                    oldpassword: [
                        { required: true, message: '请输入旧密码', trigger: 'blur' }
                    ],
                    newpassword: [
                        { required: true, message: '请输入新密码', trigger: 'blur' }
                    ],
                    isnewpassword: [
                        { required: true, message: '请再次输入新密码', trigger: 'blur' }
                    ],
                }
            }
        },
        computed:{
            username(){
                let username = JSON.parse(localStorage.getItem('userInfo')).username;
                return username ? username : this.name;
            }
        },
        methods:{
            // 用户名下拉菜单选择事件
            handleCommand(command) {
                if(command == 'loginout'){
                    //退出登陆：参数没有的情况下要写null不能不写
                    this.$api.post('Login/quit',null,res => {
                        this.$message.success(res.msg);
                        localStorage.removeItem('userInfo');
                        this.$router.push('/login');
                    });
                }else if(command == 'handleEdit'){
                    //显示修改密码弹框
                    console.log(111);
                    this.editVisible=true;
                }
            },
            // 侧边栏折叠
            collapseChage(){
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            },
            // 全屏事件
            handleFullScreen(){
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            },
            //显示修改密码弹框
            // handleEdit(){
            //     console.log(111);
            //
            // },
            //隐藏修改密码弹框
            hideEditVisible(){
                this.editVisible=false;
            },
            //提交修改密码操作
            saveEdit(formName) {
                // this.$set(this.tableData, this.idx, this.form);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.form.newpassword!=this.form.isnewpassword){
                            this.$message.error("两次密码输入不一致");
                        }else{
                            var params=this.$qs.stringify({
                                userid:JSON.parse(localStorage.getItem('userInfo')).id,
                                oldpassword:this.form.oldpassword,
                                newpassword:this.form.newpassword,
                            });
                            this.$api.post('Login/savePassword', params, res => {
                                this.$message.success(res.msg);
                                localStorage.removeItem('userInfo');
                                this.$router.push('/login');
                                this.editVisible = false;
                            }, err => {
                                this.$message.error(err.msg);
                            });
                        }

                    }else{
                        console.log("请填写所需数据")
                        return false;
                    }
                });
            },
        },
        mounted(){
            if(document.body.clientWidth < 1500){
                this.collapseChage();
            }
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        color: #fff;
    }
    .collapse-btn{
        float: left;
        padding: 0 21px;
        cursor: pointer;
        line-height: 70px;
    }
    .header .logo{
        float: left;
        width:250px;
        line-height: 70px;
    }
    .header-right{
        float: right;
        padding-right: 50px;
    }
    .header-user-con{
        display: flex;
        height: 70px;
        align-items: center;
    }
    .btn-fullscreen{
        transform: rotate(45deg);
        margin-right: 5px;
        font-size: 24px;
    }
    .btn-bell, .btn-fullscreen{
        position: relative;
        width: 30px;
        height: 30px;
        text-align: center;
        border-radius: 15px;
        cursor: pointer;
    }
    .btn-bell-badge{
        position: absolute;
        right: 0;
        top: -2px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: #f56c6c;
        color: #fff;
    }
    .btn-bell .el-icon-bell{
        color: #fff;
    }
    .user-name{
        margin-left: 10px;
    }
    .user-avator{
        margin-left: 20px;
    }
    .user-avator img{
        display: block;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-link{
        color: #fff;
        cursor: pointer;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>
