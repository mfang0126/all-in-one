'use client';

import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

interface LoginFormProps {
  email: string;
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
        username: values.email,
        password: values.password,
        redirect: false,
        callbackUrl: '/'
      });

      if (result?.ok) {
        messageApi.success('Login successful.');
        router.push(result.url || '/');
      } else {
        messageApi.error(result?.error || 'Invalid email or password!');
        console.error('Login error:', result);
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
        autoComplete='on'
      >
        <Form.Item
          label='Email'
          name='email'
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Please enter a valid email address' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Password'
          name='password'
          rules={[{ required: true, message: 'Password is required' }]}
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
