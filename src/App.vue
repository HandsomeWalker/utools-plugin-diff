<template>
  <div class="box">
    <div class="view" ref="view"></div>
    <div class="btn" @click="clear">清空</div>
  </div>
</template>

<script>
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/merge/merge.js";
import "codemirror/addon/merge/merge.css";
import DiffMatchPatch from "diff-match-patch";
window.diff_match_patch = DiffMatchPatch;
window.DIFF_DELETE = -1;
window.DIFF_INSERT = 1;
window.DIFF_EQUAL = 0;
export default {
  mounted() {
    utools.onPluginEnter(({ type, payload }) => {
      if (type === 'over') {
        this.initUI("", payload);
      } else {
        this.clear();
      }
    });
  },
  methods: {
    initUI(value, orig2) {
      const target = this.$refs.view;
      target.innerHTML = "";
      CodeMirror.MergeView(target, {
        value: value,
        origLeft: null,
        orig: orig2,
        lineNumbers: true,
        mode: "text/html",
        highlightDifferences: true,
        connect: null,
        collapseIdentical: false,
        allowEditingOriginals: true,
        autofocus: true,
        viewportMargin: Infinity
      });
    },
    clear() {
      this.initUI("", "");
    }
  },
};
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.box, .view {
  height: calc(100% - 15px);
}
.CodeMirror-merge, .CodeMirror-merge .CodeMirror, .CodeMirror-merge .CodeMirror-merge-pane {
  height: 100%;
}
.btn {
  box-sizing: border-box;
  width: 50px;
  height: 30px;
  line-height: 30px;
  border: 1px solid;
  cursor: pointer;
  text-align: center;
  background-color: rgb(207, 118, 118);
  color: #fff;
}
</style>
