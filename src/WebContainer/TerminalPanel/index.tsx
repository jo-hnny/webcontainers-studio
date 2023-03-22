import { useLayoutEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { WebglAddon } from 'xterm-addon-webgl';
import 'xterm/css/xterm.css';
import { webcontainerInstancePromise } from '../core';

let terminal: Terminal;
const fitAddon = new FitAddon();
const webLinksAddon = new WebLinksAddon();
const webglAddon = new WebglAddon();

export function TerminalPanel() {
  const terminalRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    async function init() {
      if (terminalRef.current && !terminal) {
        terminal = new Terminal({
          convertEol: true,
          cursorBlink: true,
          tabStopWidth: 2,
        });

        terminal.loadAddon(fitAddon);
        terminal.loadAddon(webLinksAddon);
        terminal.loadAddon(webglAddon);

        terminal.open(terminalRef.current);

        const webcontainerInstance = await webcontainerInstancePromise;
        const shell = await webcontainerInstance.spawn('jsh', {
          terminal: {
            cols: terminal.cols,
            rows: terminal.rows,
          },
        });

        function handleResize() {
          fitAddon.fit();
          shell.resize({
            cols: terminal.cols,
            rows: terminal.rows,
          });
        }

        handleResize();

        window.addEventListener('resize', handleResize);

        shell.output.pipeTo(
          new WritableStream({
            write(data) {
              terminal.write(data);
            },
          })
        );

        const input = shell.input.getWriter();

        terminal.onData(data => {
          input.write(data);
        });
      }
    }

    init();
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: 10,
        backgroundColor: '#000',
      }}
      ref={terminalRef}
    />
  );
}
