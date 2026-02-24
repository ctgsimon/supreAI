/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Input,
  Table,
  Tag,
  Dropdown,
  Modal,
  Form,
  Select,
  Empty,
  Tooltip,
  Badge,
  Typography,
} from '@douyinfe/semi-ui';
import {
  IconSearch,
  IconRefresh,
  IconPlus,
  IconMore,
  IconPlayCircle,
  IconEdit,
  IconDelete,
  IconCopy,
  IconLink,
  IconChevronUp,
  IconChevronDown,
  IconHelpCircle,
  IconSend,
  IconBox,
  IconWrench,
  IconActivity,
} from '@douyinfe/semi-icons';

const { Title, Text } = Typography;
const { Option } = Select;

// 教程步骤数据
const getTutorialSteps = (t) => [
  {
    id: 1,
    number: '01',
    title: t('搭建智能体并构建镜像'),
    description: t('Runtime 支持运行主流 Python 框架开发的智能体，部署前需将您的智能体打包为容器镜像并上传到'),
    linkText: t('镜像服务（CR）'),
    linkHref: '#',
    suffixText: t('，也可使用 AgentKit CLI 一键实现'),
    secondLinkText: t('本地智能体代码云上托管'),
    secondLinkHref: '#',
    icon: <IconWrench className="w-5 h-5" />,
    gradient: 'from-blue-500/10 to-cyan-500/10',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
  },
  {
    id: 2,
    number: '02',
    title: t('在 Runtime 中部署智能体'),
    description: t('指定容器镜像，并配置安全访问等必要设置，即可将智能体托管至 Runtime，将自动为您创建好访问链接以支持调用。'),
    icon: <IconBox className="w-5 h-5" />,
    gradient: 'from-purple-500/10 to-pink-500/10',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-500',
  },
  {
    id: 3,
    number: '03',
    title: t('智能体全链路观测'),
    description: t('支持以 Runtime、会话和 Trace 三个维度监控全链路的关键指标，以实时洞悉您的智能体性能、准确性和可靠性。'),
    icon: <IconActivity className="w-5 h-5" />,
    gradient: 'from-emerald-500/10 to-teal-500/10',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
  },
];

// 模拟智能体数据
const getMockAgentsData = (t) => [
  {
    id: 'r-yebjejo2yo54ppxtvvjz',
    name: 'DataAnalysis_test',
    status: 'running',
    description: t('本模板基于 LAS AI构建高性能统一存储底座，提供数据分析能力'),
    tags: [],
    createdAt: '2025-12-18 12:05:18',
    updatedAt: '2025-12-18 12:06:41',
  },
  {
    id: 'r-abc123def456ghi789',
    name: 'CustomerService_Bot',
    status: 'stopped',
    description: t('智能客服机器人，支持多轮对话和知识库问答'),
    tags: [t('客服'), t('智能体')],
    createdAt: '2025-12-17 10:30:00',
    updatedAt: '2025-12-17 14:20:30',
  },
  {
    id: 'r-xyz789uvw456rst123',
    name: 'ContentGenerator_Pro',
    status: 'running',
    description: t('内容生成助手，支持文章、文案、代码等多种内容生成'),
    tags: [t('内容创作')],
    createdAt: '2025-12-16 09:15:22',
    updatedAt: '2025-12-18 08:45:10',
  },
];

// 状态映射
const getStatusMap = (t) => ({
  running: { text: t('运行中'), color: 'green', dot: true },
  stopped: { text: t('已停止'), color: 'grey', dot: true },
  error: { text: t('异常'), color: 'red', dot: true },
  deploying: { text: t('部署中'), color: 'blue', dot: true },
});

