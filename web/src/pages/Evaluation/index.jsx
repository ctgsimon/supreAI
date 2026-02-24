import React from 'react';
import { Typography, Tabs, Input, Button, Table, Space, Pagination } from 'antd';
import { SearchOutlined, PlusOutlined, LeftOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

const Evaluation = () => {
  const { t } = useTranslation();

  const columns = [
    {
      title: t('evaluation.name'),
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <div>
          <span style={{ marginRight: 8 }}>📚</span>
          {text}
        </div>
      ),
    },
    {
      title: t('evaluation.updateTime'),
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: (text) => (
        <div>
          <span style={{ marginRight: 8 }}>👤</span>
          {text}
        </div>
      ),
    },
    {
      title: t('evaluation.dataCount'),
      dataIndex: 'dataCount',
      key: 'dataCount',
    },
    {
      title: t('evaluation.action'),
      dataIndex: 'action',
      key: 'action',
      render: () => (
        <Space size="middle">
          <a>{t('evaluation.detail')}</a>
          <a>{t('evaluation.delete')}</a>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      name: t('evaluation.sampleDatasetName'),
      updateTime: t('evaluation.sampleUpdateTime'),
      dataCount: '114',
    },
  ];

  return (
    <div className="p-6 pt-20">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={2}>{t('evaluation.title')}</Title>
        <Paragraph>
          {t('evaluation.subtitle')}
        </Paragraph>
        
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab={t('evaluation.datasetTab')} key="1">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Input
                placeholder={t('evaluation.searchPlaceholder')}
                prefix={<SearchOutlined />}
                style={{ width: 200 }}
              />
              <Button type="primary" icon={<PlusOutlined />}>
                {t('evaluation.addDataset')}
              </Button>
            </div>
            
            <Table
              columns={columns}
              dataSource={data}
              pagination={false}
              bordered
            />
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 16 }}>
              <span style={{ marginRight: 16 }}>{t('evaluation.total', { count: 1 })}</span>
              <Pagination
                current={1}
                pageSize={20}
                total={1}
                showSizeChanger
                showTotal={(total) => t('evaluation.total', { count: total })}
              />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab={t('evaluation.taskTab')} key="2">
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <Button type="text" icon={<LeftOutlined />} style={{ marginRight: 8 }}>
                    {t('evaluation.back')}
                  </Button>
                  <Title level={4} style={{ display: 'inline-block', margin: 0 }}>{t('evaluation.sampleDatasetName')}</Title>
                </div>
                <Space>
                  <Button>{t('evaluation.addData')}</Button>
                  <Button>{t('evaluation.batchImport')}</Button>
                  <Button>{t('evaluation.evalLog')}</Button>
                  <Button type="primary">{t('evaluation.createTask')}</Button>
                </Space>
              </div>
              
              <Table
                columns={[
                  {
                    title: t('evaluation.userInput'),
                    dataIndex: 'userInput',
                    key: 'userInput',
                  },
                  {
                    title: t('evaluation.expectedOutput'),
                    dataIndex: 'expectedOutput',
                    key: 'expectedOutput',
                  },
                  {
                    title: t('evaluation.id'),
                    dataIndex: 'id',
                    key: 'id',
                  },
                  {
                    title: t('evaluation.action'),
                    dataIndex: 'action',
                    key: 'action',
                    render: () => (
                      <Space size="middle">
                        <a>{t('evaluation.edit')}</a>
                        <a>{t('evaluation.delete')}</a>
                      </Space>
                    ),
                  },
                ]}
                dataSource={[
                  {
                    key: '1',
                    userInput: t('evaluation.sampleQ1'),
                    expectedOutput: t('evaluation.sampleA1'),
                    id: '7554235102098210818',
                  },
                  {
                    key: '2',
                    userInput: t('evaluation.sampleQ2'),
                    expectedOutput: t('evaluation.sampleA2'),
                    id: '7554235102098194434',
                  },
                  {
                    key: '3',
                    userInput: t('evaluation.sampleQ3'),
                    expectedOutput: t('evaluation.sampleA3'),
                    id: '7554235102098787590',
                  },
                  {
                    key: '4',
                    userInput: t('evaluation.sampleQ4'),
                    expectedOutput: t('evaluation.sampleA4'),
                    id: '7554235102098196666',
                  },
                  {
                    key: '5',
                    userInput: t('evaluation.sampleQ5'),
                    expectedOutput: t('evaluation.sampleA5'),
                    id: '7554235102098195282',
                  },
                ]}
                pagination={false}
                bordered
              />
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 16 }}>
                <span style={{ marginRight: 16 }}>{t('evaluation.total', { count: 114 })}</span>
                <Pagination
                  current={1}
                  pageSize={10}
                  total={114}
                  showSizeChanger
                  showTotal={(total) => t('evaluation.total', { count: total })}
                />
              </div>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Space>
    </div>
  );
};

export default Evaluation;