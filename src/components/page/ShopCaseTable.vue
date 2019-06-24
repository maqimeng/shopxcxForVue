<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 日记列表</el-breadcrumb-item>
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
                <el-table-column prop="name" align="center" label="姓名">
                </el-table-column>
                <el-table-column prop="b_image" width="120" align="center" label="头像">
                    <template   slot-scope="scope">
                        <el-popover
                                placement="left"
                                title=""
                                width="500"
                                trigger="hover">
                            <img :src="scope.row.b_image" width="150" style="max-width: 100%" />
                            <img slot="reference" :src="scope.row.b_image" :alt="scope.row.b_image" style="max-width: 130px; height: auto; max-height: 100px">
                        </el-popover>
                        <!--<img :src="scope.row.b_image"  min-width="70" height="70" />-->
                    </template>
                </el-table-column>
                <!--<el-table-column prop="swiperimgList" label="商品轮播图">-->
                    <!--<template slot-scope="scope">-->
                        <!--<el-popover-->
                                <!--v-for="item in scope.row.swiperimgList"-->
                                <!--placement="left"-->
                                <!--title=""-->
                                <!--width="500"-->
                                <!--trigger="hover">-->
                            <!--<img :src="item" style="max-width: 100%" />-->
                            <!--<img slot="reference" :src="item" :alt="item" style="max-width: 130px; height: auto; max-height: 100px">-->
                        <!--</el-popover>-->
                        <!--&lt;!&ndash;<img :src="scope.row.b_image"  min-width="70" height="70" />&ndash;&gt;-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column prop="engtitle" label="英文名称">-->
                    <!--<template slot-scope="scope">-->
                        <!--<div :style="{color:scope.row.fontcolor}">{{scope.row.engtitle}}</div>-->
                    <!--</template>-->
                <!--</el-table-column>-->

                <el-table-column prop="remarks" align="center" label="说明">
                </el-table-column>
                <el-table-column prop="doctor" align="center" label="主治医生">
                </el-table-column>
                <el-table-column prop="casemenu" align="center" width="120" label="日记类别">
                </el-table-column>
                <el-table-column prop="looknumber" align="center" width="120" label="浏览量">
                </el-table-column>
                <el-table-column prop="fabulousnumber" align="center" width="120" label="点赞量">
                </el-table-column>
                <el-table-column prop="ishome" align="center" width="70" label="是否在首页显示">
                    <template slot-scope="scope">
                        <div v-if="scope.row.ishome==1" style="color:#409EFF">是</div>
                        <div v-else style="color:red">否</div>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" width="70" align="center"></el-table-column>
                <el-table-column prop="datetime" label="更新时间" align="center" sortable>
                </el-table-column>
                <el-table-column label="操作" align="center">
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
        <el-dialog title="编辑" v-loading="loading" :visible.sync="editVisible" width="70%">
            <el-form ref="form" :rules="rules" :model="form" label-width="130px">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="form.name" style="width:400px" placeholder="请输入商品名称"></el-input>
                </el-form-item>
                <el-form-item label="头像">
                    <el-upload
                            class="avatar-uploader"
                            name="image"
                            with-credentials
                            list-type="picture-card"
                            :data="{id:this.form.headerimg}"
                            :action="uploadUrl()"
                            :on-error="uploadError"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                            :on-progress="uploading"
                            :show-file-list="false"
                            :auto-upload="true"
                            enctype="multipart/form-data">
                        <img v-if="form.b_image" :src="form.b_image" class="avatar">
                        <i v-else class="el-icon-plus"></i>
                    </el-upload>
                    <span style="color:red">建议尺寸340*340</span>
                </el-form-item>
                <el-form-item label="示例图">
                    <!--<img v-for="item in form.swiperimgList" :src="item">-->
                    <el-upload
                            class="avatar-uploader"
                            name="image"
                            with-credentials
                            list-type="picture-card"
                            :data="{id:null}"
                            :action="uploadUrl()"
                            :on-error="uploadError"
                            :on-success="handleAvatarSuccess2"
                            :before-upload="beforeAvatarUpload"
                            :on-progress="uploading"
                            :auto-upload="true"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove"
                            :file-list="this.form.imglistUrl"
                            enctype="multipart/form-data">

                        <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="isShowBigImg" :append-to-body="true" width="60%" top="10vh">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                    <span style="color:red">建议尺寸340*345</span>
                </el-form-item>
                <el-form-item label="说明" prop="remarks">
                    <el-input v-model="form.remarks" style="width:400px" placeholder="请输入说明"></el-input>
                </el-form-item>
                <el-form-item label="主治医生" prop="doctor">
                    <el-input v-model="form.doctor" style="width:150px" placeholder="请输入主治医生"></el-input>
                </el-form-item>
                <el-form-item label="日记类别" prop="casemenuid">
                    <el-select v-model="form.casemenuid">
                        <el-option
                                v-for="item in caseList"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id">{{item.title}}
                        </el-option>
                        <!--<el-option key="bbk" label="步步高" value="bbk"></el-option>-->
                        <!--<el-option key="xtc" label="小天才" value="xtc"></el-option>-->
                        <!--<el-option key="imoo" label="imoo" value="imoo"></el-option>-->
                    </el-select>
                </el-form-item>
                <el-form-item label="医院地址" prop="address">
                    <el-input v-model="form.address" style="width:400px" placeholder="请输入医院地址"></el-input>
                </el-form-item>
                <el-form-item label="浏览量" prop="looknumber">
                    <el-input v-model="form.looknumber" style="width:150px" placeholder="请输入浏览量"></el-input>
                </el-form-item>
                <el-form-item label="点赞量" prop="fabulousnumber">
                    <el-input v-model="form.fabulousnumber" style="width:150px" placeholder="请输入点赞量"></el-input>
                </el-form-item>

                <el-form-item label="是否在首页显示">
                    <el-switch v-model="form.ishome"></el-switch>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model="form.sort" style="width:150px"></el-input>
                    <span style="color:red">&nbsp;&nbsp;注：数值越大展示越靠前，不输入则默认排序</span>
                </el-form-item>
                <el-form-item label="日记详情">
                    <quill-editor ref="myTextEditor" v-model="form.details" :options="editorOption"></quill-editor>
                    <!--<el-button class="editor-btn" type="primary" @click="submit">提交</el-button>-->
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
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import {quillEditor, Quill} from 'vue-quill-editor'
    import {container, ImageExtend, QuillWatch} from 'quill-image-extend-module';
    Quill.register('modules/ImageExtend', ImageExtend)
    export default {
        name: 'basetable',
        components: {
            quillEditor
        },
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
                    name: '',
                    headerimg: '',
                    b_image: '',
                    imglist: '',
                    imglistUrl: [],
                    remarks: '',
                    doctor: '',
                    casemenuid: '',
                    casemenu: '',
                    address: '',
                    looknumber: '',
                    fabulousnumber: '',
                    details: '',
                    ishome: '',
                    sort: '',
                    datetime: '',
                },
                idx: -1,
                dialogVisible: false,
                AddOrSave:'',  //1表示添加，2表示更新
                rules: {
                    name: [
                        { required: true, message: '请输入商品名称', trigger: 'blur' }
                    ],
                    remarks: [
                        { required: true, message: '请输入说明', trigger: 'blur' }
                    ],
                    doctor: [
                        { required: true, message: '请输入主治医生', trigger: 'blur' }
                    ],
                    casemenuid:[
                        { required: true, message: '请选择日记类别', trigger: 'change' }
                    ],
                    address: [
                        { required: true, message: '请输入医院地址', trigger: 'blur' }
                    ],
                    looknumber: [
                        { required: true, message: '请输入浏览量', trigger: 'blur' }
                    ],
                    fabulousnumber: [
                        { required: true, message: '请输入点赞量', trigger: 'blur' }
                    ],
                },
                dialogImageUrl: '',
                isShowBigImg: false,
                caseList:[],  //日记分类列表
                // 富文本框参数设置
                editorOption: {
                    modules: {
                        ImageExtend: {
                            loading: true,
                            name: 'image',
                            action: this.$api.uploadUrl+"/Images/uploadEditorImage",
                            response: (res) => {
                                return res.data
                            }
                        },
                        toolbar: {
                            container: container,
                            handlers: {
                                'image': function () {
                                    QuillWatch.emit(this.quill.id)
                                }
                            }
                        }
                    }
                },
                //规格
                inputVisible: false,
                inputValue: '',
                loading:false, //加载中
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
            onEditorChange({ editor, html, text }) {
                this.form.details = html;
            },
            //删除图片
            handleRemove(file, fileList) {
                // console.log(file.response.data);
                // console.log(file.id);
                let imgid=null;
                if(file.id!=undefined){
                    imgid=file.id
                }else{
                    imgid=file.response.data;
                }
                var params=this.$qs.stringify({
                    imgId: imgid,
                    id: this.form.id
                });
                //console.log(params);
                this.$api.post('ShopCase/delImage', params, res => {
                    console.log(res);
                    var imgArr=this.form.imglistTemp;
                    imgArr.forEach(function(item, index, arr) {
                        if(item == imgid) {
                            arr.splice(index, 1);
                        }
                    });
                    this.$message.success(res.msg);
                }, err => {
                    var imgArr=this.form.imglistTemp;
                    imgArr.forEach(function(item, index, arr) {
                        if(item == imgid) {
                            arr.splice(index, 1);
                        }
                    });
                    this.$message.error(err.msg);
                });
            },
            //查看大图
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.isShowBigImg = true;
            },
            //设置上传图片接口地址
            uploadUrl(){
                var url=this.$api.uploadUrl + "/Images/upload";
                return url
            },
            //图片上传之前
            beforeAvatarUpload(file){
                console.log(this.form.thumbnail);
                console.log(file);
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
                console.log(res);
                this.form.headerimg=res.data;
                this.form.b_image = URL.createObjectURL(file.raw);
                this.$message.success(res.msg);
            },
            //轮播图图片上传成功
            handleAvatarSuccess2(res, file){
                this.loading=false;
                console.log(res);
                this.form.imglistTemp.push(res.data);
                this.$message.success(res.msg);
                console.log(this.form.imglistTemp);
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
                this.$api.post('ShopCase/getCaseList', params, res => {
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
                //获取日记分类列表
                this.getCaseMenuList();

                this.AddOrSave=status;
                //如果是添加则把form清空
                if(status==1){
                    this.form = {
                        id: null,
                        name: null,
                        headerimg: null,
                        b_image: null,
                        imglist: null,
                        imglistUrl: [],
                        remarks: null,
                        doctor: null,
                        casemenuid: null,
                        casemenu: null,
                        address: null,
                        looknumber: null,
                        fabulousnumber: null,
                        details: null,
                        ishome: null,
                        sort: null,
                        datetime: null,
                        imglistTemp: [],
                    };
                }
                if(index!=undefined && row!=undefined){
                    this.idx = index;
                    const item = this.tableData[index];
                    this.form = {
                        id: item.id,
                        name: item.name,
                        headerimg: item.headerimg,
                        b_image: item.b_image,
                        imglist: item.imglist,
                        imglistUrl: item.imglistUrl,
                        remarks: item.remarks,
                        doctor: item.doctor,
                        casemenuid: item.casemenuid,
                        casemenu: item.casemenu,
                        address: item.address,
                        looknumber: item.looknumber,
                        fabulousnumber: item.fabulousnumber,
                        details: item.details,
                        ishome: item.ishome,
                        sort: item.sort,
                        datetime: item.datetime,
                        imglistTemp: item.imglist ? item.imglist.split(',') : [],
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
                                name: this.form.name,
                                headerimg: this.form.headerimg,
                                imglist: this.form.imglistTemp.join(','),
                                remarks: this.form.remarks,
                                doctor: this.form.doctor,
                                casemenuid: this.form.casemenuid,
                                address: this.form.address,
                                looknumber: this.form.looknumber,
                                fabulousnumber: this.form.fabulousnumber,
                                details: this.escapeStringHTML(this.form.details),
                                sort: this.form.sort,
                                ishome: this.form.ishome ? 1 : 0,
                            });
                        }else{
                            params=this.$qs.stringify({
                                id: this.form.id,
                                name: this.form.name,
                                headerimg: this.form.headerimg,
                                imglist: this.form.imglistTemp.join(','),
                                remarks: this.form.remarks,
                                doctor: this.form.doctor,
                                casemenuid: this.form.casemenuid,
                                address: this.form.address,
                                looknumber: this.form.looknumber,
                                fabulousnumber: this.form.fabulousnumber,
                                details: this.escapeStringHTML(this.form.details),
                                sort: this.form.sort,
                                ishome: this.form.ishome ? 1 : 0,
                            });
                        }
                        console.log({
                            id: this.form.id,
                            name: this.form.name,
                            headerimg: this.form.headerimg,
                            imglist: this.form.imglistTemp.join(','),
                            remarks: this.form.remarks,
                            doctor: this.form.doctor,
                            casemenuid: this.form.casemenuid,
                            address: this.form.address,
                            looknumber: this.form.looknumber,
                            fabulousnumber: this.form.fabulousnumber,
                            details: this.escapeStringHTML(this.form.details),
                            sort: this.form.sort,
                            ishome: this.form.ishome ? 1 : 0,
                        });
                        this.$api.post('ShopCase/saveCase', params, res => {
                            this.getData();
                            this.$message.success(res.msg);
                            console.log(res);

                        }, err => {
                            this.$message.error(err.msg);
                        });
                    }else{
                        console.log("请填写所需数据");
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
                console.log(params);
                // return;
                this.$api.post('ShopCase/deleteCase', params, res => {
                    this.getData();
                    this.$message.success(res.msg+res.data+"条数据");
                }, err => {
                    this.$message.error(err.msg);
                });
                this.delVisible = false;
            },
            //获取日记分类
            getCaseMenuList(){
                this.$api.post('ShopCase/getCaseMenuList', null, res => {
                    console.log(res);
                    this.caseList=res.data;
                }, err => {
                    this.$message.error(err.msg);
                });
            },
            //将转移符号替换为html
            escapeStringHTML(str) {
                if(str){
                    str = str.replace(/&lt;/g,'<');
                    str = str.replace(/&gt;/g,'>');
                    str = str.replace(/&quot;/g,'"');
                }
                return str;
            },
            submit(){
                let str=this.escapeStringHTML(this.form.details);
                console.log(str);
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
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 30px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 110px;
        margin-left: 10px;
        vertical-align: bottom;
    }
    .ql-snow .ql-editor img{
        vertical-align: top !important;
    }
</style>
