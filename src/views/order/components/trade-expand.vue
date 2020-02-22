<template>
    <div>
        <Row class="expand-row">
            <Col span="6" class="item">
                <span class="expand-key">手机号: </span>
                <span class="expand-value">{{ row.phoneNum }}</span>
            </Col>
            <Col span="6" class="item">
                <span class="expand-key">支付方式: </span>
                <span class="expand-value">{{ payType }}</span>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        props: {
            row: Object
        },
        data() {
            return {

            }
        },
        computed: {
            payType() {
                switch (this.row.payType) {
                    case "1":
                        return "支付宝"
                        break;
                    case "2":
                        return "微信"
                        break;
                    case "3":
                        return "qwe"
                        break;
                    case "4":
                        return "银联"
                        break;
                    default:
                        return "暂无"
                        break;
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
.expand-row > .item {
    margin-bottom: 10px
}
</style>
