import Editor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

import { useEffect, useMemo, useState } from 'react';
import { readFile, writeFile } from '../core';

window.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new JsonWorker();
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new CssWorker();
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new HtmlWorker();
    }
    if (label === 'typescript' || label === 'javascript') {
      return new TsWorker();
    }
    return new EditorWorker();
  },
};

monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  jsx: monaco.languages.typescript.JsxEmit.React,
});

loader.config({ monaco });

loader.init().then(/* ... */);

interface ICodeEditorProps {
  filePath: string;
}

export function CodeEditor({ filePath }: ICodeEditorProps) {
  const [content, setContent] = useState('');

  useEffect(() => {
    async function readFile2content() {
      const fileContent = await readFile(filePath);

      setContent(fileContent);
    }

    if (filePath) {
      readFile2content();
    } else {
      setContent('');
    }
  }, [filePath]);

  const language = useMemo(() => {
    const stuff = filePath.split('.').pop() || 'default';

    const languageMap: Record<string, string> = {
      js: 'javascript',
      mjs: 'javascript',
      css: 'css',
      ts: 'typescript',
      tsx: 'typescript',
      html: 'html',
      json: 'json',
      default: 'javascript',
    };

    return languageMap[stuff];
  }, [filePath]);

  return (
    <Editor
      theme="vs-dark"
      language={language}
      value={content}
      options={{
        minimap: { enabled: true },
        fontSize: 16,
        readOnly: !filePath,
      }}
      onChange={value => {
        if (filePath) {
          writeFile(filePath, value || '');
          setContent(value || '');
        }
      }}
    />
  );
}
