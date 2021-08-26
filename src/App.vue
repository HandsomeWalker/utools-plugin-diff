<template>
  <div class="box">
    <el-row :gutter="5" style="margin-bottom: 10px">
      <el-col :span="6">
        <el-select
          v-model="mode"
          filterable
          placeholder="选择文本模式"
          @change="changeMode"
          size="small"
          style="width: 100%;"
        >
          <el-option
            v-for="item in modes"
            :key="item.name"
            :value="item.mode"
            >{{ item.name }}</el-option
          >
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-select
          v-model="theme"
          filterable
          placeholder="选择主题"
          @change="changeTheme"
          size="small"
          style="width: 100%;"
        >
          <el-option v-for="(item, idx) in themes" :key="idx" :value="item">{{
            item
          }}</el-option>
        </el-select>
      </el-col>
      <el-col :span="12">
        <el-button type="primary" size="small" @click="goPrevDiff">上一处差异</el-button>
        <el-button type="primary" size="small" @click="goNextDiff">下一处差异</el-button>
        <el-button type="danger" size="small" @click="clear">清空</el-button>
      </el-col>
    </el-row>
    <div class="view" ref="view"></div>
  </div>
</template>

<script>
import "codemirror/addon/merge/merge.css";
import CodeMirror from "codemirror";
import DiffMatchPatch from "diff-match-patch";
import modes from "./config/modes";
import themes from "./config/themes";

window.diff_match_patch = DiffMatchPatch;
window.DIFF_DELETE = -1;
window.DIFF_INSERT = 1;
window.DIFF_EQUAL = 0;

export default {
  data() {
    return {
      cm: null,
      mode: "",
      theme: "",
      modes,
      themes,
    };
  },
  mounted() {
    utools.onPluginEnter(({ type, payload }) => {
      if (type === 'over') {
        this.initUI("", payload);
      } else {
        this.clear();
      }
    });
  },
  // mounted() {
  //   let t1 = '';
  //   let t2 = '';
  //   for (let i = 0; i < 100; i++) {
  //     t1 += 't1\n';
  //     t2 += 't2\n';
  //   }
  //   this.initUI(t1, t2);
  // },
  methods: {
    initUI(value, orig2) {
      this.mode = utools.dbStorage.getItem('mode') || "";
      this.theme = utools.dbStorage.getItem('theme') || "";
      const target = this.$refs.view;
      target.innerHTML = "";
      this.cm = CodeMirror.MergeView(target, {
        theme: this.theme,
        mode: this.mode,
        scrollbarStyle: 'simple',
        highlightSelectionMatches: { showToken: /\w/, annotatescrollbar: true },
        chunkClassLocation: ["gutter"],
        value: value,
        origLeft: orig2,
        lineNumbers: true,
        highlightDifferences: true,
        connect: "align",
        collapseIdentical: true,
        allowEditingOriginals: true,
        autofocus: true,
        viewportMargin: Infinity,
      });
      // this.cm.editor().on('change', this.MarkDiffScrollBar.bind(this, this.cm));
      // this.MarkDiffScrollBar(this.cm);
      // console.log(this.cm);
    },
    changeMode() {
      this.cm.editor().setOption("mode", this.mode);
      this.cm.leftOriginal().setOption("mode", this.mode);
      utools.dbStorage.setItem('mode', this.mode);
    },
    changeTheme() {
      this.cm.editor().setOption("theme", this.theme);
      this.cm.leftOriginal().setOption("theme", this.theme);
      utools.dbStorage.setItem('theme', this.theme);
    },
    goPrevDiff() {
      this.cm.editor().execCommand("goPrevDiff");
      this.cm.leftOriginal().execCommand("goPrevDiff");
    },
    goNextDiff() {
      this.cm.editor().execCommand("goNextDiff");
      this.cm.leftOriginal().execCommand("goNextDiff");
    },
    clear() {
      this.initUI("", "");
    },
    // MarkDiffScrollBar(diffView) {
    //   try {
    //     diffView.leftOriginal().setOption("scrollButtonHeight", 18);
    //     diffView.editor().setOption("scrollButtonHeight", 18);

    //     var leftAnnotations = diffView
    //       .leftOriginal()
    //       .annotateScrollbar("marker");
    //     var rightAnnotations = diffView.editor().annotateScrollbar("marker");

    //     var leftchunks = diffView.leftChunks();
    //     var leftranges = [];
    //     for (var i = 0; i < leftchunks.length; i++) {
    //       var rangeEnd = leftchunks[i].editTo - 1;
    //       if (
    //         leftchunks[i].editTo <
    //           diffView.leftOriginal().getDoc().lineCount() &&
    //         i < 4
    //       ) {
    //         rangeEnd = rangeEnd + 1;
    //       }
    //       console.log(leftchunks[i].editFrom)
    //       leftranges.push({
    //         from: { line: leftchunks[i].editFrom },
    //         to: { line: rangeEnd },
    //       });
    //     }
    //     leftAnnotations.update(leftranges);

    //     var rightchunks = diffView.leftChunks();
    //     var rightranges = [];
    //     for (var i = 0; i < rightchunks.length; i++) {
    //       var rangeEnd = rightchunks[i].editTo - 1;
    //       if (
    //         rightchunks[i].editTo < diffView.editor().getDoc().lineCount() &&
    //         i < 4
    //       ) {
    //         rangeEnd = rangeEnd + 1;
    //       }
    //       rightranges.push({
    //         from: { line: rightchunks[i].editFrom },
    //         to: { line: rangeEnd },
    //       });
    //     }
    //     rightAnnotations.update(rightranges);
    //   } catch (error) {
    //     console.error(
    //       "Some kind of error internally in codemirror - caught to prevent script freeze"
    //     );
    //     console.log("Caught inside MarkDiffScrollBar");
    //     console.error(error);
    //   }
    // },
  },
};
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
}
html * {
  box-sizing: border-box;
}
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* color: #2c3e50; */
  margin-top: 60px;
}
.box {
  height: 100%;
  padding: 10px;
  padding-bottom: 0;
}
.view {
  height: calc(100% - 50px);
}
.CodeMirror-merge,
.CodeMirror-merge .CodeMirror,
.CodeMirror-merge .CodeMirror-merge-pane {
  height: 100%;
}
.marker {
  background: rgba(0, 0, 255, 100);
}
</style>
