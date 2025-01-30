'use client';

import { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Form, Select, Upload, Button, Alert } from 'antd';
import type { UploadProps } from 'antd';
import { LANGUAGE_CONFIG, SUPPORTED_LANGUAGES, type SupportedLanguage } from '../app/constants/languages';

const { Dragger } = Upload;

interface TranscriptionFormProps {
  onSubmit: (file: File, language: SupportedLanguage) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onFileChange: (file: File | null) => void;
}

export default function TranscriptionForm({ onSubmit, isLoading, error, onFileChange }: TranscriptionFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<SupportedLanguage>('Global English');

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: 'audio/*',
    beforeUpload: (file) => {
      setFile(file);
      onFileChange(file);
      return false; // Prevent automatic upload
    },
    onRemove: () => {
      setFile(null);
      onFileChange(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    await onSubmit(file, language);
  };

  return (
    <Form
      layout='vertical'
      onFinish={handleSubmit}
    >
      <Form.Item
        label='Select Language'
        required
      >
        <Select
          value={language}
          onChange={(value) => setLanguage(value as SupportedLanguage)}
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <Select.Option
              key={lang}
              value={lang}
            >
              {LANGUAGE_CONFIG[lang].label}
            </Select.Option>
          ))}
        </Select>
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
          Transcribe Audio
        </Button>
      </Form.Item>

      {error && (
        <Alert
          message={error}
          type='error'
          showIcon
        />
      )}
    </Form>
  );
}