// 教程卡片组件
const TutorialCard = ({ step }) => (
  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${step.gradient} p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
    <div className="relative">
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${step.iconBg} ${step.iconColor} flex items-center justify-center`}>
          {step.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-gray-400">{step.number}</span>
            <h3 className="text-base font-semibold text-gray-900">{step.title}</h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {step.description}
            {step.linkText && (
              <>
                <a href={step.linkHref} className="text-blue-600 hover:text-blue-700 hover:underline mx-1">
                  {step.linkText}
                </a>
                {step.suffixText}
                {step.secondLinkText && (
                  <a href={step.secondLinkHref} className="text-blue-600 hover:text-blue-700 hover:underline mx-1">
                    {step.secondLinkText}
                  </a>
                )}
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  </div>
);

// 操作菜单
const ActionMenu = ({ record, onTest, onEvaluate, onEdit, onDelete, onCopy, t }) => (
  <Dropdown
    position="bottomRight"
    render={
      <Dropdown.Menu>
        <Dropdown.Item icon={<IconPlayCircle />} onClick={() => onTest(record)}>
          {t('在线测试')}
        </Dropdown.Item>
        <Dropdown.Item icon={<IconSend />} onClick={() => onEvaluate(record)}>
          {t('评测')}
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item icon={<IconEdit />} onClick={() => onEdit(record)}>
          {t('编辑')}
        </Dropdown.Item>
        <Dropdown.Item icon={<IconCopy />} onClick={() => onCopy(record)}>
          {t('复制')}
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item icon={<IconDelete />} type="danger" onClick={() => onDelete(record)}>
          {t('删除')}
        </Dropdown.Item>
      </Dropdown.Menu>
    }
  >
    <Button type="tertiary" icon={<IconMore />} size="small" />
  </Dropdown>
);

const AgentRuntime = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [tutorialCollapsed, setTutorialCollapsed] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const formRef = useRef(null);

  // 初始化数据
  useEffect(() => {
    setData(getMockAgentsData(t));
  }, [t]);

  const tutorialSteps = getTutorialSteps(t);
  const statusMap = getStatusMap(t);

  // 表格列定义
  const columns = [
    {
      title: t('名称 / ID'),
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="py-1">
          <div className="font-medium text-gray-900 text-sm">{text}</div>
          <div className="text-xs text-gray-400 font-mono mt-0.5">{record.id}</div>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-1">
          {t('状态')}
          <IconHelpCircle size={14} className="text-gray-400 cursor-help" />
        </div>
      ),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const config = statusMap[status] || statusMap.stopped;
        return (
          <Badge
            dot={config.dot}
            type={config.color}
            text={config.text}
          />
        );
      },
    },
    {
      title: t('描述'),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text) => (
        <Tooltip content={text}>
          <span className="text-gray-600 text-sm">{text}</span>
        </Tooltip>
      ),
    },
    {
      title: t('标签'),
      dataIndex: 'tags',
      key: 'tags',
      width: 140,
      render: (tags) => (
        <div className="flex flex-wrap gap-1">
          {tags && tags.length > 0 ? (
            tags.map((tag, index) => (
              <Tag key={index} size="small" color="light-blue" className="rounded-full">
                {tag}
              </Tag>
            ))
          ) : (
            <span className="text-gray-300 text-sm">-</span>
          )}
        </div>
      ),
    },
    {
      title: t('创建时间'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (text) => <span className="text-gray-500 text-sm">{text}</span>,
    },
    {
      title: t('更新时间'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 150,
      render: (text) => <span className="text-gray-500 text-sm">{text}</span>,
    },
    {
      title: t('操作'),
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <div className="flex items-center gap-1">
          <Button
            type="tertiary"
            size="small"
            theme="borderless"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
            onClick={() => handleTest(record)}
          >
            {t('在线测试')}
          </Button>
          <Button
            type="tertiary"
            size="small"
            theme="borderless"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
            icon={<IconLink size={14} />}
            onClick={() => handleEvaluate(record)}
          >
            {t('评测')}
          </Button>
          <ActionMenu
            record={record}
            onTest={handleTest}
            onEvaluate={handleEvaluate}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCopy={handleCopy}
            t={t}
          />
        </div>
      ),
    },
  ];

  // 操作处理函数
  const handleTest = (record) => {
    Modal.info({
      title: t('在线测试'),
      content: `${t('正在打开智能体')} "${record.name}" ${t('的测试页面')}...`,
    });
  };

  const handleEvaluate = (record) => {
    Modal.info({
      title: t('评测'),
      content: `${t('正在打开智能体')} "${record.name}" ${t('的评测页面')}...`,
    });
  };

  const handleEdit = (record) => {
    Modal.info({
      title: t('编辑智能体'),
      content: `${t('正在编辑智能体')} "${record.name}"...`,
    });
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: t('确认删除'),
      content: `${t('确定要删除智能体')} "${record.name}" ${t('吗？此操作不可恢复。')}`,
      type: 'warning',
      onOk: () => {
        setData(data.filter((item) => item.id !== record.id));
      },
    });
  };

  const handleCopy = (record) => {
    Modal.success({
      title: t('复制成功'),
      content: `${t('智能体')} "${record.name}" ${t('的配置已复制到剪贴板')}`,
    });
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleCreate = () => {
    setCreateModalVisible(true);
  };

  const handleCreateSubmit = (values) => {
    console.log(t('创建智能体'), values);
    setCreateModalVisible(false);
    if (formRef.current) {
      formRef.current.formApi.reset();
    }
    Modal.success({
      title: t('创建成功'),
      content: t('智能体创建成功，正在部署中...'),
    });
  };

  // 过滤数据
  const filteredData = data.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return item.name.toLowerCase().includes(query) ||
           item.id.toLowerCase().includes(query) ||
           item.tags.some((tag) => tag.toLowerCase().includes(query));
  });

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-50 to-white overflow-hidden  pt-16">
      {/* 页面头部 */}
      <div className="bg-white/80 backdrop-blur-sm flex-shrink-0">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5">
                {/* <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <IconBox className="w-5 h-5 text-white" />
                </div> */}
                <Title heading={3} className="mb-0 text-gray-900">{t('智能体运行时(Runtime)')}</Title>
              </div>
              <p className="text-slate-500 text-sm mb-7 leading-relaxed max-w-md text-[#6b7280]">
                   {t('AgentKit Runtime 为智能体提供安全隔离的托管式运行环境')}
              </p>
            </div>
            <Button
              type="tertiary"
              theme="borderless"
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full px-4"
              icon={tutorialCollapsed ? <IconChevronDown /> : <IconChevronUp />}
              onClick={() => setTutorialCollapsed(!tutorialCollapsed)}
            >
              {tutorialCollapsed ? t('展开教程') : t('收起教程')}
            </Button>
          </div>
        </div>
      </div>

      {/* 教程区域 */}
      {!tutorialCollapsed && (
        <div className="border-b border-gray-100 flex-shrink-0">
          <div className="px-6 py-4">
            <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
              {tutorialSteps.map((step) => (
                <TutorialCard key={step.id} step={step} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col px-6 py-4 overflow-hidden">
        {/* 操作工具栏 */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Button
              type="primary"
              icon={<IconPlus />}
              onClick={handleCreate}
              className="rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-shadow"
            >
              {t('创建智能体')}
            </Button>
            <div className="relative">
              <Input
                prefix={<IconSearch className="text-gray-400" />}
                placeholder={t('搜索智能体...')}
                value={searchQuery}
                onChange={(value) => setSearchQuery(value)}
                className="w-72 rounded-xl border-gray-200 hover:border-gray-300 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          <Button
            type="tertiary"
            icon={<IconRefresh spin={loading} />}
            onClick={handleRefresh}
            className="rounded-xl hover:bg-gray-100"
          >
            {t('刷新')}
          </Button>
        </div>

        {/* 数据表格 */}
        <div className="bg-white rounded-2xl shadow-sm flex-1 overflow-hidden flex flex-col">
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `${t('共')} ${total} ${t('条')}`,
              className: 'px-6 py-3',
            }}
            emptyContent={
              <Empty
                title={t('暂无智能体')}
                description={t('点击「创建智能体」按钮开始创建')}
                className="py-16"
              />
            }
            rowKey="id"
            className="agent-runtime-table"
            scroll={{ y: '100%' }}
          />
        </div>
      </div>

      {/* 创建智能体弹窗 */}
      <Modal
        title={t('创建智能体')}
        visible={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          if (formRef.current) {
            formRef.current.formApi.reset();
          }
        }}
        footer={null}
        width={560}
        className="rounded-2xl"
      >
        <Form
          ref={formRef}
          layout="vertical"
          onSubmit={handleCreateSubmit}
          className="pt-2"
        >
          <Form.Input
            field="name"
            label={t('智能体名称')}
            placeholder={t('请输入智能体名称')}
            rules={[{ required: true, message: t('请输入智能体名称') }]}
            className="rounded-xl"
          />
          <Form.TextArea
            field="description"
            label={t('描述')}
            placeholder={t('请输入智能体描述')}
            rows={3}
            className="rounded-xl"
          />
          <Form.Select
            field="image"
            label={t('容器镜像')}
            placeholder={t('请选择容器镜像')}
            rules={[{ required: true, message: t('请选择容器镜像') }]}
            className="rounded-xl"
          >
            <Option value="python:3.9">python:3.9</Option>
            <Option value="python:3.10">python:3.10</Option>
            <Option value="python:3.11">python:3.11</Option>
            <Option value="custom">{t('自定义镜像')}</Option>
          </Form.Select>
          <Form.TagInput
            field="tags"
            label={t('标签')}
            placeholder={t('请输入标签，按回车确认')}
            className="rounded-xl"
          />
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
            <Button
              type="tertiary"
              onClick={() => {
                setCreateModalVisible(false);
                if (formRef.current) {
                  formRef.current.formApi.reset();
                }
              }}
              className="rounded-xl px-6"
            >
              {t('取消')}
            </Button>
            <Button type="primary" htmlType="submit" className="rounded-xl px-6">
              {t('创建')}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 自定义样式 */}
      <style>{`
        .agent-runtime-table {
          height: 100%;
        }
        .agent-runtime-table .semi-table-container {
          height: 100%;
          border: none !important;
        }
        .agent-runtime-table .semi-table {
          height: 100%;
          border: none !important;
        }
        .agent-runtime-table .semi-table-thead > tr > th {
          background-color: transparent;
          border-bottom: 1px solid #f1f5f9;
          font-weight: 500;
          color: #94a3b8;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 16px;
          border-left: none !important;
          border-right: none !important;
        }
        .agent-runtime-table .semi-table-tbody > tr > td {
          border-bottom: 1px solid #f8fafc;
          padding: 16px;
          border-left: none !important;
          border-right: none !important;
          transition: background-color 0.2s;
        }
        .agent-runtime-table .semi-table-tbody > tr:hover > td {
          background-color: #fafbfc;
        }
        .agent-runtime-table .semi-table-row:last-child > td {
          border-bottom: none;
        }
        .agent-runtime-table .semi-table-fixed-left,
        .agent-runtime-table .semi-table-fixed-right {
          border: none !important;
          box-shadow: none !important;
          background: transparent !important;
        }
        .agent-runtime-table .semi-table-cell-fixed-left,
        .agent-runtime-table .semi-table-cell-fixed-right {
          border: none !important;
          box-shadow: none !important;
          background: inherit !important;
        }
        .agent-runtime-table .semi-pagination {
          border-top: 1px solid #f1f5f9;
        }
      `}</style>
    </div>
  );
};

export default AgentRuntime;
