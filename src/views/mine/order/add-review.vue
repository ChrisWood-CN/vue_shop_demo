<template>
  <div class="add-review">
    <nav-header class="header" title="评价"></nav-header>
    <div class='main'>
      <ul class='service' v-for="(item,index) in reviewServices" :key="index">
        <li>{{item.title}}</li>
        <li>
          <div :class="{stars:true, active:item2.active}" v-for="(item2,index2) in item.scores" :key="index2"
               @click="SET_REVIEW_SCORE({index:index,index2:index2,score:item2.value})"></div>
        </li>
      </ul>
      <div class='content-wrap'>
        <textarea placeholder="来分享你的消费感受吧!" v-model="content"></textarea>
      </div>
      <div class="submit" @click="submit()">提交</div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapState, mapMutations } from 'vuex'

  export default {
    name: 'add-review',
    data () {
      return {
        content: ''
      }
    },
    created () {
      this.$utils.safeUser(this)
      this.gid = this.$route.query.gid ? this.$route.query.gid : ''
      this.ordernum = this.$route.query.ordernum ? this.$route.query.ordernum : ''
      this.isSubmit = true
      this.getReviewService()
    },
    mounted () {
      document.title = this.$route.meta.title
    },
    computed: {
      ...mapState({
        reviewServices: state => state.order.reviewServices,
        uid: state => state.user.uid
      })
    },
    methods: {
      ...mapActions({
        getReviewService: 'order/getReviewService',
        addReview: 'order/addReview'
      }),
      ...mapMutations({
        SET_REVIEW_SCORE: 'order/SET_REVIEW_SCORE'
      }),
      _toast (msg) {
        this.$createToast({
          txt: msg,
          type: 'txt'
        })
      },
      submit () {
        if (this.content.match(/^\s*$/)) {
          // Toast('请输入评价内容')
          this._toast('请输入评价内容')
          return
        }

        if (this.isSubmit) {
          this.isSubmit = false
          const rsdata = []
          if (this.reviewServices.length > 0) {
            for (let i = 0; i < this.reviewServices.length; i++) {
              rsdata.push({
                gid: this.gid,
                myid: this.uid,
                rsid: this.reviewServices[i].rsid,
                score: this.reviewServices[i].score
              })
            }
          }
          this.addReview({
            gid: this.gid,
            content: this.content,
            ordernum: this.ordernum,
            rsdata: JSON.stringify(rsdata),
            success: (res) => {
              if (res.code === 200) {
                this.$createToast({
                  txt: '添加成功!',
                  time: 2000,
                  onTimeout: () => {
                    this.$router.go(-1)
                  }
                }).show()
              } else {
                // Toast(res.data)
                this._toast(res.data)
              }
            }
          })
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@assets/css/variable.styl'
  .add-review
    width: 100%
    min-height: 100vh
    background-color: $color-background
    font-size $font-size-medium

    .main
      width: 100%
      margin-top 20px

      .service
        width: 90%
        margin 0 auto
        height 40px
        border-bottom: 1px solid $color-text-ll
        display: flex
        align-items: center

        li:nth-child(1)
          margin-left: 3%
          margin-right: 15%

        li:nth-child(2)
          display: flex

        .stars
          width: 0.4rem
          height: 0.4rem
          background-image: url("../../../assets/images/user/orders/stars1.png")
          background-size: 100%
          background-repeat: no-repeat
          background-position: center
          margin-right: 0.3rem

        .stars.active
          background-image: url("../../../assets/images/user/orders/stars2.png")
          background-size: 100%
          background-repeat: no-repeat
          background-position: center

      .content-wrap
        width: 90%
        margin 0 auto
        height: 200px
        text-align: center
        overflow hidden

        textarea
          width: 100%
          height 90%
          padding 10px
          font-size: $font-size-small
          margin-top: 20px
          outline: none
          border: 1px solid $color-text-ll
          border-radius 5px
          resize: none
          box-sizing border-box

      .submit
        width: 80%
        height: 30px
        background-color: $color-theme
        color: $color-background
        text-align: center
        line-height: 30px
        border-radius: 5px
        margin: 20px auto 0
</style>
