import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Typography, Button, Space, Checkbox, Radio, Select, Input, Divider } from 'antd';
import { QuestionCircleOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import './Create.css';

const { Title, Text } = Typography;

const MemoryCreate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: 'mem0',
    description: '',
    enableSummary: false,
    enableSemantic: false,
    enablePreference: false,
    networkAccess: 'public',
    project: 'default',
    tags: [],
    agreedToTerms: false
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // 这里可以添加表单验证和提交逻辑
    console.log(t('表单数据'), formData);
    // 提交成功后可以跳回记忆库列表页面
    navigate('/memory');
  };

  return (
    <div className="memory-create-container">
      {/* 页面标题 */}
      <div className="memory-create-header">
        <div className="flex items-center justify-between">
          <Title level={2}>{t('创建记忆库')}</Title>
        </div>
      </div>

      {/* 表单内容区域 */}
      <div className="memory-create-content">
        <Card className="memory-create-card">
          <div className="memory-create-scrollable">
            <Space orientation="vertical" style={{ width: '100%' }} spacing="loose">
              {/* 基本信息 */}
              <div>
                <Title level={4} className="mb-4">{t('基本信息')}</Title>
                <Space orientation="vertical" style={{ width: '100%' }} spacing="tight">
                  <div className="mb-4">
                    <Text strong className="block mb-2">{t('名称')} *</Text>
                    <Input
                      value={formData.name}
                      onChange={(value) => handleInputChange('name', value)}
                      placeholder={t('memory-4d851d')}
                      style={{ width: '400px' }}
                    />
                    <Text type="secondary" size="small" className="mt-1 block">{t('记忆库名称不支持修改')}</Text>
                  </div>

                  <div className="mb-4">
                    <Text strong className="block mb-2">{t('类型')} *</Text>
                    <Radio.Group
                      value={formData.type}
                      onChange={(value) => handleInputChange('type', value)}
                    >
                      <Radio value="mem0">{t('mem0')}</Radio>
                      <Radio value="viking">{t('Viking')}</Radio>
                    </Radio.Group>
                  </div>

                  <div className="mb-4">
                    <Text strong className="block mb-2">{t('描述')}</Text>
                    <Input.TextArea
                      value={formData.description}
                      onChange={(value) => handleInputChange('description', value)}
                      placeholder={t('请输入')}
                      style={{ width: '600px' }}
                      rows={4}
                      maxLength={200}
                      showCount
                    />
                  </div>
                </Space>
              </div>

              <Divider />

              {/* 长期记忆提取策略 */}
              <div>
                <Title level={4} className="mb-4">{t('长期记忆提取策略')}</Title>
                <Space orientation="vertical" style={{ width: '100%' }} spacing="tight">
                  <div className="mb-4">
                    <Checkbox
                      checked={formData.enableSummary}
                      onChange={(value) => handleInputChange('enableSummary', value)}
                    >
                      <Space>
                        <Text>{t('启用会话摘要')}</Text>
                        <QuestionCircleOutlined />
                      </Space>
                    </Checkbox>
                    <Text type="secondary" size="small" className="ml-6 block">{t('总结互动内容以保留关键上下文和核心见解。')}</Text>
                  </div>

                  <div className="mb-4">
                    <Checkbox
                      checked={formData.enableSemantic}
                      onChange={(value) => handleInputChange('enableSemantic', value)}
                    >
                      <Space>
                        <Text>{t('启用语义记忆')}</Text>
                        <QuestionCircleOutlined />
                      </Space>
                    </Checkbox>
                    <Text type="secondary" size="small" className="ml-6 block">{t('与上下文无关的形式，从原始对话中提取一般事实知识、概念和含义。')}</Text>
                  </div>

                  <div className="mb-4">
                    <Checkbox
                      checked={formData.enablePreference}
                      onChange={(value) => handleInputChange('enablePreference', value)}
                    >
                      <Space>
                        <Text>{t('启用户偏好')}</Text>
                        <QuestionCircleOutlined />
                      </Space>
                    </Checkbox>
                    <Text type="secondary" size="small" className="ml-6 block">{t('去发现并学习用户行为、交互方式或选择的重复模式。')}</Text>
                  </div>

                  <div className="mb-4">
                    <Space>
                      <PlusOutlined />
                      <Text link="true">{t('添加策略')} (0/5)</Text>
                    </Space>
                  </div>
                </Space>
              </div>

              <Divider />

              {/* 网络配置 */}
              <div>
                <Title level={4} className="mb-4">{t('网络配置')}</Title>
                <Space orientation="vertical" style={{ width: '100%' }} spacing="tight">
                  <div className="mb-4">
                    <Text strong className="block mb-2">{t('网络访问')} *</Text>
                    <Radio.Group
                      value={formData.networkAccess}
                      onChange={(value) => handleInputChange('networkAccess', value)}
                    >
                      <Radio value="private">{t('私网访问')}</Radio>
                      <Radio value="public">{t('公网访问')}</Radio>
                    </Radio.Group>
                  </div>
                </Space>
              </div>

              <Divider />

              {/* 高级配置 */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Title level={4}>{t('高级配置')}</Title>
                  <Text link="true">{t('展开')}</Text>
                </div>
                <Space orientation="vertical" style={{ width: '100%' }} spacing="tight">
                  <div className="mb-4">
                    <Text strong className="block mb-2">{t('所属项目')} *</Text>
                    <Select
                      value={formData.project}
                      onChange={(value) => handleInputChange('project', value)}
                      style={{ width: '300px' }}
                      options={[
                        { value: 'default', label: t('default(默认项目)') }
                      ]}
                    />
                    <Button
                      icon={<ReloadOutlined />}
                      type="default"
                      size="small"
                      className="ml-2"
                    >
                      {t('新建项目')}
                    </Button>
                  </div>

                  <div className="mb-4">
                    <Text strong className="block mb-2">{t('标签')}</Text>
                    <Space>
                      <PlusOutlined />
                      <Text link="true">{t('添加标签')}</Text>
                      <Text type="secondary" size="small">{t('还可以添加20个')}</Text>
                    </Space>
                  </div>
                </Space>
              </div>
            </Space>
          </div>
        </Card>
      </div>

      {/* 固定底部按钮 */}
      <div className="memory-create-footer">
        <Checkbox
          checked={formData.agreedToTerms}
          onChange={(value) => handleInputChange('agreedToTerms', value)}
        >
          <Text size="small" type="secondary">{t('我已阅读并同意Mem0计费说明')}</Text>
        </Checkbox>

        <Space>
          <Button
            type="default"
            onClick={() => navigate('/memory')}
          >
            {t('取消')}
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={!formData.agreedToTerms}
          >
            {t('确定')}
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default MemoryCreate;