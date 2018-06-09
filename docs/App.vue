<template>
  <div id="app">
    <fork-link :repo="repo" />
    <header>
      <img src="./assets/logo.png">
      <h1>{{pkg.name}} <span>{{pkg.version}}</span></h1>
      <p>{{pkg.description}}</p>
      <div class="text-center" style="padding: 15px;">
        <a :href="repo" target="_blank">
          <m-button type="info" size="large" round>
            <img src="https://avatars1.githubusercontent.com/u/11366654?s=40&v=4" class="user-img" alt="mengdu">
            Github
          </m-button>
        </a>
        &nbsp;
        <a href="#example"><m-button type="warning" size="large" plain round>Example</m-button></a>
      </div>
    </header>
    <div style="margin-top: 50px"></div>
    <m-quill-editor 
      :width="quill.width"
      :has-border="quill.border"
      v-model="quill.content"
      :sync-output="quill.syncOutput"
      :theme="quill.theme"
      :disabled="quill.disabled"
      :fullscreen="quill.full"
      @upload="upload"
      ></m-quill-editor>
    <p></p>
    <main class="doc-block">
      <readme></readme>
    </main>
    <layout-footer></layout-footer>
  </div>
</template>

<script>
import LayoutFooter from './components/footer'
import ForkLink from './components/fork-link'
import Readme from '~/README.md'
import pkg from '~/package.json'

export default {
  name: 'App',
  components: {
    LayoutFooter,
    ForkLink,
    Readme
  },
  data () {
    return {
      pkg,
      quill: {
        width: 800,
        border: false,
        content: 'wellcome ~',
        syncOutput: false,
        theme: 'snow', //bubble snow
        disabled: false,
        full: false,
        toolbar: [
          [{ 'header': 1 }, { 'header': 2 }],
          ['bold', 'italic', 'underline', 'strike', 'link']
        ]
      }
    }
  },
  computed: {
    repo () {
      return pkg.repository.url.replace(/git\+/, '')
    }
  },
  methods: {
    upload (file, insert) {
      console.log(file)
      insert('https://avatars0.githubusercontent.com/u/11366654?s=460&v=4', 'center')
    }
  }
}
</script>
