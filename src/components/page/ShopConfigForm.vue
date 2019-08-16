<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 基本配置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="170px">
                    <el-form-item label="医院名称">
                        <el-input v-model="form.hospitalname" placeholder="请输入医院名称"></el-input>
                    </el-form-item>
                    <el-form-item label="城市">
                        <el-input v-model="form.city" placeholder="请输入医院所在城市"></el-input>
                    </el-form-item>
                    <el-form-item label="医院地址">
                        <el-input v-model="form.address" placeholder="请输入医院地址"></el-input>
                    </el-form-item>
                    <el-form-item label="地理纬度">
                        <el-input v-model="form.lat" placeholder="请输入医院地理纬度"></el-input>
                    </el-form-item>
                    <el-form-item label="地理经度">
                        <el-input v-model="form.lng" placeholder="请输入医院地理经度"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话">
                        <el-input v-model="form.tel" placeholder="请输入联系电话"></el-input>
                    </el-form-item>
                    <el-form-item label="营业时间">
                        <el-input v-model="form.time" placeholder="请输入营业时间"></el-input>
                    </el-form-item>
                    <el-form-item label="医院Logo">
                        <el-upload
                                class="avatar-uploader"
                                name="image"
                                with-credentials
                                :data="{id:this.form.logo}"
                                :action="uploadUrl()"
                                :on-error="uploadError"
                                :on-success="handleAvatarSuccess1"
                                :before-upload="beforeAvatarUpload"
                                :on-progress="uploading"
                                :show-file-list="false"
                                :auto-upload="true"
                                enctype="multipart/form-data">
                            <img v-if="form.logoImgUrl" :src="form.logoImgUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <span style="color:red">建议尺寸162*162</span>
                    </el-form-item>
                    <el-form-item label="团队图片">
                        <el-upload
                                class="avatar-uploader"
                                name="image"
                                with-credentials
                                :data="{id:this.form.teamimg}"
                                :action="uploadUrl()"
                                :on-error="uploadError"
                                :on-success="handleAvatarSuccess2"
                                :before-upload="beforeAvatarUpload"
                                :on-progress="uploading"
                                :show-file-list="false"
                                :auto-upload="true"
                                enctype="multipart/form-data">
                            <img v-if="form.teamImgUrl" :src="form.teamImgUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <span style="color:red">建议尺寸1125*459</span>
                    </el-form-item>
                    <el-form-item label="医院环境">
                        <el-upload
                                class="avatar-uploader"
                                name="image"
                                with-credentials
                                :data="{id:this.form.hospitalimg}"
                                :action="uploadUrl()"
                                :on-error="uploadError"
                                :on-success="handleAvatarSuccess3"
                                :before-upload="beforeAvatarUpload"
                                :on-progress="uploading"
                                :show-file-list="false"
                                :auto-upload="true"
                                enctype="multipart/form-data">
                            <img v-if="form.hospitalImgUrl" :src="form.hospitalImgUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <span style="color:red">建议尺寸1125*672</span>
                    </el-form-item>
                    <el-form-item label="每日签到赠送积分数量">
                        <el-input v-model="form.integral" placeholder="请输入每日签到赠送积分数量"></el-input>
                    </el-form-item>
                    <el-form-item label="艺星详情">
                        <quill-editor ref="myTextEditor" style="width:1000px;" v-model="form.yestardetails" :options="editorOption"></quill-editor>
                        <!--<el-button class="editor-btn" type="primary" @click="submit">提交</el-button>-->
                    </el-form-item>


                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">确定</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

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
        name: 'baseform',
        components: {
            quillEditor
        },
        data: function(){
            return {
                form:{
                    id: '',
                    hospitalname: '',
                    logo: '',
                    logoImgUrl: '',
                    teamimg: '',
                    teamImgUrl: '',
                    hospitalimg: '',
                    hospitalImgUrl: '',
                    time: '',
                    address: '',
                    tel: '',
                    lat: '',
                    lng: '',
                    city: '',
                    integral: '',
                    yestardetails: '',
                },
                loading:false,
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
            }
        },
        created() {
            this.getData();
        },
        methods: {
            onEditorChange({ editor, html, text }) {
                this.form.details = html;
            },
            //设置上传图片接口地址
            uploadUrl(){
                var url=this.$api.uploadUrl + "/Images/upload";
                return url
            },
            //图片上传之前
            beforeAvatarUpload(file){
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
            //logo图片上传成功
            handleAvatarSuccess1(res, file){
                this.loading=false;
                console.log(res);
                this.form.logo=res.data;
                this.form.logoImgUrl = URL.createObjectURL(file.raw);
                this.$message.success(res.msg);
            },
            //团队图片上传成功
            handleAvatarSuccess2(res, file){
                this.loading=false;
                console.log(res);
                this.form.teamimg=res.data;
                this.form.teamImgUrl = URL.createObjectURL(file.raw);
                this.$message.success(res.msg);
            },
            //连锁医院图片上传成功
            handleAvatarSuccess3(res, file){
                this.loading=false;
                console.log(res);
                this.form.hospitalimg=res.data;
                this.form.hospitalImgUrl = URL.createObjectURL(file.raw);
                this.$message.success(res.msg);
            },
            //获取初始数据
            getData() {
                //不传参数要写null
                this.$api.post('ShopConfig/getConfig', null, res => {
                    this.form = res.data;
                    console.log(res);
                }, err => {
                    this.tableData = [];
                    this.$message.error(err.msg);
                });
            },
            onSubmit() {
                var params=this.$qs.stringify({
                    id: this.form.id,
                    hospitalname: this.form.hospitalname,
                    time: this.form.time,
                    address: this.form.address,
                    tel: this.form.tel,
                    lat: this.form.lat,
                    lng: this.form.lng,
                    city: this.form.city,
                    integral: this.form.integral,
                    yestardetails: this.form.yestardetails
                });
                this.$api.post('ShopConfig/saveConfig', params, res => {
                    this.$message.success(res.msg);
                    console.log(res);
                }, err => {
                    this.tableData = [];
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
    .el-upload--picture-card{
        width: 100% !important;
        height: auto !important;
    }
</style>