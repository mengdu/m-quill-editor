<template>
  <div class="quill-editor"
    ref="quillEditorBox"
    :class="{
      'quill-fullscreen': isFullscreen,
      'quill-no-border': !hasBorder,
      'disabled': disabled
    }"
    :style="{
      width: isFullscreen ? '' : width + 'px',
      height: isFullscreen ? '' : height + 'px',
      zIndex: zIndex
    }"
    >
    <div ref="quillEditor"></div>
    <input type="file" :accept="imgAccept" ref="img-input" style="display: none">
  </div>
</template>
<script type="text/javascript">
import Quill from 'quill'
import toolbar from './toolbar'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'
import 'quill/dist/quill.snow.css'
import icons from './icons'
import { ImageResize } from './modules/image-resize'
import './quill-editor.css'

Quill.register('modules/imageResize', ImageResize)

export default {
  name: 'MQuillEditor',
  props: {
    value: String,
    width: Number,
    height: Number,
    placeholder: String,
    toolbar: [Object, Array],
    zIndex: [String, Number],
    fullscreen: {
      type: Boolean,
      default: false
    },
    syncOutput: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      default: 'snow'
    },
    hasBorder: Boolean,
    disabled: Boolean,
    imgAccept: String
  },
  data () {
    return {
      content: '',
      isFullscreen: this.fullscreen,
      quill: null,
      Quill: Quill
    }
  },
  watch: {
    fullscreen (val) {
      this.isFullscreen = val
    },
    value (val, oldVal) {
      if (val !== this.content) {
        this.setContent(val)
      }
    },
    disabled (val, oldVal) {
      this.setDisabled(val)
    }
  },
  methods: {
    createQuill () {
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
          toolbar: this.toolbar || toolbar
        },
        placeholder: this.placeholder || '这里输入内容...',
        // bounds: '#editor-container',
        theme: this.theme // bubble / snow
      })

      if (this.theme === 'snow') {
        this.initFullBtn()
      }

      this.quill = quill

      // init content
      this.setContent(this.value)

      // init img control
      this.initImgInput()

      quill.on('text-change', (delta) => {
        this.content = this.getContent()
        // console.log('text-change', this.content)
        if (this.syncOutput) {
          this.$emit('input', this.content)
        }
        this.$emit('change', this.quill)
      })

      quill.on('selection-change', range => {
        if (!range) {
          this.$emit('blur', this.quill)
        } else {
          this.$emit('focus', this.quill)
        }
      })

      this.$emit('init', quill, this)
    },
    initFullBtn () {
      var childs = this.$refs.quillEditorBox.children
      var fullBtn = document.createElement('SPAN')
      fullBtn.className = 'ql-formats ql-resize'
      fullBtn.style = 'float: right;margin-right: 0;'
      var that = this
      function setSizeBtn () {
        var icon = ''
        if (that.isFullscreen) {
          icon = icons.minsize
        } else {
          icon = icons.maxsize
        }
        fullBtn.innerHTML = '<button type="button" class="ql-fullscreen">' + icon + '</button>'
      }
      setSizeBtn()
      fullBtn.addEventListener('click', () => {
        this.isFullscreen = !this.isFullscreen
        setSizeBtn()
      }, false)
      for (let i in childs) {
        if (childs[i].className.indexOf('ql-toolbar') > -1) {
          childs[i].append(fullBtn)
          break
        }
      }
    },
    initImgInput () {
      var imgInput = this.$refs['img-input']
      imgInput.addEventListener('change', () => {
        if (imgInput.files.length > 0) {
          this.$emit('upload', imgInput.files[0], this.insertImage)
        }
      })
      let btns = this.quill.getModule('toolbar')
      btns.addHandler('image', () => {
        imgInput.click()
      })
    },
    insertImage (src, align) {
      var range = this.quill.getSelection()
      console.log(range)
      this.quill.insertEmbed(range.index, 'text', '\n')
      this.quill.insertEmbed(range.index + 1, 'image', src)
      this.quill.insertEmbed(range.index + 2, 'text', '\n')
      this.quill.formatText(range.index + 1, 2, 'align', align || 'center')
    },
    setContent (val) {
      // this.quill.container.firstChild.innerHTML = val
      this.quill.clipboard.dangerouslyPasteHTML(val)
      return this.quill
    },
    setDisabled (val) {
      this.quill.enable(!val)
    },
    getContent (val) {
      return this.quill.container.firstChild.innerHTML
    }
  },
  mounted () {
    this.createQuill()
  }
}
</script>
