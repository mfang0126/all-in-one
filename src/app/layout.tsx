'use client';

import { AudioOutlined, CompressOutlined, FileTextOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import 'antd/dist/reset.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './globals.css';
import { AntdProvider } from './providers';
import { useState } from 'react';

const { Content, Footer, Sider } = Layout;

const inter = Inter({ subsets: ['latin'] });

const items = [
  {
    key: '/',
    icon: <FileTextOutlined />,
    label: <Link href='/'>Speech-to-Text</Link>
  },
  {
    key: '/text-to-speech',
    icon: <AudioOutlined />,
    label: <Link href='/text-to-speech'>Text-to-Speech</Link>
  },
  {
    key: '/compare',
    icon: <CompressOutlined />,
    label: <Link href='/compare'>Compare Services</Link>
  },
  {
    key: '/pronunciation',
    icon: <AudioOutlined />,
    label: <Link href='/pronunciation'>Pronunciation</Link>
  },
  {
    key: '/docs/pronunciation',
    icon: <FileTextOutlined />,
    label: <Link href='/docs/pronunciation'>API Docs</Link>
  }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <html lang='en'>
      <body
        className={inter.className}
        style={{ margin: 0, padding: 0 }}
      >
        <AntdProvider>
          <Layout className='min-h-screen '>
            <Sider
              collapsible
              breakpoint='lg'
              collapsed={collapsed}
              onCollapse={(value) => setCollapsed(value)}
            >
              <div className='h-8 mx-4 my-4 bg-white/20 flex items-center justify-center text-white text-base font-bold mt-5'>
                <span className='hidden lg:inline'>Transcription AI</span>
                <span className='lg:hidden'>LT</span>
              </div>
              <Menu
                theme='dark'
                mode='inline'
                selectedKeys={[pathname]}
                items={items}
              />
            </Sider>
            <Layout>
              <Content style={{ margin: '24px 16px 0' }}>{children}</Content>
              <Footer style={{ textAlign: 'center' }}>Lighttune ©{new Date().getFullYear()}</Footer>
            </Layout>
          </Layout>
        </AntdProvider>
      </body>
    </html>
  );
}
