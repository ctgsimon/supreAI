import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Tabs, Select, Card, Row, Col, Space, Table, Statistic } from 'antd';
import { Button, Checkbox } from '@douyinfe/semi-ui';
import { VChart } from '@visactor/react-vchart';

const { Title, Paragraph } = Typography;

const Observability = () => {
  const { t } = useTranslation();
  const sessionData = [
    { time: '2025-09-24 10:00', value: 40000 },
    { time: '2025-09-24 10:20', value: 80000 },
    { time: '2025-09-24 10:40', value: 30000 },
    { time: '2025-09-24 11:00', value: 50000 },
  ];

  const callData = [
    { time: '2025-09-24 10:00', value: 400000 },
    { time: '2025-09-24 10:20', value: 600000 },
    { time: '2025-09-24 10:40', value: 700000 },
    { time: '2025-09-24 11:00', value: 500000 },
  ];

  const errorRateData = [
    { time: '2025-09-24 10:00', value: 5 },
    { time: '2025-09-24 10:20', value: 15 },
    { time: '2025-09-24 10:40', value: 8 },
    { time: '2025-09-24 11:00', value: 12 },
  ];

  // 图表配置
  const sessionChartSpec = {
    type: 'area',
    data: [
      {
        id: 'sessionData',
        values: sessionData,
      },
    ],
    xField: 'time',
    yField: 'value',
    area: {
      style: {
        stroke: '#1890ff',
        fill: '#e6f7ff',
      },
    },
  };

  const callChartSpec = {
    type: 'area',
    data: [
      {
        id: 'callData',
        values: callData,
      },
    ],
    xField: 'time',
    yField: 'value',
    area: {
      style: {
        stroke: '#1890ff',
        fill: '#e6f7ff',
      },
    },
  };

  const errorRateChartSpec = {
    type: 'area',
    data: [
      {
        id: 'errorRateData',
        values: errorRateData,
      },
    ],
    xField: 'time',
    yField: 'value',
    area: {
      style: {
        stroke: '#ff4d4f',
        fill: '#fff2f0',
      },
    },
  };

  const runtimeData = [
    { key: '1', name: 'agent-test-1', sessions: 38, calls: '8.377 k', errorRate: '1%' },
    { key: '2', name: 'agent-test-2', sessions: 45, calls: '3.344 k', errorRate: '2%' },
    { key: '3', name: 'agent-test-3', sessions: 78, calls: '2.307 k', errorRate: '1%' },
    { key: '4', name: 'agent-test-4', sessions: 23, calls: '436 k', errorRate: '5%' },
    { key: '5', name: 'agent-test-5', sessions: 43, calls: '134 k', errorRate: '10%' },
  ];

  return (
    <div className="p-6 pt-20">
      <Space orientation="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={2}>{t('AgentKit 应用观测')}</Title>
          <Space>
            <Select defaultValue={t('自动聚合')} style={{ width: 120 }}>
              <Select.Option value={t('自动聚合')}>{t('自动聚合')}</Select.Option>
              <Select.Option value={t('手动聚合')}>{t('手动聚合')}</Select.Option>
            </Select>
            <Select defaultValue={t('最近')} style={{ width: 80 }}>
              <Select.Option value={t('最近')}>{t('最近')}</Select.Option>
              <Select.Option value={t('今天')}>{t('今天')}</Select.Option>
              <Select.Option value={t('昨天')}>{t('昨天')}</Select.Option>
            </Select>
            <Select defaultValue={t('1小时')} style={{ width: 80 }}>
              <Select.Option value={t('1小时')}>{t('1小时')}</Select.Option>
              <Select.Option value={t('6小时')}>{t('6小时')}</Select.Option>
              <Select.Option value={t('24小时')}>{t('24小时')}</Select.Option>
            </Select>
            <Button>
              {t('刷新')}
            </Button>
            <Space>
              <Checkbox>{t('自动刷新')}</Checkbox>
            </Space>
          </Space>
        </div>

        <Tabs 
          defaultActiveKey="1"
          items={[
            { key: '1', label: t('运行时总览') },
            { key: '2', label: t('记忆库分析') },
            { key: '3', label: t('知识库分析') },
            { key: '4', label: t('会话分析') },
            { key: '5', label: t('Trace分析') },
            { key: '6', label: t('模型监控') },
            { key: '7', label: t('工具分析') },
            { key: '8', label: t('日志分析') },
            { key: '9', label: t('洞察大盘') },
            { key: '10', label: t('告警模板') }
          ]}
        />

        <Card style={{ marginTop: 16, background: '#f0f8ff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={4}>{t('开启 AgentKit 可观测')}</Title>
              <ul style={{ marginTop: 8 }}>
                <li style={{ marginBottom: 8 }}>
                  {t('AgentKit 可观测平台提供全方位的可观测能力，支持运行时、工具、MCP、知识、记忆库等组件的实时监控。')}
                </li>
                <li>
                  {t('当前还没有任何可观测数据上报，请点击下方指引按钮开始接入。')}
                </li>
              </ul>
              <Button type="primary" style={{ marginTop: 16 }}>
                {t('查看 AgentKit 可观测接入指引')}
              </Button>
            </div>
            <div style={{ width: 300, height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ fontSize: 80, color: '#1890ff' }}>📊</div>
            </div>
          </div>
        </Card>

        <div style={{ marginTop: 24 }}>
          <Title level={4}>{t('运行时指标监控（示意）')}</Title>
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24} sm={12} md={4}>
              <Card>
                <Statistic title={t('Runtime数')} value={5} />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Card>
                <Statistic title={t('会话数')} value={5} />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Card>
                <Statistic title={t('调用数')} value="818.1 k" />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Card>
                <Statistic title={t('错误总数')} value={20} />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Card>
                <Statistic title={t('错误率')} value="10%" />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
            <Col xs={24} md={8}>
              <Card title={t('会话')}>
                <VChart
                  width={300}
                  height={200}
                  spec={sessionChartSpec}
                />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card title={t('调用数')}>
                <VChart
                  width={300}
                  height={200}
                  spec={callChartSpec}
                />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card title={t('错误率')}>
                <VChart
                  width={300}
                  height={200}
                  spec={errorRateChartSpec}
                />
              </Card>
            </Col>
          </Row>

          <div style={{ marginTop: 24 }}>
            <Title level={4}>{t('Runtime 列表')}</Title>
            <Table
              columns={[
                {
                  title: t('名称'),
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: t('会话'),
                  dataIndex: 'sessions',
                  key: 'sessions',
                },
                {
                  title: t('调用数'),
                  dataIndex: 'calls',
                  key: 'calls',
                },
                {
                  title: t('错误率'),
                  dataIndex: 'errorRate',
                  key: 'errorRate',
                },
                {
                  title: t('操作'),
                  key: 'action',
                  render: () => <a>{t('监控详情')}</a>,
                },
              ]}
              dataSource={runtimeData}
              pagination={false}
              bordered
            />
          </div>
        </div>
      </Space>
    </div>
  );
};

export default Observability;