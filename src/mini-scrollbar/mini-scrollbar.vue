<template>
<div class="m-scroll-box">
  <div class="m-scroll-body" ref="body"
    @scroll="scroll"
    @resize="resize"
    >
    <slot></slot>
  </div>
  <div class="m-scrollbar-y" data-thumbbox
    :style="{
      right: toCssVal(right),
      left: toCssVal(left),
      width: ~~size + 'px'
    }"
    >
    <div class="m-scroll-thumb"
      @mousedown.stop="yIsMove = true"
      v-move::thumbbox.y="handleMoveY"
      :style="{
        height: yThumbSize + '%',
        transform: 'translateY('+ scrollTop +'px)',
      }"
      ></div>
  </div>
  <div class="m-scrollbar-x" data-thumbbox
    :style="{
      bottom: toCssVal(bottom),
      top: toCssVal(top),
      height: ~~size + 'px'
    }"
    >
    <div class="m-scroll-thumb"
      @mousedown.stop="xIsMove = true"
      v-move::thumbbox.x="handleMoveX"
      :style="{
        width: xThumbSize + '%',
        transform: 'translateX('+ scrollLeft +'px)'
      }"
      ></div>
  </div>
</div>
</template>
<script type="text/javascript">
import move from './move'
export default {
  name: 'mini-scrollbar',
  directives: {
    move: move.directive
  },
  data () {
    return {
      body: null,
      width: 0,
      height: 0,
      scrollWidth: 0,
      scrollHeight: 0,
      scrollTop: 0,
      scrollLeft: 0,
      xIsMove: false,
      yIsMove: false
    }
  },
  props: {
    left: String,
    right: String,
    top: String,
    bottom: String,
    size: [String, Number]
  },
  computed: {
    xThumbSize () {
      if (!this.body) return 0
      return this.width / this.scrollWidth * 100
    },
    yThumbSize () {
      if (!this.body) return 0
      return this.height / this.scrollHeight * 100
    }
  },
  methods: {
    init () {
      this.width = this.$el.offsetWidth
      this.height = this.$el.offsetHeight
      this.scrollWidth = this.body.scrollWidth
      this.scrollHeight = this.body.scrollHeight
    },
    scroll (e) {
      // console.log('scroll')
      if (!this.yIsMove) {
        this.scrollTop = this.body.scrollTop / this.body.scrollHeight * this.height
      }
      if (!this.xIsMove) {
        this.scrollLeft = this.body.scrollLeft / this.body.scrollWidth * this.width
      }
      this.$emit('scroll', {
        scrollTop: this.scrollTop,
        scrollLeft: this.scrollLeft,
        height: this.height,
        width: this.width,
        e
      })
    },
    resize () {
      this.init()
    },
    handleMoveY (e) {
      var y = e.bound.top - e.boxBound.top
      this.body.scrollTop = y / this.height * this.body.scrollHeight
    },
    handleMoveX (e) {
      var x = e.bound.left - e.boxBound.left
      this.body.scrollLeft = x / this.width * this.body.scrollWidth
    },
    toCssVal (val) {
      return val === 'auto' ? 'auto' : val + 'px'
    }
  },
  mounted () {
    this.body = this.$refs.body
    this.init()
    document.addEventListener('mouseup', () => {
      this.yIsMove = false
      this.xIsMove = false
    }, false)
  }
}
</script>
<style type="text/css">
  .m-scroll-box{
    position: relative;
    overflow: hidden;
  }
  .m-scroll-box .m-scroll-body{
    height: calc(100% + 17px);
    width: calc(100% + 17px);
    /*
    padding-right: 17px;
    padding-bottom: 17px;
    */
    margin-bottom: -17px;
    margin-right: -17px;
    overflow: auto;
    box-sizing: border-box;
  }
  .m-scroll-box .m-scrollbar-y,
  .m-scroll-box .m-scrollbar-x{
    position: absolute;
    border-radius: 4px;
    background-color: rgba(151,168,190, 0);
  }
  .m-scroll-box .m-scrollbar-y{
    width: 8px;
    height: 100%;
    top: 0;
    right: 2px;
  }
  .m-scroll-box .m-scrollbar-x{
    width: 100%;
    height: 8px;
    bottom: 2px;
  }
  .m-scrollbar-y .m-scroll-thumb,
  .m-scrollbar-x .m-scroll-thumb{
    position: relative;
    background-color: rgba(151,168,190,.1);
    cursor: pointer;
    border-radius: inherit;
    transition: background-color .3s;
  }
  .m-scrollbar-y .m-scroll-thumb{
    width: 100%;
    /*height: 50%;*/
  }
  .m-scrollbar-x .m-scroll-thumb{
    /*width: 50%;*/
    height: 100%;
  }
  .m-scroll-box:hover .m-scroll-thumb{
    background-color: rgba(151,168,190,.3);
  }
/*  .m-scroll-box .m-scrollbar-y:hover .m-scroll-thumb,
  .m-scroll-box .m-scrollbar-x:hover .m-scroll-thumb{
    background-color: rgba(151,168,190,.5);
  }*/
  .m-scroll-box .m-scrollbar-y .m-scroll-thumb:active,
  .m-scroll-box .m-scrollbar-x .m-scroll-thumb:active,
  .m-scroll-box .m-scrollbar-y .m-scroll-thumb:hover,
  .m-scroll-box .m-scrollbar-x .m-scroll-thumb:hover{
    background-color: rgba(151,168,190,.8);
  }

</style>
