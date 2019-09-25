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
                <el-table-column prop="name" align="left" :show-overflow-tooltip='true' label="标题">
                </el-table-column>
                <el-table-column prop="imglistUrl" label="过去的她" width="400">
                    <template slot-scope="scope">
                        <el-popover
                                v-for="item in scope.row.imglistUrl"
                                placement="left"
                                title=""
                                width="500"
                                style="margin-right: 10px;"
                                trigger="hover">
                            <img :src="item.url" style="max-width: 100%;" />
                            <img slot="reference" :src="item.url" :alt="item.url" style="width: 100px; height: auto; height: 100px;">
                        </el-popover>
                        <!--<img :src="scope.row.b_image"  min-width="70" height="70" />-->
                    </template>
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
            <el-form ref="form" :rules="rules" :model="form" label-width="145px">
                <el-form-item label="标题" prop="name">
                    <el-input type="textarea" style="width:600px;" :rows="4" v-model="form.name" placeholder="请输入日记标题"></el-input>
                </el-form-item>
                <el-form-item label="所做项目" prop="project">
                    <el-input v-model="form.project" style="width: 50%;" placeholder="请输入所做项目"></el-input>
                </el-form-item>
                <el-form-item label="过去的她">
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
                    <span style="color:red">建议尺寸800*800</span>
                </el-form-item>
                <el-form-item label="日记类别" prop="casemenuid">
                    <el-select v-model="form.casemenuid">
                        <el-option
                                v-for="item in caseList"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id">{{item.title}}
                        </el-option>
                    </el-select>
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
                <el-form-item label="关联商品">
                    <el-checkbox-group v-model="type">
                        <el-checkbox v-for="item in goodsList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="变美过程">

                    <el-form-item class="itemDetails" v-for="(item,index) in form.processList" :key="item.id">
                        <el-form-item label="术后">
                            <!--<el-input v-model="form.sort" style="width:100px"></el-input>天-->
                            <el-input placeholder="请输入术后天数"  style="width:230px; margin-right: 20px" v-model="item.day">
                                <template slot="append">天</template>
                            </el-input>
                            <el-button type="primary" icon="el-icon-edit" @click="addProcess(index)">保存</el-button>
                            <el-button type="danger" icon="el-icon-delete" @click="delProcess(index)">删除</el-button>
                        </el-form-item>
                        <el-form-item label="上传类型">
                            <el-select v-model="item.type">
                                <el-option
                                        v-for="(item,index) in mediaList"
                                        :key="index"
                                        :label="item.title"
                                        :value="item.id">{{item.title}}
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="详情 - 术后图片" v-if="item.type=='1'">
                            <el-form-item>
                                <!--<img v-for="item in form.swiperimgList" :src="item">-->
                                <el-upload
                                        class="avatar-uploader"
                                        name="image"
                                        with-credentials
                                        list-type="picture-card"
                                        :data="{id:null}"
                                        :action="uploadUrl()"
                                        :on-error="uploadError"
                                        :on-success="(res, file, fileList)=>handleAvatarSuccess3(res, file, fileList, index)"
                                        :before-upload="beforeAvatarUpload"
                                        :on-progress="uploading"
                                        :auto-upload="true"
                                        :on-preview="handlePictureCardPreview"
                                        :on-remove="(file, fileList)=>handleRemove2(file, fileList, index)"
                                        :file-list="item.mediaListUrl"
                                        enctype="multipart/form-data">

                                    <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <el-dialog :visible.sync="isShowBigImg" :append-to-body="true" width="60%" top="10vh">
                                    <img width="100%" :src="dialogImageUrl" alt="">
                                </el-dialog>
                                <span style="color:red">建议尺寸800*800</span>
                            </el-form-item>
                        </el-form-item>
                        <el-form-item label="详情 - 术后视频" v-else-if="item.type=='2'">
                            <!-- action必选参数, 上传的地址 -->
                            <el-upload class="avatar-uploader el-upload--text" :data="{id:item.VideoId}" name="video" :action="uploadVideoUrl()" :show-file-list="false" :on-success="(res, file)=>handleVideoSuccess(res, file, index)" :before-upload="beforeUploadVideo" :on-progress="uploadVideoProcess">
                                <video v-if="item.Video !='' && videoFlag == false" :src="item.Video" class="avatar" controls="controls">您的浏览器不支持视频播放</video>
                                <i v-else-if="item.Video =='' && videoFlag == false" class="el-icon-plus avatar-uploader-icon"></i>
                                <el-progress v-if="videoFlag == true" type="circle" :percentage="videoUploadPercent" style="margin-top:30px;"></el-progress>
                            </el-upload>
                            <P class="text" style="color:red">请保证视频格式正确，且不超过50M</P>
                        </el-form-item>

                        <el-form-item label="详情 - 术后描述">
                            <el-form-item>
                                <el-input type="textarea" :rows="8" v-model="item.content" placeholder="请输入术后描述"></el-input>
                            </el-form-item>
                        </el-form-item>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="success" @click="addMoreProcess()">添加更多变美过程</el-button>
                    </el-form-item>
                    <!--<quill-editor ref="myTextEditor" v-model="form.details" :options="editorOption"></quill-editor>-->
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
                    project: '',
                    imglist: '',
                    imglistUrl: [],
                    casemenuid: '',
                    casemenu: '',
                    looknumber: '',
                    fabulousnumber: '',
                    details: '',
                    ishome: '',
                    sort: '',
                    processList:[],
                    datetime: '',

                },
                idx: -1,
                dialogVisible: false,
                AddOrSave:'',  //1表示添加，2表示更新
                rules: {
                    name: [
                        { required: true, message: '请输入日记标题', trigger: 'blur' }
                    ],
                    project: [
                        { required: true, message: '请输入所做项目', trigger: 'blur' }
                    ],
                    casemenuid:[
                        { required: true, message: '请选择日记类别', trigger: 'change' }
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
                goodsList:[],  //菜单列表
                type: [],  //被选中的菜单列表
                reverse: true,
                mediaList: [  //上传类型列表
                    { id: '1', title: '图片' },
                    { id: '2', title: '视频' },
                ],
                videoFlag: false,
                videoUploadPercent: 0,
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
            //视频上传之前
            beforeUploadVideo(file) {
                const isLt10M = file.size / 1024 / 1024  < 50;
                if (['video/mp4', 'video/ogg', 'video/flv','video/avi','video/wmv','video/rmvb'].indexOf(file.type) == -1) {
                    this.$message.error('请上传正确的视频格式');
                    return false;
                }
                if (!isLt10M) {
                    this.$message.error('上传视频大小不能超过50MB哦!');
                    return false;
                }
            },
            //视频上传进度显示
            uploadVideoProcess(event, file, fileList){
                this.videoFlag = true;
                this.videoUploadPercent = parseInt(file.percentage.toFixed(0));
            },
            //视频上传成功
            handleVideoSuccess(res, file, index) {                               //获取上传图片地址
                console.log(res);
                this.videoFlag = false;
                this.videoUploadPercent = 0;
                if(res.success){
                    this.form.processList[index].VideoId = res.data.id;
                    this.form.processList[index].Video = res.data.videoUrl;
                    this.$message.success(res.msg);
                }else{
                    this.$message.error('视频上传失败，请重新上传！');
                }
            },
            //保存变美过程
            addProcess(index){
                let item=this.form.processList[index];
                let medialist=null;
                if(item.type == '1'){
                    medialist=item.medialist.join(',');
                    item.VideoId="";
                }else{
                    medialist=item.VideoId;
                    item.medialist=[];
                }
                let params=this.$qs.stringify({
                    id: item.id ? item.id : null,
                    caseid: this.form.id ? this.form.id : null,
                    day: item.day,
                    type: item.type,
                    medialist: medialist,
                    content: item.content,
                });
                console.log({
                    id: item.id ? item.id : null,
                    caseid: this.form.id ? this.form.id : null,
                    day: item.day,
                    type: item.type,
                    medialist: medialist,
                    content: item.content,
                });
                this.$api.post('ShopCase/addOrSaveProcess', params, res => {
                    this.$message.success(res.msg);
                    console.log(res);
                    item.id=res.data;

                }, err => {
                    this.$message.error(err.msg);
                });
            },
            //删除变美过程
            delProcess(index){
                let temp=this.form.processList[index];
                if(!temp.id){
                    var tempArr=this.form.processList;
                    tempArr.forEach(function(item, index, arr) {
                        if(item.id == temp.id) {
                            arr.splice(index, 1);
                        }
                    });
                }else{
                    let params=this.$qs.stringify({
                        id: temp.id,
                    });
                    this.$api.post('ShopCase/delProcess', params, res => {
                        this.$message.success(res.msg);
                        console.log(res);
                        var tempArr=this.form.processList;
                        tempArr.forEach(function(item, index, arr) {
                            if(item.id == temp.id) {
                                arr.splice(index, 1);
                            }
                        });
                    }, err => {
                        this.$message.error(err.msg);
                    });
                }

            },
            //删除"过的的她"图片
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
                console.log(file);
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
            //删除"变美过程"图片
            handleRemove2(file, fileList, index) {
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
                    id: this.form.processList[index].id
                });
                // console.log(imgid);
                // console.log(this.form.processList[index].mediaListUrl);
                // return;
                this.$api.post('ShopCase/delProcessImage', params, res => {
                    var imgArr=this.form.processList[index].medialist;
                    imgArr.forEach(function(item, index, arr) {
                        if(item == imgid) {
                            arr.splice(index, 1);
                        }
                    });
                    this.form.processList[index].mediaListUrl.forEach(function(item, index, arr) {
                        if(item.id == imgid) {
                            arr.splice(index, 1);
                        }
                    });
                    this.$message.success(res.msg);
                }, err => {
                    var imgArr=this.form.processList[index].medialist;
                    imgArr.forEach(function(item, index, arr) {
                        if(item == imgid) {
                            arr.splice(index, 1);
                        }
                    });
                    this.form.processList[index].mediaListUrl.forEach(function(item, index, arr) {
                        if(item.id == imgid) {
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
            //设置上传视频接口地址
            uploadVideoUrl(){
                var url=this.$api.uploadUrl + "/Images/uploadVideo";
                return url
            },
            //图片上传之前
            beforeAvatarUpload(file){
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
            //轮播图图片上传成功
            handleAvatarSuccess2(res, file){
                console.log(res);
                this.loading=false;
                this.form.imglistTemp.push(res.data);
                this.$message.success(res.msg);
            },
            //变美过程上传图片成功
            handleAvatarSuccess3(res, file, fileList, index){
                this.loading=false;
                this.form.processList[index].medialist.push(res.data);
                let temp={
                  id: res.data,
                  url: res.url
                };
                this.form.processList[index].mediaListUrl.push(temp);
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
                    console.log(res.data);
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
                //获取商品列表
                this.getGoodsList();
                this.AddOrSave=status;
                //如果是添加则把form清空
                if(status==1){
                    this.form = {
                        id: null,
                        name: null,
                        project: null,
                        imglist: null,
                        imglistUrl: [],
                        casemenuid: null,
                        casemenu: null,
                        looknumber: null,
                        fabulousnumber: null,
                        details: null,
                        ishome: null,
                        sort: null,
                        datetime: null,
                        imglistTemp: [],
                        processList: [],
                    };
                    this.type=[];
                }
                if(index!=undefined && row!=undefined){
                    this.idx = index;
                    const item = this.tableData[index];
                    this.form = {
                        id: item.id,
                        name: item.name,
                        project: item.project,
                        imglist: item.imglist,
                        imglistUrl: item.imglistUrl,
                        casemenuid: item.casemenuid,
                        casemenu: item.casemenu,
                        looknumber: item.looknumber,
                        fabulousnumber: item.fabulousnumber,
                        details: item.details,
                        ishome: item.ishome,
                        sort: item.sort,
                        datetime: item.datetime,
                        imglistTemp: item.imglist ? item.imglist.split(',') : [],
                        processList: item.processList
                    };
                    this.type=[];
                    for(var i=0;i<row.goodList.length;i++){
                        this.type.push(row.goodList[i]['id']);
                    }
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
                            //将所有变美过程id记录
                            let processids=[];
                            this.form.processList.forEach(function(item, index, arr) {
                                processids.push(item.id);
                            });
                            params=this.$qs.stringify({
                                name: this.form.name,
                                project: this.form.project,
                                imglist: this.form.imglistTemp.join(','),
                                casemenuid: this.form.casemenuid,
                                looknumber: this.form.looknumber,
                                fabulousnumber: this.form.fabulousnumber,
                                shopids: this.type.join(','),
                                processids: processids.join(','),
                                sort: this.form.sort,
                                ishome: this.form.ishome ? 1 : 0,
                            });
                        }else{
                            params=this.$qs.stringify({
                                id: this.form.id,
                                name: this.form.name,
                                project: this.form.project,
                                imglist: this.form.imglistTemp.join(','),
                                casemenuid: this.form.casemenuid,
                                looknumber: this.form.looknumber,
                                fabulousnumber: this.form.fabulousnumber,
                                shopids: this.type.join(','),
                                processids: null,
                                sort: this.form.sort,
                                ishome: this.form.ishome ? 1 : 0,
                            });
                        }
                        let processids=[];
                        this.form.processList.forEach(function(item, index, arr) {
                            processids.push(item.id);
                        });
                        // console.log({
                        //     id: this.form.id,
                        //     name: this.form.name,
                        //     imglist: this.form.imglistTemp.join(','),
                        //     casemenuid: this.form.casemenuid,
                        //     looknumber: this.form.looknumber,
                        //     fabulousnumber: this.form.fabulousnumber,
                        //     shopids: this.type.join(','),
                        //     processids: processids.join(','),
                        //     sort: this.form.sort,
                        //     ishome: this.form.ishome ? 1 : 0,
                        // });
                        // return;
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
            //获取商品列表
            getGoodsList(){
                this.$api.post('ShopCoupon/getGoodsList', null, res => {
                    console.log(res);
                    this.goodsList=res.data;
                }, err => {
                    this.$message.error(err.msg);
                });
            },
            //添加更多变美过程
            addMoreProcess(){
                let temp={
                    day: null,
                    type: '1',
                    medialist: [],
                    mediaListUrl: [],
                    content: null,
                    Video: '',
                    VideoId: null,
                };
                this.form.processList.push(temp);
                console.log(this.form.processList);
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
    .itemDetails{
        padding: 18px;
        border: 1px dashed #409EFF
    }
</style>
