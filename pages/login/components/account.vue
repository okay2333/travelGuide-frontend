<script setup>
  // 获取生命周期
  import { onLoad } from '@dcloudio/uni-app'

  import userApi from '@/apis/user.js'
  // 导入状态数据
  import { useUserStore } from '@/stores/users'
  // 引入ref 或 reactive
  import { ref, reactive } from 'vue'

  // 调用useUserStore 来获取 store中的数据
  const userStore = useUserStore()
  // 表单元素的ref属性
  const accountForm = ref()

  // 待跳转的页面路径
  const redirectURL = ref('')
  // 获取页面跳转方式
  const routeType = ref('')

  // 定义表单中的数据
  const formData = reactive({
    account: 'alice123',
    password: '123456',
  })
  const acountRules = reactive({
    account: {
      rules: [
        { required: true, errorMessage: '请输入登录账号' },
        { pattern: '^[a-zA-Z0-9]{6,8}$', errorMessage: '登录账号格式不正确' },
      ],
    },
    password: {
      rules: [
        { required: true, errorMessage: '请输入登录密码' },
        { pattern: '^\\d{6}$', errorMessage: '登录密码格式不正确' },
      ],
    },
  })

  // 获取地址中的参数
  onLoad((query) => {
    redirectURL.value = query.redirectURL
    routeType.value = query.routeType
  })
  // 提交表单数据
  async function onSubmitForm() {
    // 对表单得数据进行验证
    try {
      console.log('login页面---')
      // 当验证成功后所返回的数据为表单中的数据， 这些数据用于表单提交
      const formData = await accountForm.value.validate()
      const { code, data } = await userApi.login(formData)
      // 在Pinia中允许直接对数据(state)进行修改
      if (code != 200) return uni.utils.toast('登录失败请重试！')
      userStore.token = data

      if (routeType.value == null && routeType.value == null) {
        redirectURL.value = '/pages/task/index'
        routeType.value = 'switchTab'
      }

      // todo 这里看一下
      console.log('kanyixia', redirectURL.value)
      uni[routeType.value]({
        url: redirectURL.value,
      })
      console.log('kanyixia2', redirectURL.value)
      console.log(userStore.token)
      // 当登录成功后需要跳转到原本的页面
    } catch (err) {
      // 当验证失败提示失败的原因
      console.log(err)
    }
  }
</script>
<template>
  <uni-forms
    class="login-form"
    ref="accountForm"
    :rules="acountRules"
    :model="formData"
  >
    <uni-forms-item name="account">
      <input
        type="text"
        v-model="formData.account"
        placeholder="请输入账号"
        class="uni-input-input"
        placeholder-style="color: #818181"
      />
    </uni-forms-item>
    <uni-forms-item name="password">
      <input
        type="text"
        v-model="formData.password"
        placeholder="请输入密码"
        class="uni-input-input"
        placeholder-style="color: #818181"
      />
    </uni-forms-item>
    <button @click="onSubmitForm" class="submit-button">登录</button>
  </uni-forms>
</template>

<style lang="scss" scoped>
  @import './styles.scss';
</style>
