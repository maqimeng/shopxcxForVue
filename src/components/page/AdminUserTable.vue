<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <!--<el-button type="danger" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>-->
                <!--<el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">-->
                    <!--<el-option key="1" label="广东省" value="广东省"></el-option>-->
                    <!--<el-option key="2" label="湖南省" value="湖南省"></el-option>-->
                <!--</el-select>-->
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" style="float: right" @click="handleEdit(undefined, undefined, 1)">添加</el-button>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="70" align="center"></el-table-column>
                <el-table-column prop="username" align="center" label="用户名" :formatter="formatter">
                </el-table-column>
                <el-table-column prop="nickName" align="center" label="微信昵称">
                </el-table-column>
                <el-table-column prop="password" align="center" label="密码" >
                </el-table-column>
                <el-table-column prop="role" align="center" label="角色" >
                </el-table-column>
                <el-table-column prop="b_image"  align="center" label="头像">
                    <template   slot-scope="scope">
                        <el-popover
                                placement="left"
                                title=""
                                width="500"
                                trigger="hover">
                            <img :src="scope.row.b_image" style="max-width: 100%" />
                            <img slot="reference" :src="scope.row.b_image" :alt="scope.row.b_image" style="max-width: 130px; height: auto; max-height: 100px">
                        </el-popover>
                        <!--<img :src="scope.row.b_image"  min-width="70" height="70" />-->
                    </template>
                </el-table-column>
                <el-table-column prop="menuName" :show-overflow-tooltip='true' align="center" label="菜单权限">
                </el-table-column>
                <el-table-column prop="datetime"  align="center" label="更新时间" sortable width="155">
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row, 2)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="sumPage">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" v-loading="loading" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="绑定微信">
                    <el-select v-model="form.wechatid" placeholder="请选择微信昵称">
                        <el-option
                                v-for="item in weChatList"
                                :key="item.id"
                                :label="item.nickname"
                                :value="item.id">{{item.nickname}}{{item.temp}}
                        </el-option>
                        <!--<el-option key="bbk" label="步步高" value="bbk"></el-option>-->
                        <!--<el-option key="xtc" label="小天才" value="xtc"></el-option>-->
                        <!--<el-option key="imoo" label="imoo" value="imoo"></el-option>-->
                    </el-select>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="roleid">
                    <el-select v-model="form.roleid" placeholder="请选择角色">
                        <el-option
                                v-for="item in roleList"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id">{{item.title}}
                        </el-option>
                        <!--<el-option key="bbk" label="步步高" value="bbk"></el-option>-->
                        <!--<el-option key="xtc" label="小天才" value="xtc"></el-option>-->
                        <!--<el-option key="imoo" label="imoo" value="imoo"></el-option>-->
                    </el-select>
                </el-form-item>
                <el-form-item label="图片">
                    <el-upload
                            class="avatar-uploader"
                            name="image"
                            with-credentials
                            :data="{id:this.form.picid}"
                            :action="uploadUrl()"
                            :on-error="uploadError"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                            :on-progress="uploading"
                            :show-file-list="false"
                            :auto-upload="true"
                            enctype="multipart/form-data">
                        <img v-if="form.b_image" :src="form.b_image" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>

                </el-form-item>
                <!--<el-form-item label="日期">-->
                    <!--<el-date-picker type="date" placeholder="选择日期" v-model="form.b_datetime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>-->
                <!--</el-form-item>-->
                <el-form-item label="管理权限">
                    <el-checkbox-group v-model="type">
                        <el-checkbox v-for="item in menuList" :label="item.id" :key="item.id">{{item.title}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="hideEditVisible">取 消</el-button>
                <el-button type="primary" @click="saveEdit('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'basetable',
        data() {
            return {
                url: './vuetable.json',
                tableData: [],
                cur_page: 1,  //当前页
                number: 10,  //每页显示条数
                sumPage:10,  //总页数
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    id:'',
                    username: '',
                    nickName:'',
                    password:'',
                    role:'',
                    b_image: '',
                    datetime: '',
                    picid:'',
                    roleid:'',
                    menuList:'',
                    menuName:'',
                    wechatid:'',
                    // type:[],
                },
                idx: -1,
                dialogVisible: false,
                AddOrSave:'',  //1表示添加，2表示更新
                roleList:[],  //角色列表
                // selected:'',  //默认选中的角色
                menuList:[],  //菜单列表
                type: [],  //被选中的菜单列表
                loading:false,
                weChatList:[],  //微信用户列表
                // weChatSelect:'',  //默认选中的微信用户
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    roleid:[
                        { required: true, message: '请选择角色', trigger: 'change' }
                    ],
                }
            }
        },
        created() {
            //获取初始数据
            this.getData();
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.username === this.del_list[i].username) {
                            is_del = true;
                            break;
                        }
                    }
                    return d;
                    // if (!is_del) {
                    //     if (d.b_datetime.indexOf(this.select_cate) > -1 &&
                    //         (d.b_titile.indexOf(this.select_word) > -1 ||
                    //             d.b_datetime.indexOf(this.select_word) > -1)
                    //     ) {
                    //         return d;
                    //     }
                    // }
                })
            }
        },
        methods: {
            //设置上传图片接口地址
            uploadUrl(){
                var url=this.$api.uploadUrl + "/Images/upload";
                return url
            },
            //图片上传之前
            beforeAvatarUpload(file){
                // console.log(file);
                this.loading=true;
            },
            //正在上传中
            uploading(event, file, fileList){
                // console.log(event);
                // console.log(file);
                // console.log(fileList);
            },
            //图片上传失败
            uploadError(err){
                this.$message.error(err.msg);
            },
            //图片上传成功
            handleAvatarSuccess(res, file){
                this.loading=false;
                // console.log(res);
                this.form.picid=res.data;
                this.form.b_image = URL.createObjectURL(file.raw);
                this.getData();
                this.$message.success(res.msg);
            },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
                // if (process.env.NODE_ENV === 'development') {
                //     this.url = '/ms/table/list';
                // };
                //不传参数要写null
                var params=this.$qs.stringify({
                    select_word: this.select_word,
                    pageIndex: this.cur_page,
                    number: this.number
                });
                // console.log(params);
                this.$api.post('AdminUser/getUserList', params, res => {
                    this.tableData = res.data.list;
                    this.sumPage = res.data.sumPage*10;
                    this.cur_page = res.data.currentPage;
                    console.log(this.tableData);
                }, err => {
                    this.tableData = [];
                    this.$message.error(err.msg);
                });
                // this.$axios.post(this.url, {
                //     page: this.cur_page
                // }).then((res) => {
                //     this.tableData = res.data.list;
                //     console.log(this.tableData);
                // })
            },
            search() {
                this.is_search = true;
                this.getData();
            },
            formatter(row, column) {
                return row.username;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row, status) {
                //获取角色列表
                this.getRoleList();
                //获取菜单列表
                this.getMenuList();
                //获取微信用户列表
                this.getwechatUserList();
                console.log(row);
                this.AddOrSave=status;
                //如果是添加则把form清空
                if(status==1){
                    this.form = {
                        id:null,
                        username: null,
                        nickName:null,
                        password:null,
                        role:null,
                        b_image: null,
                        datetime: null,
                        picid:null,
                        roleid:null,
                        menuList:null,
                        menuName:null,
                        wechatid:null,
                        // type:[],
                    };
                    this.type=[];
                }
                if(index!=undefined && row!=undefined){
                    this.idx = index;
                    const item = this.tableData[index];
                    this.form = {
                        id: item.id,
                        username: item.username,
                        nickName: item.nickName,
                        password:item.password,
                        role:item.role,
                        b_image: item.b_image,
                        datetime: item.datetime,
                        picid: item.picid,
                        roleid:item.roleid,
                        menuList:item.menuList,
                        menuName:item.menuName,
                        wechatid:item.wechatid,
                    };
                    this.type=[];
                    for(var i=0;i<row.menuList.length;i++){
                        this.type.push(row.menuList[i]['id']);
                    }
                    // console.log(this.type);
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.form = row;
                this.delVisible = true;
            },
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].b_title + ' ';
                }
                console.log(this.del_list);
                // this.$message.error('删除了' + str);
                // this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit(formName) {
                // this.$set(this.tableData, this.idx, this.form);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.editVisible = false;
                        var params=null;
                        //1表示添加，2表示更新
                        if(this.AddOrSave==1){
                            params=this.$qs.stringify({
                                picid: this.form.picid,
                                username: this.form.username,
                                weChatId: this.form.wechatid,
                                password: this.form.password,
                                roleid: this.form.roleid,
                                menuId: this.type
                            });
                        }else{
                            params=this.$qs.stringify({
                                id: this.form.id,
                                picid: this.form.picid,
                                username: this.form.username,
                                weChatId: this.form.wechatid,
                                password: this.form.password,
                                roleid: this.form.roleid,
                                menuId: this.type
                            });
                        }
                        // console.log(this.form);
                        // console.log({
                        //     id: this.form.id,
                        //     picid: this.form.picid,
                        //     username: this.form.username,
                        //     weChatId: this.form.wechatid,
                        //     password: this.form.password,
                        //     roleid: this.form.roleid,
                        //     menuId: this.type
                        // });
                        // return;
                        this.$api.post('AdminUser/saveAdminUser', params, res => {
                            this.getData();
                            this.$message.success(res.msg);
                        }, err => {
                            this.$message.error(err.msg);
                        });
                    }else{
                        console.log("请填写所需数据")
                        return false;
                    }
                });
            },
            // 确定删除
            deleteRow(){
                // console.log(this.form);
                // return;
                var params=this.$qs.stringify({
                    id: this.form.id
                });
                console.log(this.form);
                this.$api.post('AdminUser/deleteAdminUser', params, res => {
                    this.getData();
                    this.$message.success(res.msg+res.data+"条数据");
                }, err => {
                    this.$message.error(err.msg);
                });
                this.delVisible = false;
            },
            //获取角色列表
            getRoleList(){
                this.$api.post('AdminUser/getRoleList', null, res => {
                    console.log(res);
                    this.roleList=res.data;
                }, err => {
                    this.$message.error(err.msg);
                });
            },
            //获取菜单列表
            getMenuList(){
                this.$api.post('AdminUser/getMenuList', null, res => {
                    console.log(res);
                    this.menuList=res.data;
                }, err => {
                    this.$message.error(err.msg);
                });
            },
            //获取微信用户列表
            getwechatUserList(){
                this.$api.post('AdminUser/wechatUserList', null, res => {
                    console.log(res);
                    this.weChatList=res.data;
                }, err => {
                    this.$message.error(err.msg);
                });
            },
            hideEditVisible(){
                this.editVisible=false;
                this.type=[];
                this.form.selected='';
                // console.log(this.type);
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 100%;
        /*height: 100%;*/
        display: block;
    }
</style>
