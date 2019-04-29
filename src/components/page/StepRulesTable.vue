<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 规则管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <quill-editor ref="myTextEditor" v-model="content" :options="editorOption"></quill-editor>
            <el-button class="editor-btn" type="primary" @click="submit">提交</el-button>
        </div>
    </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';
    export default {
        name: 'editor',
        data: function(){
            return {
                content: '',
                editorOption: {
                    placeholder: '请输入内容'
                }
            }
        },
        components: {
            quillEditor
        },
        created(){
            this.getData();
        },
        methods: {
            onEditorChange({ editor, html, text }) {
                this.content = html;
            },
            getData() {
                this.$api.post('StepRules/getRulesList', null, res => {
                    console.log(res);
                    this.content=this.escapeStringHTML(res.data.list.content);
                    // console.log(this.content);
                }, err => {
                    this.$message.error(err.msg);
                });
            },
            escapeStringHTML(str) {
                str = str.replace(/&lt;/g,'<');
                str = str.replace(/&gt;/g,'>');
                return str;
            },
            submit(){
                // console.log(this.content);
                var params=this.$qs.stringify({
                    content: this.escapeStringHTML(this.content),
                });
                // console.log(this.content);
                // return;
                this.$api.post('StepRules/saveRules', params, res => {
                    console.log(res);
                    this.getData();
                    this.$message.success(res.msg);
                }, err => {
                    this.$message.error(err.msg);
                });
                // this.$message.success('提交成功！');
            }
        }
    }
</script>
<style scoped>
    .editor-btn{
        margin-top: 20px;
    }
</style>