'use client';

import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

interface LoginFormProps {
  username: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async (values: LoginFormProps) => {
    setLoading(true);

    try {
      // Use next-auth signIn method with Cognito provider
      const result = await signIn('cognito', {
        username: values.username,
        password: values.password,
        redirect: false
      });

      if (result?.ok) {
        messageApi.success('Login successful.');
        router.push('/');
      } else {
        messageApi.error('Invalid username or password!');
      }
    } catch (error) {
      messageApi.error('Authentication failed');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
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
    </>
  );
}
