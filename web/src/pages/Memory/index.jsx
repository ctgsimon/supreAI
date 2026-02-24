import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Typography, Button, Row, Col, Space, Table, Input, Select, Tag, Spin } from 'antd';
import { DatabaseOutlined, CodeOutlined, LineChartOutlined, ReloadOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { API } from '../../helpers/api';
import { useIsMobile } from '../../hooks/common/useIsMobile';

const { Text, Title, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const Memory = () => {
  const { t } = useTranslation();
  const [memoryList, setMemoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showTableMode, setShowTableMode] = useState(true); // 控制显示模式
  const isMobile = useIsMobile();

  // 模拟数据 - 实际项目中应从API获取
  const mockMemoryData = [
    {
      id: 'memory_1j3t35t',
      name: 'memory_1j3t35t',
      status: 'available',
      source: t('mem0记忆库'),
      count: 1,
      description: t('测试'),
      tags: [],
      createdAt: '2026-02-04 16:07:06',
      updatedAt: '2026-02-04 16:07:06'
    },
    {
      id: 'memory_ye0f0pz8zt8n1dlnp9q',
      name: 'memory_ye0f0pz8zt8n1dlnp9q',
      status: 'available',
      source: t('mem0记忆库'),
      count: 15,
      description: t('用户偏好记忆库'),
      tags: [t('用户行为'), t('偏好')],
      createdAt: '2026-02-03 09:30:45',
      updatedAt: '2026-02-04 10:20:33'
    }
  ];

  // 获取记忆库列表
  const fetchMemoryList = async () => {
    setLoading(true);
    try {
      // 实际项目中使用API获取数据
      // const res = await API.get('/api/memory/list');
      // if (res.data.success) {
      //   setMemoryList(res.data.data);
      // }
      
      // 模拟API调用
      setTimeout(() => {
        setMemoryList(mockMemoryData);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('获取记忆库列表失败:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemoryList();
  }, []);

  // 表格列定义
  const columns = [
    {
      title: t('记忆名称/ID'),
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
        </div>
      )
    },
    {
      title: t('状态'),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const statusMap = {
          available: <Tag color="success">{t('可用')}</Tag>,
          creating: <Tag color="processing">{t('创建中')}</Tag>,
          error: <Tag color="error">{t('错误')}</Tag>
        };
        return statusMap[status] || status;
      }
    },
    {
      title: t('来源'),
      dataIndex: 'source',
      key: 'source',
      width: 120
    },
    {
      title: t('记忆条数'),
      dataIndex: 'count',
      key: 'count',
      width: 100
    },
    {
      title: t('描述'),
      dataIndex: 'description',
      key: 'description',
      flex: 1,
      ellipsis: true
    },
    {
      title: t('标签'),
      dataIndex: 'tags',
      key: 'tags',
      width: 150,
      render: (tags) => (
        <Space>
          {tags.map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </Space>
      )
    },
    {
      title: t('创建时间'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150
    },
    {
      title: t('更新'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 150
    },
    {
      title: t('操作'),
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button size="small" type="link">{t('查看')}</Button>
          <Button size="small" type="link" danger>{t('删除')}</Button>
        </Space>
      )
    }
  ];

  // 过滤数据
  const filteredData = memoryList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = typeFilter ? item.source === typeFilter : true;
    const matchesStatus = statusFilter ? item.status === statusFilter : true;
    return matchesSearch && matchesType && matchesStatus;
  });

  // 渲染操作栏
  const renderActionBar = () => (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
      <Space>
        <Link to="/memory/create">
          <Button type="primary">{t('创建记忆库')}</Button>
        </Link>
        <Button type="default">{t('导入记忆库')}</Button>
        <Select
          placeholder={t('请选择搜索类型')}
          value={typeFilter}
          onChange={setTypeFilter}
          style={{ width: 160 }}
          allowClear
        >
          <Option value={t('mem0记忆库')}>{t('mem0记忆库')}</Option>
          <Option value={t('Viking记忆库')}>{t('Viking记忆库')}</Option>
        </Select>
      </Space>
      <Space>
        <Search
          placeholder={t('搜索记忆库')}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 240 }}
        />
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchMemoryList}
          loading={loading}
        >
          {t('刷新')}
        </Button>
      </Space>
    </div>
  );

  return (
    <div className="p-6 pt-20">
      <Space orientation="vertical" style={{ width: '100%' }}>
        <Row justify="space-between" align="middle" className="mb-4">
          <Title level={2}>{t('记忆库 (Memory)')}</Title>
          <Button 
            type="default" 
            onClick={() => setShowTableMode(!showTableMode)}
            size="small"
          >
            {showTableMode ? t('切换到引导模式') : t('切换到表格模式')}
          </Button>
        </Row>
        <Paragraph>
          {t('AgentKit 记忆库为智能体提供长期记忆，实现智能体跨会话、上下文感知和个性化的交互，实现智能体的持续学习与演进。')}
        </Paragraph>

        {/* 根据切换按钮决定显示模式 */}
        {showTableMode ? (
          <Card>
            {renderActionBar()}
            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 条`,
                pageSizeOptions: ['10', '20', '50', '100']
              }}
              scroll={{ x: isMobile ? undefined : 'max-content' }}
            />
          </Card>
        ) : (
          /* 引导卡片模式 */
          <>
            <div className="flex justify-center mb-6">
              <Link to="/memory/create">
                <Button type="primary" size="large">
                  {t('创建记忆库')}
                </Button>
              </Link>
            </div>
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
            <Col xs={24} md={8}>
              <Card className="h-full" hoverable>
                <div className="text-center mb-6">
                  <div className="text-5xl font-extralight text-gray-300 tracking-wider">
                    {t('Step - 01')}
                  </div>
                </div>
                <div className="border-t border-gray-200 pb-4 mb-4"></div>
                <div className="text-center mb-4">
                  <DatabaseOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                </div>
                <Title level={4} className="text-center mb-4">
                  {t('创建记忆库资源')}
                </Title>
                <Paragraph className="text-gray-600">
                  {t('可通过控制台创建记忆库，或导入已有记忆库，记忆将被自动存储，并根据配置的提取策略自动增长记忆，允许智能体在定义的会话中使用。')}
                </Paragraph>
              </Card>
            </Col>
            
            <Col xs={24} md={8}>
              <Card className="h-full" hoverable>
                <div className="text-center mb-6">
                  <div className="text-5xl font-extralight text-gray-300 tracking-wider">
                    {t('Step - 02')}
                  </div>
                </div>
                <div className="border-t border-gray-200 pb-4 mb-4"></div>
                <div className="text-center mb-4">
                  <CodeOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                </div>
                <Title level={4} className="text-center mb-4">
                  {t('在智能体中集成/检索调试')}
                </Title>
                <Paragraph className="text-gray-600">
                  {t('在智能体代码中集成记忆库，记忆库将同步实现记忆信息提取与合并，并通过检索接口实现智能体持续迭代。支持技术调试记忆库，快速定位问题。')}
                </Paragraph>
              </Card>
            </Col>
            
            <Col xs={24} md={8}>
              <Card className="h-full" hoverable>
                <div className="text-center mb-6">
                  <div className="text-5xl font-extralight text-gray-300 tracking-wider">
                    {t('Step - 03')}
                  </div>
                </div>
                <div className="border-t border-gray-200 pb-4 mb-4"></div>
                <div className="text-center mb-4">
                  <LineChartOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                </div>
                <Title level={4} className="text-center mb-4">
                  {t('可观测评估性能')}
                </Title>
                <Paragraph className="text-gray-600">
                  {t('监控记忆库在智能体的关键指标（latency、QPS等）、trace、log和时间线，以确保关于记忆库的性能、准确性、检索效果和可靠性的实时监测。')}
                </Paragraph>
              </Card>
            </Col>
          </Row>
          </>
        )}
      </Space>
    </div>
  );
};

export default Memory;