'use client';

import { AudioOutlined, CompressOutlined, FileTextOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import 'antd/dist/reset.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './globals.css';
import { AntdProvider } from './providers';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

const { Content, Footer, Sider } = Layout;

const inter = Inter({ subsets: ['latin'] });

const getMenuItems = (userType: string | null) => {
  // API users only see the API docs
  if (userType === 'api') {
    return [
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
  }

  // Admin users see all items
  return [
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const storedUserType = localStorage.getItem('userType');
    setUserType(storedUserType);
  }, []);

  // Don't show the layout on the login page
  if (pathname === '/login') {
    return (
      <html lang='en'>
        <body className={inter.className}>
          <AntdProvider>{children}</AntdProvider>
        </body>
      </html>
    );
  }

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
                items={[
                  ...getMenuItems(userType),
                  {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: 'Logout',
                    onClick: logout,
                    className: 'mt-auto'
                  }
                ]}
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
