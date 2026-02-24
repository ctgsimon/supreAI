import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Row, Col, Space, Input, Tag } from 'antd';
import { DatabaseOutlined, CodeOutlined, LineChartOutlined, ReloadOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useIsMobile } from '../../hooks/common/useIsMobile';
import { API } from '../../helpers/api';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;

const Knowledge = () => {
  const [knowledgeList, setKnowledgeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showTableMode, setShowTableMode] = useState(true); // 控制显示模式
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  // 模拟数据 - 实际项目中应从API获取
  const mockKnowledgeData = [
    {
      id: 'knowledge_1',
      name: 'test',
      status: 'success',
      model: 'Doubao-embedding-v2',
      docCount: 1,
      sliceCount: 18,
      createdAt: '2026-02-04 16:07:06',
      updatedAt: '2026-02-04 16:07:06'
    },
    {
      id: 'knowledge_2',
      name: 'test22',
      status: 'pending',
      model: 'Doubao-embedding-v2',
      docCount: 0,
      sliceCount: 0,
      createdAt: '2026-02-03 09:30:45',
      updatedAt: '2026-02-04 10:20:33'
    },
    {
      id: 'knowledge_3',
      name: 'test1',
      status: 'pending',
      model: 'Doubao-embedding-v2',
      docCount: 0,
      sliceCount: 0,
      createdAt: '2026-02-02 14:20:15',
      updatedAt: '2026-02-02 14:20:15'
    }
  ];

  // 获取知识库列表
  const fetchKnowledgeList = async () => {
    setLoading(true);
    try {
      // 实际项目中使用API获取数据
      // const res = await API.get('/api/knowledge/list');
      // if (res.data.success) {
      //   setKnowledgeList(res.data.data);
      // }
      
      // 模拟API调用
      setTimeout(() => {
        setKnowledgeList(mockKnowledgeData);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('获取知识库列表失败:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledgeList();
  }, []);

  // 过滤数据
  const filteredData = knowledgeList.filter(item => {
    return item.name.toLowerCase().includes(searchText.toLowerCase());
  });

  // 渲染操作栏
  const renderActionBar = () => (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
      <Space>
        <Paragraph className="mb-0">{t('knowledge.totalCount', { count: filteredData.length })}</Paragraph>
      </Space>
      <Space>
        <Search
          placeholder={t('knowledge.searchPlaceholder')}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 240 }}
        />
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchKnowledgeList}
          loading={loading}
        >
          {t('knowledge.refresh')}
        </Button>
        <Link to="/knowledge/create">
          <Button type="primary">{t('knowledge.create')}</Button>
        </Link>
      </Space>
    </div>
  );

  // 渲染知识库卡片
  const renderKnowledgeCard = (knowledge) => (
    <Col xs={24} sm={12} md={8} key={knowledge.id}>
      <Card className="h-full" hoverable>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <Tag color={knowledge.status === 'success' ? 'green' : 'yellow'}>
              {knowledge.status === 'success' ? t('knowledge.status.success') : t('knowledge.status.pending')}
            </Tag>
            <Text strong className="ml-2">{knowledge.name}</Text>
          </div>
        </div>
        <div className="text-sm text-gray-500 mb-2">{knowledge.model}</div>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <div className="text-gray-500">{t('knowledge.vectorModel')}</div>
          </div>
          <div>
            <div className="text-gray-500">{t('knowledge.docCount')}</div>
            <div>{knowledge.docCount}</div>
          </div>
          <div>
            <div className="text-gray-500">{t('knowledge.sliceCount')}</div>
            <div>{knowledge.sliceCount}</div>
          </div>
        </div>
      </Card>
    </Col>
  );

  return (
    <div className="p-6 pt-20">
      <Space orientation="vertical" style={{ width: '100%' }}>
        <Row justify="space-between" align="middle" className="mb-4">
          <Title level={2}>{t('knowledge.title')}</Title>
          <Button 
            type="default" 
            onClick={() => setShowTableMode(!showTableMode)}
            size="small"
          >
            {showTableMode ? t('knowledge.switchToGuide') : t('knowledge.switchToTable')}
          </Button>
        </Row>
        <Paragraph>
          {t('knowledge.subtitle')}
        </Paragraph>

        {/* 根据切换按钮决定显示模式 */}
        {showTableMode ? (
          <Card>
            {renderActionBar()}
            <Row gutter={[16, 16]}>
              {filteredData.map(renderKnowledgeCard)}
            </Row>
          </Card>
        ) : (
          /* 引导卡片模式 */
          <>
            <div className="flex justify-center mb-6">
              <Link to="/knowledge/create">
                <Button type="primary" size="large">
                  {t('knowledge.create')}
                </Button>
              </Link>
            </div>
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
              <Col xs={24} md={8}>
                <Card className="h-full" hoverable>
                  <div className="text-center mb-6">
                    <div className="text-5xl font-extralight text-gray-300 tracking-wider">
                      {t('knowledge.step')} - 01
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pb-4 mb-4"></div>
                  <div className="text-center mb-4">
                    <DatabaseOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                  </div>
                  <Title level={4} className="text-center mb-4">
                    {t('knowledge.step1.title')}
                  </Title>
                  <Paragraph className="text-gray-600">
                    {t('knowledge.step1.description')}
                  </Paragraph>
                </Card>
              </Col>
              
              <Col xs={24} md={8}>
                <Card className="h-full" hoverable>
                  <div className="text-center mb-6">
                    <div className="text-5xl font-extralight text-gray-300 tracking-wider">
                      {t('knowledge.step')} - 02
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pb-4 mb-4"></div>
                  <div className="text-center mb-4">
                    <CodeOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                  </div>
                  <Title level={4} className="text-center mb-4">
                    {t('knowledge.step2.title')}
                  </Title>
                  <Paragraph className="text-gray-600">
                    {t('knowledge.step2.description')}
                  </Paragraph>
                </Card>
              </Col>
              
              <Col xs={24} md={8}>
                <Card className="h-full" hoverable>
                  <div className="text-center mb-6">
                    <div className="text-5xl font-extralight text-gray-300 tracking-wider">
                      {t('knowledge.step')} - 03
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pb-4 mb-4"></div>
                  <div className="text-center mb-4">
                    <LineChartOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                  </div>
                  <Title level={4} className="text-center mb-4">
                    {t('knowledge.step3.title')}
                  </Title>
                  <Paragraph className="text-gray-600">
                    {t('knowledge.step3.description')}
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

export default Knowledge;