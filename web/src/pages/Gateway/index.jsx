import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Typography, Row, Col } from 'antd';
import { Nav } from '@douyinfe/semi-ui';
import { Link, useLocation } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { 
  IconHome, 
  IconPlay, 
  IconFile, 
  IconSetting, 
  IconHistogram 
} from '@douyinfe/semi-icons';

const { Title, Text } = Typography;

const Gateway = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // 模拟安全网关数据
  const securityStats = [
    { title: t('内容合规'), count: 128, key: 'content-com', trend: '+12%', color: '#52c41a' },
    { title: t('敏感内容'), count: 45, key: 'sensitive', trend: '+8%', color: '#faad14' },
    { title: t('提示词攻击'), count: 23, key: 'prompt', trend: '-5%', color: '#ff4d4f' },
  ];
  
  // 侧边栏菜单配置
  const sidebarMenu = [
    { itemKey: 'overview', text: t('总览'), icon: <IconHome />, to: '/gateway' },
    { itemKey: 'online-test', text: t('在线测试'), icon: <IconPlay />, to: '/gateway/online-test' },
    { itemKey: 'detection-result', text: t('检测结果'), icon: <IconFile />, to: '/gateway/detection-result' },
    { itemKey: 'protection-config', text: t('防护配置'), icon: <IconSetting />, to: '/gateway/protection-config' },
    { itemKey: 'log-analysis', text: t('日志分析'), icon: <IconHistogram />, to: '/gateway/log-analysis' },
  ];
  
  // 获取当前选中的菜单项
  const selectedKey = sidebarMenu.find(item => currentPath === item.to)?.itemKey || 'overview';

  return (
    <div style={{ display: 'flex', height: '100%', backgroundColor: '#f5f7fa' }}>
      {/* 侧边栏 */}
      <div style={{ 
        width: 'auto', 
        height: '100%',
        backgroundColor: '#fff', 
        borderRight: '1px solid #e5e7eb', 
        paddingTop: '64px',
        flexShrink: 0
      }}>
        <Nav
          style={{ width: '140px' }}
          selectedKeys={[selectedKey]}
          itemStyle="sidebar-nav-item"
          hoverStyle="sidebar-nav-item:hover"
          selectedStyle="sidebar-nav-item-selected"
          renderWrapper={({ itemElement, props }) => {
            const item = sidebarMenu.find(menuItem => menuItem.itemKey === props.itemKey);
            if (!item || !item.to) return itemElement;
            
            return (
              <Link
                style={{ textDecoration: 'none' }}
                to={item.to}
              >
                {itemElement}
              </Link>
            );
          }}
        >
          {sidebarMenu.map(item => (
            <Nav.Item
              key={item.itemKey}
              itemKey={item.itemKey}
              text={item.text}
              icon={item.icon}
            />
          ))}
        </Nav>
      </div>
      
      {/* 主内容区域 */}
      <div style={{ flex: 1, height: '100%', padding: '64px 24px 24px 24px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0 }}>{t('AI安全栏 总览')}</Title>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Text type="secondary">{t('近7天数据')}</Text>
          <Text type="secondary">{t('新手指引')}</Text>
          <Text type="secondary">{t('帮助文档')}</Text>
        </div>
      </div>

      {/* 检出风险数据 */}
      <Card style={{ marginBottom: '24px' }}>
        <Title level={4} style={{ margin: '0 0 16px 0' }}>{t('检出风险数据')}</Title>
        <Row gutter={[16, 16]}>
          {securityStats.map((stat) => (
            <Col xs={24} sm={12} md={8} key={stat.key}>
              <Card 
                style={{ 
                  textAlign: 'center',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              >
                <Text strong style={{ fontSize: '32px', display: 'block', marginBottom: '8px', color: stat.color }}>
                  {stat.count}
                </Text>
                <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                  {stat.title}
                </Text>
                <Text style={{ fontSize: '14px', color: stat.trend.startsWith('+') ? '#52c41a' : '#ff4d4f' }}>
                  {stat.trend} {t('较昨日')}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 详细统计卡片 */}
      <Row gutter={[16, 16]}>
        {securityStats.map((stat) => (
          <Col xs={24} sm={12} md={8} key={stat.key}>
            <Card 
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>{stat.title}</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {t('累计')} {stat.count} {t('条')}
                  </Text>
                </div>
              }
              extra={<Text type="link" style={{ fontSize: '12px' }}>{t('更多数据')}&gt;</Text>}
              style={{ height: '100%' }}
            >
              <div style={{ height: '200px', overflowY: 'auto' }}>
                {stat.key === 'content-com' && (
                  <div>
                    <div style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                      <Text style={{ fontSize: '13px' }}>{t('检测到违规内容')}</Text>
                      <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: '4px' }}>2{t('分钟前')}</Text>
                    </div>
                    <div style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                      <Text style={{ fontSize: '13px' }}>{t('内容合规检查通过')}</Text>
                      <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: '4px' }}>5{t('分钟前')}</Text>
                    </div>
                    <div style={{ padding: '8px 0' }}>
                      <Text style={{ fontSize: '13px' }}>{t('自动拦截违规请求')}</Text>
                      <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: '4px' }}>10{t('分钟前')}</Text>
                    </div>
                  </div>
                )}
                {stat.key === 'sensitive' && (
                  <div>
                    <div style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                      <Text style={{ fontSize: '13px' }}>{t('发现敏感词')}</Text>
                      <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: '4px' }}>1{t('分钟前')}</Text>
                    </div>
                    <div style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                      <Text style={{ fontSize: '13px' }}>{t('敏感信息检测')}</Text>
                      <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: '4px' }}>8{t('分钟前')}</Text>
                    </div>
                    <div style={{ padding: '8px 0' }}>
                      <Text style={{ fontSize: '13px' }}>{t('个人信息保护')}</Text>
                      <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: '4px' }}>15{t('分钟前')}</Text>
                    </div>
                  </div>
                )}
                {stat.key === 'prompt' && (
                  <div>
                    <div style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                      <Text style={{ fontSize: '13px' }}>{t('提示词注入攻击')}</Text>
                      <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: '4px' }}>3{t('分钟前')}</Text>
                    </div>
                    <div style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                      <Text style={{ fontSize: '13px' }}>{t('越狱尝试拦截')}</Text>
                      <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: '4px' }}>12{t('分钟前')}</Text>
                    </div>
                    <div style={{ padding: '8px 0' }}>
                      <Text style={{ fontSize: '13px' }}>{t('恶意提示词检测')}</Text>
                      <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: '4px' }}>20{t('分钟前')}</Text>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      </div>
    </div>
  );
};

export default Gateway;