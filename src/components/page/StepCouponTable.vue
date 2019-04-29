<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 领券人员名单</el-breadcrumb-item>
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
                <export-excel :list="excelData" :filename="filename" :tHeader="tHeader" :tValue="tValue"></export-excel>
                <el-breadcrumb separator="/" style="float: right">
                    <el-breadcrumb-item>总人数：{{count}}</el-breadcrumb-item>
                </el-breadcrumb>
                <!--<el-button type="primary" style="float: right" @click="handleEdit(undefined, undefined, 1)">添加</el-button>-->
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="70" align="center"></el-table-column>
                <el-table-column prop="nickname" align="center" label="微信昵称">
                </el-table-column>
                <el-table-column prop="sex" align="center" label="性别">
                </el-table-column>
                <el-table-column prop="province" align="center" label="省份">
                </el-table-column>
                <el-table-column prop="city" align="center" label="城市">
                </el-table-column>
                <el-table-column prop="tel" align="center" label="手机号码">
                </el-table-column>
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
                <el-table-column prop="title"  align="center" label="优惠券名称">
                </el-table-column>
                <el-table-column prop="datetime"  align="center" label="更新时间" sortable width="155">
                </el-table-column>
                <!--<el-table-column label="操作" width="150" align="center">-->
                    <!--<template slot-scope="scope">-->
                        <!--<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row, 2)">查看裂变用户</el-button>-->
                        <!--&lt;!&ndash;<el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>&ndash;&gt;-->
                    <!--</template>-->
                <!--</el-table-column>-->
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="sumPage">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" v-loading="loading" :visible.sync="editVisible" width="90%">
            <el-table :data="subForm" border class="table" style="width: 100%" height="800">
                <el-table-column prop="id" label="ID" align="center"></el-table-column>
                <el-table-column prop="nickname" label="微信昵称" align="center" ></el-table-column>
                <el-table-column prop="sex" label="性别" align="center" ></el-table-column>
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
    import  ExportExcel from '.././utils/index';
    export default {
        name: 'basetable',
        components: { ExportExcel},
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
                    tel:'',
                    avatarurl:'',
                    num:'',
                    sub:[],
                    datetime:''
                    // type:[],
                },
                idx: -1,
                dialogVisible: false,
                AddOrSave:'',  //1表示添加，2表示更新
                subForm:[],  //裂变用户列表
                loading:false,
                count:0,
                excelData:[],  //表格数据
                tHeader:['ID', '微信昵称', '性别', '省份', '城市', '手机号码','优惠券名称', '更新时间'],
                tValue:['id', 'nickname', 'sex', 'province', 'city','tel','title','datetime'],
                filename:'健步挑战赛领券人员名单',
            }
        },
        created() {
            //获取初始数据
            this.getData();
            //请求要导出的表格数据
            this.exportExcel();
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
                this.$api.post('StepCoupon/getStepPrizeList', params, res => {
                    this.tableData = res.data.list;
                    this.sumPage = res.data.sumPage*10;
                    this.cur_page = res.data.currentPage;
                    this.count = res.data.count,
                    console.log(res);
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
                    console.log(item);
                    this.subForm=item.sub;
                    console.log(this.subForm);
                    // this.form = {
                    //     id: item.id,
                    //     username: item.username,
                    //     nickName: item.nickName,
                    //     password:item.password,
                    //     role:item.role,
                    //     b_image: item.b_image,
                    //     datetime: item.datetime,
                    //     picid: item.picid,
                    //     roleid:item.roleid,
                    //     menuList:item.menuList,
                    //     menuName:item.menuName,
                    //     wechatid:item.wechatid,
                    // };

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
            hideEditVisible(){
                this.editVisible=false;
            },
            //请求表格数据
            exportExcel(){
                // console.log(111);
                this.$api.post('StepCoupon/exportExcel', null, res => {
                    // console.log(res);
                    this.excelData=res.data;
                    // console.log(this.excelData);
                    // this.$message.success(res.msg);
                }, err => {
                    console.log(err);
                    // this.$message.error(err.msg);
                });
            },
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
