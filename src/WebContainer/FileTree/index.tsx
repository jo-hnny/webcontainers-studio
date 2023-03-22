import { FileOutlined, FolderOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Card, Layout, Tree } from 'antd';
import type { AntTreeNodeProps, DataNode } from 'antd/es/tree';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { WebContainerNP } from '../constants';
import {
  createDir,
  createFile,
  readFileSystem,
  renameFile,
  rm,
  webcontainerInstancePromise,
} from '../core';
import { ContextMenu } from './ContextMenu';

const { Sider } = Layout;

interface IFileTreeProps {
  onSelectedFileChange: (filePath: string) => void;
}

export function FileTree({ onSelectedFileChange }: IFileTreeProps) {
  const sideRef = useRef<HTMLDivElement>(null);
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [visible, setVisible] = useState(false);

  const [treeData, setTreeData] = useState<DataNode[]>([]);

  useLayoutEffect(() => {
    sideRef.current!.addEventListener('contextmenu', e => {
      e.preventDefault();
      setAnchorPoint({ x: e.clientX, y: e.clientY });
      setVisible(true);
    });
  }, []);

  const selectedNode = useMemo(
    () => findNodeByKey(selectedKey, treeData),
    [treeData, findNodeByKey, selectedKey]
  );

  useEffect(() => {
    if (selectedNode?.isLeaf) {
      const path = getNodePath(selectedNode.key as string, treeData);

      onSelectedFileChange(path);
    } else {
      onSelectedFileChange('');
    }
  }, [selectedNode]);

  async function handleCLick(
    actionType: WebContainerNP.ActionTypeEnum,
    name: string
  ) {
    switch (actionType) {
      case WebContainerNP.ActionTypeEnum.Create_File: {
        const newFile: DataNode = {
          key: uuid(),
          title: name,
          isLeaf: true,
        };

        if (!selectedKey) {
          setTreeData(pre => [...pre, newFile]);

          const filePath = newFile.title;

          createFile(filePath as string);
        } else {
          selectedNode?.children!.push(newFile);

          setTreeData([...treeData]);

          const filePath = getNodePath(newFile.key as string, treeData);

          createFile(filePath);
        }

        break;
      }

      case WebContainerNP.ActionTypeEnum.Create_Dir: {
        const newFolder: DataNode = {
          key: uuid(),
          title: name,
          isLeaf: false,
          children: [],
        };

        if (!selectedNode) {
          setTreeData(pre => [...pre, newFolder]);

          createDir(newFolder.title as string);
        } else {
          selectedNode?.children!.push(newFolder);

          setTreeData([...treeData]);

          const path = getNodePath(newFolder.key as string, treeData);

          createDir(path);
        }

        break;
      }

      case WebContainerNP.ActionTypeEnum.Del: {
        const parent = findParentNodeByKey(selectedKey);

        if (parent?.title === 'root') {
          setTreeData(pre => pre.filter(item => item.key !== selectedKey));

          rm(selectedNode?.title as string);
        }

        if (parent?.children) {
          const path = getNodePath(selectedKey, treeData);
          rm(path);

          parent.children = parent.children.filter(
            item => item.key !== selectedKey
          );

          setTreeData(pre => [...pre]);
        }

        break;
      }

      case WebContainerNP.ActionTypeEnum.Rename: {
        const path = getNodePath(selectedKey, treeData);

        renameFile(path, name);

        selectedNode!.title = name;

        setTreeData(pre => [...pre]);

        break;
      }

      default:
        break;
    }
  }

  function findNodeByKey(key: string, data: DataNode[]): DataNode | null {
    for (const node of data) {
      if (node?.key === key) return node;

      const rsp = findNodeByKey(key, node?.children ?? []);

      if (rsp) return rsp;
    }

    return null;
  }

  function findParentNodeByKey(
    key: string,
    data: DataNode = { key: 0, title: 'root', children: treeData }
  ): DataNode | null {
    const children = data?.children ?? [];

    for (const node of children) {
      if (node?.key === key) return data;

      const rsp = findParentNodeByKey(key, node);

      if (rsp) return rsp;
    }

    return null;
  }

  function getNodePath(
    key: string,
    data: DataNode[],
    path: string = ''
  ): string {
    for (const node of data) {
      if (node?.key === key) return `${path}/${node.title}`;

      const rsp = getNodePath(
        key,
        node?.children ?? [],
        `${path}/${node.title}`
      );

      if (rsp.length) return rsp;
    }

    return '';
  }

  async function syncFileSystemToUI() {
    const rsp = await readFileSystem();

    setTreeData(rsp);
  }

  useEffect(() => {
    async function sync() {
      await webcontainerInstancePromise;

      syncFileSystemToUI();
    }

    sync();
  }, []);

  return (
    <Sider
      theme="light"
      ref={sideRef}
      width={350}
      style={{ maxHeight: '100%', overflow: 'scroll' }}
    >
      <Card
        style={{ height: '100%' }}
        title="文件"
        extra={
          <>
            <Button icon={<SyncOutlined />} onClick={syncFileSystemToUI} />
            {/* <Button icon={<SaveOutlined />} onClick={saveFileSystemTree} /> */}
          </>
        }
      >
        <Tree
          showIcon
          icon={({ isLeaf }: AntTreeNodeProps) =>
            isLeaf ? <FileOutlined /> : <FolderOutlined />
          }
          treeData={treeData}
          selectedKeys={[selectedKey]}
          onSelect={([key]) => {
            setSelectedKey(key as string);
          }}
        />
      </Card>

      <ContextMenu
        anchorPoint={anchorPoint}
        targetType={
          selectedNode
            ? selectedNode.isLeaf
              ? WebContainerNP.TargetTypeEnum.File
              : WebContainerNP.TargetTypeEnum.Dir
            : WebContainerNP.TargetTypeEnum.None
        }
        isOpen={visible}
        onClose={() => setVisible(false)}
        onClick={handleCLick}
      />
    </Sider>
  );
}
