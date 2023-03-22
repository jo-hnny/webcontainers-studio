import { Col, Layout, Row } from 'antd';
import { useState } from 'react';
import { BrowserPanel } from './BrowserPanel';
import { CodeEditor } from './CodeEditor';
import { FileTree } from './FileTree';
import { TerminalPanel } from './TerminalPanel';

const { Content, Footer } = Layout;

export function WebContainerPanel() {
  const [filePath, setFilePath] = useState('');

  return (
    <Layout style={{ height: '100%' }}>
      <FileTree onSelectedFileChange={setFilePath} />
      <Layout>
        <Content>
          <Row style={{ height: '100%' }}>
            <Col span={16} style={{ height: '100%' }}>
              <CodeEditor filePath={filePath} />
            </Col>

            <Col span={8} style={{ height: '100%' }}>
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
