import { WebContainer } from '@webcontainer/api';
import { message } from 'antd';
import { DataNode } from 'antd/es/tree';
import { v4 as uuid } from 'uuid';

let webcontainerInstance: WebContainer;

export const webcontainerInstancePromise = new Promise<WebContainer>(
  resolve => {
    message.open({ type: 'loading', content: 'Loading...' });

    window.addEventListener('load', async () => {
      webcontainerInstance = await WebContainer.boot();

      message.destroy();
      resolve(webcontainerInstance);
    });
  }
);

export function createDir(path: string) {
  return webcontainerInstance.fs.mkdir(path, { recursive: true });
}

export function writeFile(path: string, content: string | Uint8Array) {
  return webcontainerInstance.fs.writeFile(path, content);
}

export function createFile(path: string) {
  return writeFile(path, '');
}

export function rm(path: string) {
  return webcontainerInstance.fs.rm(path, { force: true, recursive: true });
}

export function readFile(path: string) {
  return webcontainerInstance.fs.readFile(path);
}

export async function renameFile(path: string, name: string) {
  const content = await readFile(path);
  await rm(path);

  const newPath = [...path.split('/').slice(0, -1), name].join('/');

  await writeFile(newPath, content);
}

export async function readFileSystem(path = '/'): Promise<DataNode[]> {
  const dirs = await webcontainerInstance.fs.readdir(path, {
    withFileTypes: true,
  });

  return Promise.all(
    dirs.map(async item => ({
      key: uuid(),
      title: item.name,
      isLeaf: item.isFile(),
      children: item.isDirectory()
        ? await readFileSystem(`${path}/${item.name}`)
        : undefined,
    }))
  );
}
