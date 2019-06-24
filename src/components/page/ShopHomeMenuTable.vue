<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 首页菜单管理</el-breadcrumb-item>
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
                <el-table-column prop="title" align="center" label="名称">
                    <template slot-scope="scope">
                        <div :style="{color:scope.row.fontcolor}">{{scope.row.title}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="engtitle" align="center" label="英文名称">
                    <template slot-scope="scope">
                        <div :style="{color:scope.row.fontcolor}">{{scope.row.engtitle}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="b_image" align="center" label="图片">
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
                <el-table-column prop="fontcolor" align="center" label="字体颜色">
                    <template slot-scope="scope">
                        <div style="width: 40px;height: 40px; margin: 0 auto" :style="{color:scope.row.fontcolor,backgroundColor:scope.row.fontcolor}">{{scope.row.fontcolor}}</div>
                    </template>

                </el-table-column>
                <el-table-column prop="url" label="跳转路径" align="center" :formatter="formatter">
                </el-table-column>
                <el-table-column prop="sort" label="排序" width="100" align="center"></el-table-column>
                <el-table-column prop="datetime" label="更新时间" align="center" sortable width="200">
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="50%">
            <el-form ref="form" :rules="rules" :model="form" label-width="100px">
                <el-form-item label="名称" prop="title">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="英文名称" prop="engtitle">
                    <el-input v-model="form.engtitle"></el-input>
                </el-form-item>
                <el-form-item label="图片">
                    <el-upload
                            class="avatar-uploader"
                            name="image"
                            with-credentials
                            :data="{id:this.form.img}"
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
                    <span style="color:red">建议尺寸126*134</span>
                </el-form-item>
                <el-form-item label="字体颜色">
                    <el-color-picker v-model="form.fontcolor"></el-color-picker>
                </el-form-item>
                <el-form-item label="跳转路径">
                    <el-input v-model="form.url"></el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model="form.sort"></el-input>
                    <span style="color:red">注：数值越大展示越靠前，不输入则默认排序</span>
                </el-form-item>
                <!--<el-form-item label="日期">-->
                    <!--<el-date-picker type="date" placeholder="选择日期" v-model="form.b_datetime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>-->
                <!--</el-form-item>-->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
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
                    id: '',
                    title: '',
                    engtitle: '',
                    img: '',
                    b_image: '',
                    fontcolor: '',
                    url: '',
                    sort: '',
                    datetime: '',
                },
                idx: -1,
                dialogVisible: false,
                AddOrSave:'',  //1表示添加，2表示更新
                rules: {
                    title: [
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ],
                    engtitle: [
                        { required: true, message: '请输入英文名称', trigger: 'blur' }
                    ],
                }
            }
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.title === this.del_list[i].title) {
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
                console.log(res);
                this.form.img=res.data;
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
                this.$api.post('ShopHomeMenu/getHomeMenuList', params, res => {
                    this.tableData = res.data.list;
                    this.sumPage = res.data.sumPage*10;
                    this.cur_page = res.data.currentPage;
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
                return row.url;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row, status) {
                this.AddOrSave=status;
                //如果是添加则把form清空
                if(status==1){
                    this.form = {
                        id: null,
                        title: null,
                        engtitle: null,
                        img: null,
                        b_image: null,
                        fontcolor: null,
                        url: null,
                        sort: null,
                        datetime: null,
                    };
                }
                if(index!=undefined && row!=undefined){
                    this.idx = index;
                    const item = this.tableData[index];
                    this.form = {
                        id: item.id,
                        title: item.title,
                        engtitle: item.engtitle,
                        img: item.img,
                        b_image: item.b_image,
                        fontcolor: item.fontcolor,
                        url: item.url,
                        sort: item.sort,
                        datetime: item.datetime,
                    };
                }
                this.editVisible = true;
                console.log(this.form);
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
                                title: this.form.title,
                                engtitle: this.form.engtitle,
                                img: this.form.img,
                                fontcolor: this.form.fontcolor,
                                url: this.form.url,
                                sort: this.form.sort
                            });
                        }else{
                            params=this.$qs.stringify({
                                id: this.form.id,
                                title: this.form.title,
                                engtitle: this.form.engtitle,
                                fontcolor: this.form.fontcolor,
                                url: this.form.url,
                                sort: this.form.sort
                            });
                        }
                        this.$api.post('ShopHomeMenu/saveHomeMenu', params, res => {
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
                // this.$message.success(`修改第 ${this.idx+1} 行成功`);
            },
            // 确定删除
            deleteRow(){
                var params=this.$qs.stringify({
                    id: this.form.id
                });
                console.log(this.form);
                this.$api.post('ShopHomeMenu/deleteHomeMenu', params, res => {
                    this.getData();
                    this.$message.success(res.msg+res.data+"条数据");
                }, err => {
                    this.$message.error(err.msg);
                });
                this.delVisible = false;
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
