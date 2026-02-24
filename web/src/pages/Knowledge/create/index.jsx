import React, { useState } from 'react';
import { Card, Typography, Button, Form, Input, Radio, Select, Switch, Row, Col, Space, Divider, Upload, message } from 'antd';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

/**
 * 知识库创建/编辑页面
 * 提供知识库的各种配置选项
 */
const KnowledgeCreate = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { t } = useTranslation();

  // 处理表单提交
  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        console.log('表单数据:', values);
        // 这里可以添加API调用，提交表单数据
        message.success('知识库创建成功');
        // 跳转到知识库列表页
        navigate('/knowledge');
      })
      .catch(info => {
        console.log('表单验证失败:', info);
        message.error('请检查表单填写是否正确');
      });
  };

  // 处理文件上传
  const handleUpload = (file) => {
    // 这里可以添加文件上传逻辑
    console.log('上传文件:', file);
    message.success('文件上传成功');
    return false; // 阻止自动上传
  };

  return (
    <div className="p-6 pt-20">
      <Space orientation="vertical" style={{ width: '100%' }}>
        <Row align="middle" className="mb-4">
          <Link to="/knowledge">
            <Button icon={<ArrowLeftOutlined />} type="text">
              {t('knowledgeCreate.back')}
            </Button>
          </Link>
          <Title level={2} className="ml-4 mb-0">{t('knowledgeCreate.title')}</Title>
        </Row>

        <Card>
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              knowledgeType: 'public',
              indexType: 'hybrid',
              chunkingType: 'auto',
              gpuType: 'CPU',
              optimizeMode: 'Fast'
            }}
          >
            {/* 基础信息 */}
            <Title level={4} className="mb-4">{t('knowledgeCreate.basicInfo')}</Title>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="name"
                  label={t('knowledgeCreate.name')}
                  rules={[{ required: true, message: t('knowledgeCreate.nameRequired') }]}
                >
                  <Input placeholder={t('knowledgeCreate.namePlaceholder')} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="description"
                  label={t('knowledgeCreate.description')}
                  rules={[{ required: true, message: t('knowledgeCreate.descriptionRequired') }]}
                >
                  <Input placeholder={t('knowledgeCreate.descriptionPlaceholder')} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="knowledgeType"
              label={t('knowledgeCreate.type')}
              rules={[{ required: true, message: t('knowledgeCreate.typeRequired') }]}
            >
              <Radio.Group>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Radio.Button value="public" style={{ width: '100%' }}>
                    <div>
                      <div className="font-medium">{t('knowledgeCreate.publicType')}</div>
                      <div className="text-gray-500 text-sm">{t('knowledgeCreate.publicTypeDesc')}</div>
                    </div>
                  </Radio.Button>
                  <Radio.Button value="private" style={{ width: '100%' }}>
                    <div>
                      <div className="font-medium">{t('knowledgeCreate.privateType')}</div>
                      <div className="text-gray-500 text-sm">{t('knowledgeCreate.privateTypeDesc')}</div>
                    </div>
                  </Radio.Button>
                </Space>
              </Radio.Group>
            </Form.Item>

            <Divider />

            {/* 配置知识库 */}
            <Title level={4} className="mb-4">{t('knowledgeCreate.configTitle')}</Title>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="indexType"
                  label={t('knowledgeCreate.indexType')}
                  rules={[{ required: true, message: t('knowledgeCreate.indexTypeRequired') }]}
                >
                  <Select placeholder={t('knowledgeCreate.indexTypePlaceholder')}>
                    <Option value="hybrid">Doubao-semantic-embedding-v2(2k)-{t('knowledgeCreate.defaultIndex')}</Option>
                    <Option value="sparse">{t('knowledgeCreate.sparseIndex')}</Option>
                    <Option value="dense">{t('knowledgeCreate.denseIndex')}</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="chunkingType"
                  label={t('knowledgeCreate.chunkingType')}
                  rules={[{ required: true, message: t('knowledgeCreate.chunkingTypeRequired') }]}
                >
                  <Radio.Group>
                    <Radio.Button value="auto">{t('knowledgeCreate.autoChunk')}</Radio.Button>
                    <Radio.Button value="manual">{t('knowledgeCreate.manualChunk')}</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="chunkSize"
              label={t('knowledgeCreate.chunkSize')}
              rules={[{ required: true, message: t('knowledgeCreate.chunkSizeRequired') }]}
            >
              <Select placeholder={t('knowledgeCreate.chunkSizePlaceholder')}>
                <Option value="200">200</Option>
                <Option value="500">500</Option>
                <Option value="1000">1000</Option>
                <Option value="2000">2000</Option>
              </Select>
            </Form.Item>

            <Form.Item name="mergeChunks" label={t('knowledgeCreate.mergeChunks')}>
              <Switch />
            </Form.Item>

            <Form.Item name="ocrEnabled" label={t('knowledgeCreate.ocrEnabled')}>
              <div>
                <Switch />
                <Text type="secondary" className="ml-2">{t('knowledgeCreate.ocrDesc')}</Text>
              </div>
            </Form.Item>

            <Form.Item
              name="customSettings"
              label={t('knowledgeCreate.customSettings')}
            >
              <TextArea rows={4} placeholder={t('knowledgeCreate.customSettingsPlaceholder')} />
            </Form.Item>

            <Divider />

            {/* GPU配置 */}
            <Title level={4} className="mb-4">{t('knowledgeCreate.gpuConfig')}</Title>
            <Row gutter={16}>
              <Col xs={24} md={6}>
                <Form.Item
                  name="gpuType"
                  label={t('knowledgeCreate.gpuType')}
                  rules={[{ required: true, message: t('knowledgeCreate.gpuTypeRequired') }]}
                >
                  <Radio.Group>
                    <Radio.Button value="CPU">CPU</Radio.Button>
                    <Radio.Button value="GPU">GPU</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item
                  name="gpuCount"
                  label={t('knowledgeCreate.gpuCount')}
                  rules={[{ required: true, message: t('knowledgeCreate.gpuCountRequired') }]}
                >
                  <Select placeholder={t('knowledgeCreate.gpuCountPlaceholder')}>
                    <Option value="1">1</Option>
                    <Option value="2">2</Option>
                    <Option value="4">4</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item
                  name="gpuMemory"
                  label={t('knowledgeCreate.gpuMemory')}
                  rules={[{ required: true, message: t('knowledgeCreate.gpuMemoryRequired') }]}
                >
                  <Select placeholder={t('knowledgeCreate.gpuMemoryPlaceholder')}>
                    <Option value="100">100</Option>
                    <Option value="200">200</Option>
                    <Option value="400">400</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item
                  name="qpsLimit"
                  label={t('knowledgeCreate.qpsLimit')}
                  rules={[{ required: true, message: t('knowledgeCreate.qpsLimitRequired') }]}
                >
                  <Select placeholder={t('knowledgeCreate.qpsLimitPlaceholder')}>
                    <Option value="8">8</Option>
                    <Option value="16">16</Option>
                    <Option value="32">32</Option>
                    <Option value="64">64</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="customGpuSettings" label={t('knowledgeCreate.customGpuSettings')}>
              <div>
                <Switch />
                <Text type="secondary" className="ml-2">{t('knowledgeCreate.customGpuSettingsDesc')}</Text>
              </div>
            </Form.Item>

            <Divider />

            {/* 优化配置 */}
            <Title level={4} className="mb-4">{t('knowledgeCreate.optimizeConfig')}</Title>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="optimizeMode"
                  label={t('knowledgeCreate.optimizeMode')}
                  rules={[{ required: true, message: t('knowledgeCreate.optimizeModeRequired') }]}
                >
                  <Radio.Group>
                    <Radio.Button value="Fast">Fast</Radio.Button>
                    <Radio.Button value="IVF">IVF</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="fastDescription"
              label={t('knowledgeCreate.fastDescription')}
            >
              <div className="bg-gray-50 p-4 rounded">
                <Text type="secondary">{t('knowledgeCreate.fastDesc')}</Text>
              </div>
            </Form.Item>

            <Form.Item
              name="ivfDescription"
              label={t('knowledgeCreate.ivfDescription')}
            >
              <div className="bg-gray-50 p-4 rounded">
                <Text type="secondary">{t('knowledgeCreate.ivfDesc')}</Text>
              </div>
            </Form.Item>

            <Divider />

            {/* 文档预览 */}
            <Title level={4} className="mb-4">{t('knowledgeCreate.docPreview')}</Title>
            <div className="bg-gray-50 p-6 rounded text-center">
              <Upload
                accept=".doc,.docx,.pdf,.txt,.md"
                beforeUpload={handleUpload}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />} size="large">
                  {t('knowledgeCreate.uploadDoc')}
                </Button>
              </Upload>
              <Text type="secondary" className="block mt-2">{t('knowledgeCreate.uploadDocDesc')}</Text>
            </div>
          </Form>
        </Card>
        
        {/* 固定底部的操作按钮 */}
        <div className="bottom-button-bar">
          <div className="button-group">
            <Button onClick={() => navigate('/knowledge')} className="bottom-button">{t('knowledgeCreate.cancel')}</Button>
            <Button type="primary" onClick={handleSubmit} className="bottom-button primary-button">{t('knowledgeCreate.submit')}</Button>
          </div>
        </div>
        
        <style>{`
          .bottom-button-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: #ffffff;
            border-top: 1px solid #e8e8e8;
            padding: 16px;
            padding-left: calc(var(--sidebar-current-width) + 24px);
            padding-right: 24px;
            box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
            z-index: 100;
            display: flex;
            justify-content: flex-end;
            align-items: center;
          }
          
          .button-group {
            display: flex;
            gap: 12px;
          }
          
          .bottom-button {
            width: 120px;
          }
          
          @media (max-width: 768px) {
            .bottom-button-bar {
              padding-left: 16px;
              padding-right: 16px;
              flex-direction: column;
              align-items: stretch;
            }
            
            .button-group {
              width: 100%;
              flex-direction: column;
            }
            
            .bottom-button {
              width: 100%;
              margin-bottom: 8px;
            }
            
            .bottom-button:last-child {
              margin-bottom: 0;
            }
          }
        `}</style>
        
        {/* 为底部固定按钮预留空间 */}
        <div style={{ height: '80px' }}></div>
      </Space>
    </div>
  );
};

export default KnowledgeCreate;