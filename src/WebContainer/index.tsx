import { Col, Layout, Row } from 'antd';
import { useState } from 'react';
import { BrowserPanel } from './BrowserPanel';
import { CodeEditor } from './CodeEditor';
import { TerminalPanel } from './TerminalPanel';
import { FileTree } from './FileTree';

const { Content, Footer } = Layout;

export function WebContainerPanel() {
  const [filePath, setFilePath] = useState('');

  return (
    <Layout style={{ height: '100%' }}>
      <FileTree onSelectedFileChange={setFilePath} />
      <Layout>
        <Content>
          <Row style={{ height: '100%' }}>
            <Col span={16}>
              <CodeEditor filePath={filePath} />
            </Col>

            <Col span={8}>
              <BrowserPanel />
            </Col>
          </Row>
        </Content>

        <Footer style={{ padding: 0 }}>
          <TerminalPanel />
        </Footer>
      </Layout>
    </Layout>
  );
}
