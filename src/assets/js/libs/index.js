import echo from './echo'

function lazyImg () {
  echo.init({
    offset: 0, // 可视区域多少像素被加载
    throttle: 0 // 设置图片延迟加载时间
  })
}

// 单点登录验证
function safeUser (_this) {
  _this.$store.dispatch('user/safeUser', {
    success: (res) => {
      if (res.code !== 200) {
        _this.$router.replace('/login')
      }
    }
  })
}

export default {
  lazyImg,
  safeUser
}
