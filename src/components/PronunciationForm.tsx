'use client';

import { InboxOutlined } from '@ant-design/icons';
import { Form, Upload, Button, Alert, Typography, Space, Divider, Input } from 'antd';
import type { UploadProps } from 'antd';
import { ContentBox } from './ContentBox';

const { Dragger } = Upload;
const { Title } = Typography;
const { TextArea } = Input;

interface PronunciationFormProps {
  file: File | null;
  text: string;
  audioUrl: string | null;
  isLoading: boolean;
  error: string | null;
  onFileChange: (file: File | null) => void;
  onTextChange: (text: string) => void;
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function PronunciationForm({
  file,
  text,
  audioUrl,
  isLoading,
  error,
  onFileChange,
  onTextChange,
  onSubmit
}: PronunciationFormProps) {
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: 'audio/*',
    beforeUpload: (file) => {
      onFileChange(file);
      return false;
    },
    onRemove: () => {
      onFileChange(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('text', text);
    await onSubmit(formData);
  };

  return (
    <Space
      direction='vertical'
      className='w-full'
    >
      <Form
        initialValues={{ text }}
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
            onChange={(e) => onTextChange(e.target.value)}
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
