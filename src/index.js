import MQuillEditor from './quill-editor'

MQuillEditor.install = function (Vue) {
  Vue.component(MQuillEditor.name, MQuillEditor)
}

export {
  MQuillEditor as default,
  MQuillEditor
}
