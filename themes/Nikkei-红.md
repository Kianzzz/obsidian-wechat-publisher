
```CSS
/* 全局属性 */
.note-to-mp {
  max-width: 650px;
  margin: 0 auto;
  padding: 20px 12px;
  font-family: "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", sans-serif;
  font-size: 15px;
  line-height: 1.6 !important;
  color: #1a1a1a !important;
  background-color: #fff !important;
  word-wrap: break-word;
  word-break: break-word;
}

/* --- 标题部分 --- */
.note-to-mp h1 {
  font-size: 24px;
  font-weight: 700;
  color: #000 !important;
  line-height: 1.3 !important;
  margin: 25px 0 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #000;
}

.note-to-mp h2 {
  font-size: 18px;
  font-weight: 700;
  color: #c41230 !important;
  line-height: 1.4 !important;
  margin: 20px 0 12px;
  padding-left: 10px;
  border-left: 3px solid #c41230;
}

.note-to-mp h3 {
  font-size: 16px;
  font-weight: 600;
  color: #000 !important;
  line-height: 1.4 !important;
  margin: 18px 0 10px;
  padding: 4px 8px;
  background-color: #f5f5f5 !important;
}

.note-to-mp h4 {
  font-size: 15px;
  font-weight: 600;
  color: #333 !important;
  line-height: 1.5 !important;
  margin: 15px 0 8px;
  text-decoration: underline;
  text-decoration-color: #c41230;
  text-underline-offset: 3px;
}

.note-to-mp h5 {
  font-size: 14px;
  font-weight: 600;
  color: #666 !important;
  line-height: 1.5 !important;
  margin: 12px 0 6px;
}

.note-to-mp h6 {
  font-size: 13px;
  font-weight: 600;
  color: #999 !important;
  line-height: 1.5 !important;
  margin: 10px 0 5px;
}

/* 段落 */
.note-to-mp p {
  margin: 12px 0 !important;
  line-height: 1.6 !important;
  color: #1a1a1a !important;
  text-align: justify;
}

/* 加粗 */
.note-to-mp strong {
  font-weight: 700;
  color: #000 !important;
  background-color: #fff3f3 !important;
  padding: 0 2px;
}

/* 斜体 */
.note-to-mp em {
  font-style: normal;
  color: #c41230 !important;
  font-weight: 600;
}

/* 下划线 */
.note-to-mp u {
  text-decoration: none;
  border-bottom: 1px solid #c41230;
  padding-bottom: 2px;
}

/* 链接 */
.note-to-mp a {
  color: #0066cc !important;
  text-decoration: none;
  border-bottom: 1px solid #0066cc;
  word-break: break-all;
}

/* --- 列表 --- */
.note-to-mp ul, .note-to-mp ol {
  margin: 15px 0;
  padding-left: 28px;
}
.note-to-mp ul { list-style-type: disc; }
.note-to-mp ol { list-style-type: decimal; }

.note-to-mp li {
  margin: 6px 0;
  line-height: 1.6 !important;
  color: #1a1a1a !important;
}

/* --- 引用 --- */
.note-to-mp blockquote {
  margin: 20px 0;
  padding: 12px 15px;
  background-color: transparent !important;
  border-left: 2px solid #c41230;
  border-right: 2px solid #c41230;
  color: #1a1a1a !important;
  font-size: 14px;
  line-height: 1.6 !important;
  font-style: normal;
  max-width: 100%;
}

/* --- 代码块部分 --- */

/* 1. 行内代码 */
.note-to-mp code {
  font-family: "Courier New", monospace, sans-serif;
  font-size: 13px;
  padding: 2px 4px;
  background-color: #f5f5f5 !important;
  color: #c41230 !important;
}

/* 2. 代码块外层容器 */
.note-to-mp .code-section {
  margin: 20px 0;
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

/* 3. pre 标签样式重置 */
.note-to-mp .code-section pre {
  margin: 0;
  padding: 0;
  background: transparent !important;
  border: none;
  line-height: 1.4 !important;
  white-space: pre-wrap !important;
  word-wrap: break-word !important;
  word-break: break-all !important;
}

/* 4. 代码块内部文字 */
.note-to-mp .code-section code,
.note-to-mp .code-section span {
  background-color: transparent !important;
  color: #e0e6ed !important;
  padding: 0;
  border-radius: 0;
  display: inline;
  font-family: "Courier New", monospace, sans-serif;
  font-size: 13px;
}

/* 分割线 */
.note-to-mp hr {
  margin: 30px 0;
  border: none;
  height: 1px;
  background-color: #000 !important;
}

/* 图片 */
.note-to-mp img {
  max-width: 100%;
  max-height: 400px !important;
  height: auto;
  display: block;
  margin: 20px auto;
  border: 1px solid #ddd;
}

/* 表格 */
.note-to-mp table { width: 100%; margin: 20px 0; border-collapse: collapse; font-size: 14px; border: 1px solid #000; }
.note-to-mp th { background-color: #c41230 !important; color: #fff !important; padding: 8px 10px; text-align: left; font-weight: 600; border: 1px solid #c41230; }
.note-to-mp td { padding: 6px 10px; border: 1px solid #ddd; color: #1a1a1a !important; background-color: #fff !important; }
.note-to-mp tr { border-bottom: 1px solid #ddd; }
```
