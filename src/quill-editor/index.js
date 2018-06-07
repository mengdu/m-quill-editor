import QuillEditor from './quill-editor'

QuillEditor.install = function (Vue) {
  Vue.component(QuillEditor.name, QuillEditor)
}

export default QuillEditor
