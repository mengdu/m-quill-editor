<template>
  <div class="quill-editor"
    ref="quillEditorBox"
    :class="{
      'quill-full': isFull,
      'quill-no-border': noBorder
    }"
    :style="{
      width: isFull ? '' : width + 'px',
      height: height + 'px',
      zIndex: isFull ? zIndex : ''
    }"
    >
    <div ref="quillEditor"></div>
    <input type="file" ref="image" style="display: none">
  </div>
</template>
<script type="text/javascript">
/* eslint-disable */
import Quill from 'quill'
import toolbar from './toolbar'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'
import 'quill/dist/quill.snow.css'
import icons from './icons'
import { ImageResize } from './modules/image-resize'
import './quill-editor.css'

Quill.register('modules/imageResize', ImageResize)

var Delta = Quill.import('delta')
// import hljs from 'highlight.js'
window.Delta = Delta
// window.hljs = hljs
export default {
  name: 'quill-editor',
  data () {
    return {
      content: '',
      isFull: this.full,
      quill: null,
      Quill: Quill
    }
  },
  props: {
    value: String,
    width: Number,
    height: Number,
    placeholder: String,
    toolbar: Object,
    delta: Object,
    zIndex: String,
    full: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      default: 'snow'
    },
    noBorder: Boolean
  },
  methods: {
    init () {
      var quillEditor = this.$refs.quillEditor
      var quill = new Quill(quillEditor, {
        debug: 'warn',
        modules: {
          formula: false,
          syntax: false,
          history: {
            delay: 1000,
            userOnly: true
          },
          imageResize: {
            displaySize: true
          },
          toolbar: toolbar || toolbar
        },
        placeholder: this.placeholder || '这里输入内容...',
        // bounds: '#editor-container',
        theme: this.theme // bubble / snow
      })
      if (this.theme === 'snow') {
        this.initFullBtn()
      }
      this.quill = quill
      quill.on('text-change', (delta) => {
        this.content = quill.container.firstChild.innerHTML
        this.$emit('input', quill.container.firstChild.innerHTML)
      })
      var imgBtn = this.$refs.image
      imgBtn.addEventListener('change', () => {
        // console.log(imgBtn)
        if (imgBtn.files.length > 0) {
          this.$emit('upload', imgBtn.files[0], this.insertImage)
        }
      })
      let btns = quill.getModule('toolbar')
      btns.addHandler('image', () => {
        imgBtn.click()
      })
      this.$emit('init', quill)
      // ql-toolbar
      window.bar = this.$refs.quillEditorBox
      window.quill = quill
    },
    initFullBtn () {
      var childs = this.$refs.quillEditorBox.children
      var fullBtn = document.createElement('SPAN')
      fullBtn.className = 'ql-formats'
      fullBtn.style = 'float: right;margin-right: 0;'
      var that = this
      function setSizeBtn () {
        var icon = ''
        if (that.isFull) {
          icon = icons.minsize
        } else {
          icon = icons.maxsize
        }
        fullBtn.innerHTML = '<button type="button" class="ql-fullscreen">' + icon + '</button>'
      }
      setSizeBtn()
      fullBtn.addEventListener('click', () => {
        this.isFull = !this.isFull
        setSizeBtn()
      }, false)
      for (let i in childs) {
        if (childs[i].className.indexOf('ql-toolbar') > -1) {
          childs[i].append(fullBtn)
          break
        }
      }
    },
    insertImage (src, align) {
      var range = this.quill.getSelection()
      // this.quill.insertEmbed(range.index, 'text', '\n')
      var t = this.quill.insertEmbed(range.index, 'image', src)
      this.quill.insertEmbed(range.index + 2, 'text', '\n')
      // this.quill.formatText(range.index + 1, 4, 'align', align || 'center')
      console.log(t)
    }
  },
  watch: {
    full (val) {
      this.isFull = val
    },
    value (val, oldVal) {
      if (this.quill && val !== this.content) {
        // console.log('change', val, val === this.content)
        this.quill.container.firstChild.innerHTML = val
      }
    }
  },
  mounted () {
    console.log('quill load')
    this.init()
  }
}
</script>
