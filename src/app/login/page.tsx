'use client';

import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useRouter } from 'next/navigation';
import { ContentBox } from '@/components/ContentBox';

interface LoginForm {
  username: string;
  password: string;
}

// Hardcoded credentials with user types
const VALID_CREDENTIALS = {
  admin: {
    username: 'adminuser',
    password: 'admin2025',
    type: 'admin'
  },
  api: {
    username: 'apiuser',
    password: 'api2025',
    type: 'api'
  }
};

const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};path=/;expires=${expires.toUTCString()}`;
};

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async (values: LoginForm) => {
    setLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const adminUser = VALID_CREDENTIALS.admin;
    const apiUser = VALID_CREDENTIALS.api;

    let userType = null;

    if (values.username === adminUser.username && values.password === adminUser.password) {
      userType = 'admin';
    } else if (values.username === apiUser.username && values.password === apiUser.password) {
      userType = 'api';
    }

    if (userType) {
      messageApi.success('Login successful.');
      // Store login state and user type in both localStorage and cookies
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userType', userType);
      setCookie('isLoggedIn', 'true', 7); // Cookie expires in 7 days
      setCookie('userType', userType, 7);

      // Redirect based on user type
      if (userType === 'api') {
        router.push('/docs/pronunciation');
      } else {
        router.push('/');
      }
    } else {
      messageApi.error('Invalid username or password!');
    }

    setLoading(false);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      {contextHolder}
      <div className='w-full max-w-md'>
        <ContentBox title='Login'>
          <Form
            name='login'
            layout='vertical'
            onFinish={handleSubmit}
            autoComplete='off'
          >
            <Form.Item
              label='Username'
              name='username'
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label='Password'
              name='password'
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                loading={loading}
                block
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </ContentBox>
      </div>
    </div>
  );
}
