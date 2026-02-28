
```CSS
/* 全局属性 */
.note-to-mp {
  max-width: 620px;
  margin: 0 auto;
  padding: 20px 24px;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  line-height: 21px !important;
  color: #6e6e73 !important;
  background-color: #fbfbfd !important;
  text-align: left !important;
  word-wrap: break-word;
  word-break: break-word;
}

/* --- 标题部分 --- */
.note-to-mp h1 {
  font-size: 18px;
  font-weight: 400;
  color: #1d1d1f !important;
  line-height: 24px !important;
  margin: 28px 0 12px;
  letter-spacing: -0.03em;
}

.note-to-mp h2 {
  font-size: 18px;
  font-weight: 400;
  color: #1d1d1f !important;
  line-height: 24px !important;
  margin: 28px 0 12px;
  letter-spacing: -0.02em;
}

.note-to-mp h3 {
  font-size: 18px;
  font-weight: 400;
  color: #1d1d1f !important;
  line-height: 24px !important;
  margin: 28px 0 10px;
  letter-spacing: -0.01em;
}

.note-to-mp h4 {
  font-size: 18px;
  font-weight: 400;
  color: #1d1d1f !important;
  line-height: 24px !important;
  margin: 28px 0 10px;
}

.note-to-mp h5 {
  font-size: 18px;
  font-weight: 400;
  color: #1d1d1f !important;
  line-height: 24px !important;
  margin: 28px 0 10px;
}

.note-to-mp h6 {
  font-size: 18px;
  font-weight: 400;
  color: #1d1d1f !important;
  line-height: 24px !important;
  margin: 28px 0 10px;
}

/* 段落 */
.note-to-mp p {
  margin: 18px 0 !important;
  line-height: 24px !important;
  color: #6e6e73 !important;
  font-weight: 300;
  text-align: left;
}

/* 加粗 */
.note-to-mp strong {
  font-weight: 400;
  color: #1d1d1f !important;
}

/* 斜体 */
.note-to-mp em {
  font-style: normal;
  color: #6e6e73 !important;
  font-weight: 300;
}

/* 下划线 */
.note-to-mp u {
  text-decoration: none;
  border-bottom: 1px solid #86868b;
  padding-bottom: 2px;
}

/* 链接 */
.note-to-mp a {
  color: #06c !important;
  text-decoration: none;
  font-weight: 400;
  word-break: break-all;
}

/* --- 列表优化版 --- */
.note-to-mp ul, .note-to-mp ol {
  margin: 18px 0;
  padding-left: 22px;
}
.note-to-mp ul { list-style-type: disc; }
.note-to-mp ol { list-style-type: decimal; }

.note-to-mp li {
  margin: 8px 0;
  line-height: 24px !important;
  color: #6e6e73 !important;
  font-weight: 300;
  padding-left: 0;
  position: relative;
}

/* --- 引用优化版 --- */
.note-to-mp blockquote {
  margin: 18px 0;
  padding: 12px 16px;
  background-color: #f5f5f7 !important;
  border-left: 4px solid #424245;
  border-radius: 4px;

  color: #6e6e73 !important;
  font-size: 14px;
  line-height: 1.6 !important;
  font-weight: 400;
  text-align: left;
  font-style: normal;
  max-width: 100%;
}

/* --- 代码块部分 --- */

/* 1. 行内代码 (文字中间的短代码) */
.note-to-mp code {
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace, sans-serif;
  font-size: 14px;
  padding: 2px 6px;
  background-color: #f5f5f7 !important;
  color: #6e6e73 !important;
  border-radius: 6px;
  font-weight: 400;
}

/* 2. 代码块外层容器 (Mac窗口风格) */
.note-to-mp .code-section {
  margin: 24px 0;
  padding: 45px 20px 20px;
  background-color: #282c34 !important;
  border-radius: 8px;
  overflow-x: auto;

  background-image:
    radial-gradient(circle, #ff5f56 6px, transparent 7px),
    radial-gradient(circle, #ffbd2e 6px, transparent 7px),
    radial-gradient(circle, #27c93f 6px, transparent 7px),
    linear-gradient(#21252b, #21252b);
  background-size: 14px 14px, 14px 14px, 14px 14px, 100% 36px;
  background-position: 15px 12px, 35px 12px, 55px 12px, 0 0;
  background-repeat: no-repeat;

  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  border: none;
}

.note-to-mp .code-section ul { display: none; }

/* 3. pre 标签样式重置 (自动换行) */
.note-to-mp .code-section pre {
  margin: 0;
  padding: 0;
  background: transparent !important;
  border: none;
  line-height: 1.6 !important;
  white-space: pre-wrap !important;
  word-wrap: break-word !important;
  word-break: break-all !important;
}

/* 4. 代码块内部文字 (强制高亮颜色) */
.note-to-mp .code-section code,
.note-to-mp .code-section span {
  background-color: transparent !important;
  color: #e0e6ed !important;
  padding: 0;
  border-radius: 0;
  display: inline;
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace, sans-serif;
  font-size: 14px;
}

/* 图片 */
.note-to-mp img {
  max-width: 100%;
  max-height: 600px !important;
  height: auto;
  display: block;
  margin: 20px auto 41px;
  border-radius: 15px;
  box-shadow: 0 15px 30px -6px rgba(33, 150, 243, 0.25), 0 9px 18px -9px rgba(0, 0, 0, 0.3), 0 -6px 18px -4px rgba(0, 0, 0, 0.025);
}
.note-to-mp img:hover { transform: translateY(-8px); box-shadow: 0 20px 40px -8px rgba(33, 150, 243, 0.3), 0 12px 24px -12px rgba(0, 0, 0, 0.35); }

/* 表格 */
.note-to-mp table { width: 100%; margin: 18px 0; border-collapse: collapse; font-size: 15px; }
.note-to-mp th { background-color: #f5f5f7 !important; padding: 16px 20px; text-align: left; border: none; font-weight: 500; color: #1d1d1f !important; }
.note-to-mp td { padding: 16px 20px; border: none; border-top: 1px solid #d2d2d7; color: #6e6e73 !important; font-weight: 300; }
```
