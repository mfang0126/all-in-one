'use client';

import { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Form, Upload, Button, Alert, Typography, Space, Divider, Input, message } from 'antd';
import type { UploadProps } from 'antd';

const { Dragger } = Upload;
const { Title } = Typography;
const { TextArea } = Input;

const DEFAULT_TEXT =
  "A community's urban forest is an extension of its pride and community spirit. Trees enhance community economic stability by attracting businesses and tourists as people tend to linger and shop longer along tree-lined streets. Apartments and offices in wooded areas rent more quickly and businesses leasing office spaces in developments with trees reported higher productivity and fewer absences.";

export default function PronunciationForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [text, setText] = useState<string>(DEFAULT_TEXT);

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: 'audio/*',
    beforeUpload: (file) => {
      setFile(file);
      setError(null);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      return false;
    },
    onRemove: () => {
      setFile(null);
      setAudioUrl(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('text', text);

    try {
      const response = await fetch('/api/read-aloud/chapter', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.PTE_API_KEY}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Something went wrong' }));
        throw new Error(errorData.message || 'Failed to assess pronunciation. Please try again.');
      }

      // Reset states after successful upload
      setFile(null);
      setAudioUrl(null);
      setText(DEFAULT_TEXT);
      setIsLoading(false);

      message.success('Pronunciation assessment completed successfully');
    } catch (error) {
      console.error('Error:', error);
      const userFriendlyMessage =
        error instanceof Error && error.message !== 'Something went wrong'
          ? error.message
          : 'Failed to assess pronunciation. Please try again later.';

      setError(userFriendlyMessage);
      message.error(userFriendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Space
      direction='vertical'
      className='w-full'
    >
      <Form
        initialValues={{
          text: DEFAULT_TEXT
        }}
        layout='vertical'
        onFinish={handleSubmit}
      >
        <Form.Item
          label='Content'
          name='text'
          rules={[{ required: true, message: 'Please enter the content' }]}
        >
          <TextArea
            rows={4}
            onChange={(e) => setText(e.target.value)}
            value={text}
          />
        </Form.Item>

        <Form.Item>
          <Dragger {...uploadProps}>
            <p className='ant-upload-drag-icon'>
              <InboxOutlined />
            </p>
            <p className='ant-upload-text'>Click or drag audio file to this area to upload</p>
          </Dragger>
        </Form.Item>

        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            loading={isLoading}
            disabled={!file}
            block
          >
            Assess Pronunciation
          </Button>
        </Form.Item>
      </Form>

      {error && (
        <Alert
          message={error}
          type='error'
          showIcon
        />
      )}

      {audioUrl && (
        <>
          <Divider />
          <Title level={4}>Audio Preview</Title>
          <audio
            controls
            className='w-full'
            src={audioUrl}
          >
            Your browser does not support the audio element.
          </audio>
        </>
      )}
    </Space>
  );
}
