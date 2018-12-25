<template>
  <span v-if="type===1">{{time}}</span>
  <div class="time-down" v-else-if="type===2">
    {{msg}}
    <span v-if="d>0">{{d}}</span>
    <span>{{h}}</span>
    :
    <span>{{m}}</span>
    :
    <span>{{s}}</span>
  </div>
</template>

<script>
  export default {
    name: 'TimeDown',
    data () {
      return {
        time: '',
        flag: false,
        msg: '',
        d: 0,
        h: 0,
        m: 0,
        s: 0
      }
    },
    created () {
      this.timeDown()
    },
    mounted () {
      let time = setInterval(() => {
        if (this.flag === true) {
          clearInterval(time)
        }
        this.timeDown()
      }, 500)
    },
    props: {
      type: {
        type: Number
      },
      now: {
        type: Number
      },
      startTime: {
        type: Number
      },
      endTime: {
        type: Number
      }
    },
    methods: {
      timeDown () {
        const startTime = new Date(this.startTime).getTime()
        const endTime = new Date(this.endTime).getTime()
        const nowTime = new Date().getTime()
        let leftTime
        if (startTime > nowTime) {
          this.msg = '距离开始'
          leftTime = parseInt(Math.abs(nowTime - startTime) / 1000)
        } else if (endTime > nowTime && startTime < nowTime) {
          this.msg = '距离结束'
          leftTime = parseInt(Math.abs(endTime - nowTime) / 1000)
        } else {
          this.$emit('time-end')
          this.flag = true
        }
        this.d = parseInt(leftTime / (24 * 60 * 60))
        this.h = this.formate(parseInt(leftTime / (60 * 60) % 24))
        this.m = this.formate(parseInt(leftTime / 60 % 60))
        this.s = this.formate(parseInt(leftTime % 60))
        if (this.d > 0) {
          this.time = `${this.msg}:${this.d}天${this.h}小时${this.m}分${this.s}秒`
        } else {
          this.time = `${this.msg}:${this.h}小时${this.m}分${this.s}秒`
        }
      },
      formate (time) {
        if (time >= 10) {
          return time
        } else {
          return `0${time}`
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .time-down {
    span {
      display: inline-block;
      margin: 0 2px;
      background-color: #443b3b;
      width: 22px;
      text-align: center;
      border-radius: 2px;
      line-height: 24px;
    }
  }


</style>
