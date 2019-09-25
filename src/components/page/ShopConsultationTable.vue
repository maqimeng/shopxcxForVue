<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 咨询管理</el-breadcrumb-item>
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
                <el-button type="primary" style="float: right" @click="handleEdit2(undefined, undefined, 1)">添加咨询</el-button>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="70" align="center"></el-table-column>
                <el-table-column prop="name" align="left" width="150" label="姓名">
                </el-table-column>
                <el-table-column prop="imgurl" align="center" label="二维码">
                    <template   slot-scope="scope">
                        <el-popover
                                placement="left"
                                title=""
                                width="500"
                                trigger="hover">
                            <img :src="scope.row.imgurl" style="max-width: 100%" />
                            <img slot="reference" :src="scope.row.imgurl" :alt="scope.row.imgurl" style="max-width: 130px; height: auto; max-height: 100px">
                        </el-popover>
                        <!--<img :src="scope.row.b_image"  min-width="70" height="70" />-->
                    </template>
                </el-table-column>
                <el-table-column prop="userList.length" align="center" width="150" label="裂变用户数量">
                </el-table-column>
                <el-table-column prop="datetime"  align="center" label="更新时间" sortable width="160">
                </el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit"><a :href="scope.row.imgurl" download="qecode.png" target="_blank">下载二维码</a></el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit2(scope.$index, scope.row, 2)">修改</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row, 2)">查看裂变用户</el-button>
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
        <el-dialog title="裂变用户" v-loading="loading" :visible.sync="editVisible" width="90%">
            <el-table :data="subForm" border class="table" style="width: 100%">
                <el-table-column prop="userid" label="ID" align="center"></el-table-column>
                <el-table-column prop="nickname" label="微信昵称" align="center" ></el-table-column>
                <el-table-column prop="gender" label="性别" align="center" >
                    <template slot-scope="scope">
                        <div v-if="scope.row.gender==1">男</div>
                        <div v-else>女</div>
                    </template>
                </el-table-column>
                <el-table-column prop="tel" label="手机号码" align="center" ></el-table-column>
                <el-table-column prop="province" label="省份" align="center" ></el-table-column>
                <el-table-column prop="city" label="城市" align="center" ></el-table-column>
                <el-table-column prop="avatarurl"  align="center" label="头像">
                    <template   slot-scope="scope">
                        <el-popover
                                placement="left"
                                title=""
                                width="500"
                                trigger="hover">
                            <img :src="scope.row.avatarurl" style="max-width: 100%" />
                            <img slot="reference" :src="scope.row.avatarurl" :alt="scope.row.avatarurl" style="max-width: 130px; height: auto; max-height: 100px">
                        </el-popover>
                        <!--<img :src="scope.row.b_image"  min-width="70" height="70" />-->
                    </template>
                </el-table-column>

                <el-table-column prop="datetime" align="center"  label="更新时间"></el-table-column>
            </el-table>
            <!--<span slot="footer" class="dialog-footer">-->
                <!--<el-button @click="hideEditVisible">取 消</el-button>-->
                <!--<el-button type="primary" @click="saveEdit('form')">确 定</el-button>-->
            <!--</span>-->
        </el-dialog>
        <!-- 添加或修改咨询信息 -->
        <el-dialog title="咨询信息" v-loading="loading" :visible.sync="editVisible2" width="50%">
            <el-form ref="form" :rules="rules" :model="form" label-width="145px">
                <el-form-item label="咨询姓名" prop="name">
                    <el-input v-model="form.name" style="width:50%" placeholder="请输入咨询姓名"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible2 = false">取 消</el-button>
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
                editVisible2: false,  //添加或修改咨询弹框
                form: {
                    id:'',
                    name: '',
                    imgid:'',
                    imgurl:'',
                    userList: [],
                    datetime:''
                },
                idx: -1,
                dialogVisible: false,
                AddOrSave:'',  //1表示添加，2表示更新
                AddOrSave2:'',  //1表示添加，2表示更新
                subForm:[],  //裂变用户列表
                loading:false,
                rules: {
                    name: [
                        { required: true, message: '请输入咨询姓名', trigger: 'blur' }
                    ],
                },
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
                        if (d.name === this.del_list[i].name) {
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
                this.$api.post('ShopConsultation/getConsultationList', params, res => {
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
                this.AddOrSave=status;
                //如果是添加则把form清空
                if(status==1){
                    this.subForm=[];
                }
                if(index!=undefined && row!=undefined){
                    this.idx = index;
                    const item = this.tableData[index];
                    this.subForm=item.userList;
                }
                this.editVisible = true;
            },
            //添加或修改咨询信息
            handleEdit2(index, row, status) {
                this.AddOrSave2=status;
                //如果是添加则把form清空
                if(status==1){
                    this.form = {
                        id:null,
                        name: null,
                        imgid:null,
                        imgurl:null,
                        datetime:null
                    };
                }
                if(index!=undefined && row!=undefined){
                    this.idx = index;
                    const item = this.tableData[index];
                    this.form = {
                        id:item.id,
                        name: item.name,
                        imgid:item.imgid,
                        imgurl:item.imgurl,
                        datetime:item.datetime
                    };
                }
                this.editVisible2 = true;
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
                        this.editVisible2 = false;
                        var params=null;
                        //1表示添加，2表示更新
                        if(this.AddOrSave==1){
                            params=this.$qs.stringify({
                                name: this.form.name,
                            });
                        }else{
                            params=this.$qs.stringify({
                                id: this.form.id,
                                name: this.form.name,
                            });
                        }
                        this.loading=true;
                        this.$api.post('ShopConsultation/saveConsultation', params, res => {
                            this.getData();
                            this.$message.success(res.msg);
                            console.log(res);
                            this.loading=false;
                        }, err => {
                            this.$message.error(err.msg);
                            this.loading=false;
                        });
                    }else{
                        console.log("请填写所需数据");
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
                this.$api.post('ShopConsultation/deleteConsultation', params, res => {
                    this.getData();
                    this.$message.success(res.msg+res.data+"条数据");
                }, err => {
                    this.$message.error(err.msg);
                });
                this.delVisible = false;
            },
            hideEditVisible(){
                this.editVisible=false;
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
