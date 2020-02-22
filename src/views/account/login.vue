<template>
    <div class="page-container">
        <div class="login-bg">
            <div class="login">
                <div class="login-title">
                    <p class="zh">业务运营支撑平台</p>
                    <p class="en">Business&Operating Support System</p>
                </div>
                <Card :bordered="false" class="card-login">
                    <div class="login-logo">
                        <img :src="logoSrc" alt="qwe">
                    </div>
                    <div class="login-form">
                        <Form ref="formLoginRef" :model="formLogin" :rules="rules">
                            <FormItem prop="userName">
                                <Input type="text" size="large" v-model="formLogin.userName" placeholder="请输入用户名" clearable>
                                    <span slot="prepend">
                                        <Icon :size="16" type="person"></Icon>
                                    </span>
                                </Input>
                            </FormItem>
                            <FormItem prop="passWord">
                                <Input type="password" size="large" v-model="formLogin.passWord" placeholder="请输入密码" clearable>
                                    <span slot="prepend">
                                        <Icon :size="14" type="locked"></Icon>
                                    </span>
                                </Input>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" :loading="btnLoading" @click="handleLogin" size="large" long>登 录</Button>
                            </FormItem>
                        </Form>
                    </div>
                </Card>
            </div>
        </div>
    </div>
</template>

<script>
import Auth from "@/utils/auth";
import logoSrc from "@/assets/images/logo.png";
import crypto from "@/utils/crypto";
export default {
    data() {
        return {
            logoSrc: logoSrc,
            formLogin: {
                userName: null,
                passWord: null
            },
            rules: {
                userName: [
                    {
                        required: true,
                        message: "请输入用户名",
                        trigger: "blur"
                    }
                ],
                passWord: [
                    {
                        required: true,
                        message: "请输入密码",
                        trigger: "blur"
                    }
                ]
            },
            btnLoading: false
        };
    },
    computed: {

    },
    methods: {
        handleLogin() {
            const vm = this
            vm.$refs.formLoginRef.validate(valid => {
                if (valid) {
                    vm.btnLoading = true;
                    let params = Object.assign({}, this.formLogin);
                    // 加密
                    // params.passWord = crypto.MD5(params.passWord);
                    vm.$store
                        .dispatch("login", params)
                        .then(res => {
                            vm.btnLoading = false;
                            vm.$router.replace({ path: "/" });
                        })
                        .catch(error => {
                            vm.btnLoading = false;
                            vm.$Message.destroy();
                            vm.$Message.error(error);
                        });

                    // 模拟登录
                    // setTimeout(() => {
                    //     this.btnLoading = false;
                    //     Auth.setToken("cals");
                    //     this.$router.push({ path: "/" });
                    // }, 2000);
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        }
    }
};
</script>

<style lang="scss">
.login-bg {
    position: relative;
    width: 100%;
    height: 100%;
    background: url("../../assets/images/bg-login.jpg") no-repeat center / cover;
    .login {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -80%);
    }
    .login-title {
        text-align: center;
        color: #fff;
        .zh {
            font-size: 24px;
        }
        .en {
            font-size: 16px;
        }
    }
}
.card-login {
    margin-top: 20px;
    position: relative;
    padding-left: 240px;
    .login-logo {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 240px;
        height: 68px;
        margin: auto 0;
    }
    .login-logo > img {
        display: block;
        height: 100%;
        margin: 0 auto;
    }
    .login-form {
        width: 280px;
        padding-top: 15px;
        padding-right: 15px;
    }
}
</style>
