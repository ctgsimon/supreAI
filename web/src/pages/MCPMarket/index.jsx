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

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Button, Dropdown, Modal, Toast } from '@douyinfe/semi-ui';
import {
  IconSearch,
  IconRefresh,
  IconPlus,
  IconHelpCircle,
  IconChevronDown,
} from '@douyinfe/semi-icons';

// 推荐选项
const getRecommendOptions = (t) => [
  { id: 'latest', label: t('最新上架') },
  { id: 'popular', label: t('最多使用') },
];

// 分类数据
const getCategories = (t) => [
  { id: 'all', name: t('全部'), count: 15 },
  { id: 'my', name: t('我的开通'), count: 0 },
  { id: 'cloud', name: t('云原生'), count: 1 },
  { id: 'devtools', name: t('开发者工具'), count: 3 },
  { id: 'search', name: t('搜索工具'), count: 2 },
  { id: 'data', name: t('数据查询'), count: 4 },
  { id: 'content', name: t('内容生成'), count: 5 },
  { id: 'enterprise', name: t('企业服务'), count: 6 },
  { id: 'life', name: t('生活服务'), count: 1 },
];

// 排序选项
const getSortOptions = (t) => [
  { label: t('全部'), value: 'all' },
  { label: t('最新'), value: 'latest' },
  { label: t('最热'), value: 'hottest' },
];

// 创建MCP选项
const getCreateOptions = (t) => [
  {
    id: 'plugin',
    title: t('插件'),
    description: t('使用外部OpenAPI注册'),
    icon: (
      <svg
        viewBox='0 0 24 24'
        className='w-8 h-8'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
      >
        <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' />
      </svg>
    ),
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    id: 'script',
    title: t('脚本部署'),
    description: t('录入MCP安装脚本，使用FC资源部署'),
    icon: (
      <svg
        viewBox='0 0 24 24'
        className='w-8 h-8'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
      >
        <polyline points='16 18 22 12 16 6' />
        <polyline points='8 6 2 12 8 18' />
      </svg>
    ),
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    id: 'ai-gateway',
    title: t('AI网关'),
    description: t('导入企业AI网关中的MCP服务'),
    icon: (
      <svg
        viewBox='0 0 24 24'
        className='w-8 h-8'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
      >
        <circle cx='12' cy='12' r='3' />
        <path d='M12 1v6m0 6v6m4.22-10.22l4.24-4.24M6.34 6.34L2.1 2.1m17.8 17.8l-4.24-4.24M6.34 17.66l-4.24 4.24M23 12h-6m-6 0H1m20.24-4.24l-4.24 4.24M6.34 6.34l-4.24-4.24' />
      </svg>
    ),
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    id: 'aliyun-openapi',
    title: t('阿里云OpenAPI'),
    description: t('导入自定义的阿里云OpenAPI MCP服务'),
    icon: (
      <svg
        viewBox='0 0 24 24'
        className='w-8 h-8'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
      >
        <path d='M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z' />
      </svg>
    ),
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
];

// 服务卡片数据
const getServicesData = (t) => [
  {
    id: 1,
    name: t('GitHub MCP Server'),
    description: t('集成GitHub API，支持代码仓库管理、Issue追踪、Pull Request操作等功能'),
    icon: (
      <svg viewBox='0 0 24 24' className='w-8 h-8' fill='currentColor'>
        <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
      </svg>
    ),
    iconBg: 'bg-gray-800',
    iconColor: 'text-white',
    tags: [t('效率工具'), t('代码管理')],
    views: 1256,
    comments: 89,
  },
  {
    id: 2,
    name: t('Image Generation Pro'),
    description: t('基于最新AI模型的图像生成服务，支持文生图、图生图、图像编辑等多种功能'),
    icon: (
      <svg
        viewBox='0 0 24 24'
        className='w-8 h-8'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
      >
        <rect x='3' y='3' width='18' height='18' rx='2' ry='2' />
        <circle cx='8.5' cy='8.5' r='1.5' />
        <polyline points='21 15 16 10 5 21' />
      </svg>
    ),
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    tags: [t('图像服务'), t('AI生成')],
    views: 3421,
    comments: 156,
  },
  {
    id: 3,
    name: t('Database Query Assistant'),
    description: t('自然语言转SQL查询，支持MySQL、PostgreSQL、MongoDB等多种数据库'),
    icon: (
      <svg
        viewBox='0 0 24 24'
        className='w-8 h-8'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
      >
        <ellipse cx='12' cy='5' rx='9' ry='3' />
        <path d='M21 12c0 1.66-4 3-9 3s-9-1.34-9-3' />
        <path d='M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5' />
      </svg>
    ),
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    tags: [t('数据查询'), t('开发者工具')],
    views: 892,
    comments: 45,
  },
  {
    id: 4,
    name: t('Weather Data Service'),
    description: t('全球实时天气数据查询，支持历史天气、天气预报、气象预警等功能'),
    icon: (
      <svg
        viewBox='0 0 24 24'
        className='w-8 h-8'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
      >
        <path d='M17.5 19c0-3.037-2.463-5.5-5.5-5.5S6.5 15.963 6.5 19' />
        <circle cx='12' cy='10' r='4' />
        <path d='M8 10V4a4 4 0 0 1 8 0v6' />
      </svg>
    ),
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    tags: [t('生活服务'), t('数据查询')],
    views: 567,
    comments: 23,
  },
  {
    id: 5,
    name: t('Document Parser'),
    description: t('智能文档解析服务，支持PDF、Word、Excel等多种格式的内容提取与分析'),
    icon: (
      <svg
        viewBox='0 0 24 24'
        className='w-8 h-8'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
      >
        <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
        <polyline points='14 2 14 8 20 8' />
        <line x1='16' y1='13' x2='8' y2='13' />
        <line x1='16' y1='17' x2='8' y2='17' />
        <polyline points='10 9 9 9 8 9' />
      </svg>
    ),
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    tags: [t('企业服务'), t('效率工具')],
    views: 2134,
    comments: 178,
  },
  {
    id: 6,
    name: t('Translation Master'),
    description: t('多语言翻译服务，支持100+语言互译，专业术语翻译，文档批量翻译'),
    icon: (
      <svg
        viewBox='0 0 24 24'
        className='w-8 h-8'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
      >
        <circle cx='12' cy='12' r='10' />
        <line x1='2' y1='12' x2='22' y2='12' />
        <path d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' />
      </svg>
    ),
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    tags: [t('内容生成'), t('企业服务')],
    views: 1876,
    comments: 134,
  },
  {
    id: 7,
    name: t('Cloud Storage Manager'),
    description: t('统一管理多云存储服务，支持AWS S3、阿里云OSS、腾讯云COS等'),
    icon: (
      <svg
        viewBox='0 0 24 24'
        className='w-8 h-8'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
      >
        <path d='M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z' />
      </svg>
    ),
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
    tags: [t('云原生'), t('开发者工具')],
    views: 923,
    comments: 67,
  },
  {
    id: 8,
    name: t('Search Engine API'),
    description: t('聚合多搜索引擎结果，支持网页搜索、图片搜索、新闻搜索等功能'),
    icon: (
      <svg
        viewBox='0 0 24 24'
        className='w-8 h-8'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
      >
        <circle cx='11' cy='11' r='8' />
        <path d='m21 21-4.35-4.35' />
      </svg>
    ),
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    tags: [t('搜索工具'), t('数据查询')],
    views: 1567,
    comments: 98,
  },
  {
    id: 9,
    name: t('Email Automation'),
    description: t('邮件自动化处理服务，支持邮件分类、自动回复、批量发送等功能'),
    icon: (
      <svg
        viewBox='0 0 24 24'
        className='w-8 h-8'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
      >
        <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' />
        <polyline points='22,6 12,13 2,6' />
      </svg>
    ),
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    tags: [t('企业服务'), t('效率工具')],
    views: 743,
    comments: 56,
  },
  {
    id: 10,
    name: t('Code Review Assistant'),
    description: t('AI驱动的代码审查助手，自动检测代码问题、提供优化建议'),
    icon: (
      <svg
        viewBox='0 0 24 24'
        className='w-8 h-8'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
      >
        <polyline points='16 18 22 12 16 6' />
        <polyline points='8 6 2 12 8 18' />
      </svg>
    ),
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    tags: [t('开发者工具'), t('效率工具')],
    views: 2890,
    comments: 234,
  },
  {
    id: 11,
    name: t('Meeting Transcription'),
    description: t('会议语音转文字服务，支持实时转录、多语言识别、智能摘要生成'),
    icon: (
      <svg
        viewBox='0 0 24 24'
        className='w-8 h-8'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
      >
        <path d='M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z' />
        <path d='M19 10v2a7 7 0 0 1-14 0v-2' />
        <line x1='12' y1='19' x2='12' y2='23' />
        <line x1='8' y1='23' x2='16' y2='23' />
      </svg>
    ),
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    tags: [t('企业服务'), t('AI生成')],
    views: 1123,
    comments: 89,
  },
  {
    id: 12,
    name: t('Calendar Sync'),
    description: t('多平台日历同步服务，支持Google Calendar、Outlook、钉钉日历等'),
    icon: (
      <svg
        viewBox='0 0 24 24'
        className='w-8 h-8'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
      >
        <rect x='3' y='4' width='18' height='18' rx='2' ry='2' />
        <line x1='16' y1='2' x2='16' y2='6' />
        <line x1='8' y1='2' x2='8' y2='6' />
        <line x1='3' y1='10' x2='21' y2='10' />
      </svg>
    ),
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600',
    tags: [t('效率工具'), t('企业服务')],
    views: 654,
    comments: 34,
  },
  {
    id: 13,
    name: t('Data Visualization'),
    description: t('数据可视化服务，自动生成图表、仪表盘，支持多种图表类型'),
    icon: (
      <svg
        viewBox='0 0 24 24'
        className='w-8 h-8'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
      >
        <path d='M3 3v18h18' />
        <path d='M18 17V9' />
        <path d='M13 17V5' />
        <path d='M8 17v-3' />
      </svg>
    ),
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
    tags: [t('数据查询'), t('AI生成')],
    views: 1432,
    comments: 112,
  },
  {
    id: 14,
    name: t('News Aggregator'),
    description: t('新闻聚合服务，实时抓取全球新闻，支持关键词订阅、智能推荐'),
    icon: (
      <svg
        viewBox='0 0 24 24'
        className='w-8 h-8'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
      >
        <path d='M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2' />
        <path d='M18 14h-8' />
        <path d='M15 18h-5' />
        <path d='M10 6h8v4h-8V6Z' />
      </svg>
    ),
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    tags: [t('搜索工具'), t('内容生成')],
    views: 876,
    comments: 67,
  },
  {
    id: 15,
    name: t('Task Manager Pro'),
    description: t('任务管理服务，支持任务分配、进度跟踪、团队协作等功能'),
    icon: (
      <svg
        viewBox='0 0 24 24'
        className='w-8 h-8'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
      >
        <path d='M9 11l3 3L22 4' />
        <path d='M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11' />
      </svg>
    ),
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    tags: [t('效率工具'), t('企业服务')],
    views: 2134,
    comments: 145,
  },
];

// 服务卡片组件
const ServiceCard = ({ service, onClick }) => {
  return (
    <div
      onClick={onClick}
      className='group bg-white rounded-xl p-5 shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1'
    >
      {/* 图标 */}
      <div
        className={`w-14 h-14 rounded-xl ${service.iconBg} ${service.iconColor} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}
      >
        {service.icon}
      </div>

      {/* 名称 */}
      <h3 className='text-base font-semibold text-gray-900 mb-2 line-clamp-1'>
        {service.name}
      </h3>

      {/* 描述 */}
      <p className='text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed h-10'>
        {service.description}
      </p>

      {/* 标签 */}
      <div className='flex flex-wrap gap-2 mb-4'>
        {service.tags.map((tag, idx) => (
          <span
            key={idx}
            className='px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-md'
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 浏览量和评论数 */}
      <div className='flex items-center gap-4 text-xs text-gray-400 pt-3'>
        <span className='flex items-center gap-1'>
          <svg
            viewBox='0 0 24 24'
            className='w-4 h-4'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
          >
            <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
            <circle cx='12' cy='12' r='3' />
          </svg>
          {service.views}
        </span>
        <span className='flex items-center gap-1'>
          <svg
            viewBox='0 0 24 24'
            className='w-4 h-4'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
          >
            <path d='M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z' />
          </svg>
          {service.comments}
        </span>
      </div>
    </div>
  );
};

// 顶部导航栏组件
const HeaderNav = ({ onCreateClick, t }) => (
  <div className='flex items-center justify-between px-6 py-4 bg-white'>
    <div className='flex items-center gap-2'>
      <span className='text-xl font-bold text-gray-900'>{t('MCP 广场')}</span>
    </div>
    <div className='flex items-center gap-4'>
      {/* <button className='text-sm text-gray-600 hover:text-gray-900 transition-colors'>
        使用指南
      </button> */}
      <Button
        theme='solid'
        type='primary'
        icon={<IconPlus />}
        className='!bg-purple-600 hover:!bg-purple-700'
        onClick={onCreateClick}
      >
        {t('创建')}
      </Button>
    </div>
  </div>
);

// 左侧侧边栏组件
const Sidebar = ({
  activeRecommend,
  setActiveRecommend,
  activeCategory,
  setActiveCategory,
  categories,
}) => (
  <div className='w-60 bg-white h-full overflow-y-auto'>
    {/* 分割线 */}
    <div className='h-px bg-gray-100 mx-1'></div>

    {/* 分类区 */}
    <div className='p-4'>
      <div className='space-y-1'>
        {categories.map((category) => (
          
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            style={{
                backgroundColor: activeCategory === category.id ? '#111827' : '#f3f4f6',
                color: activeCategory === category.id ? '#ffffff' : '#4b5563',
                border: '1px solid #e5e7eb',
                padding: '0.375rem 0.75rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                transition: 'all 0.2s ease-in-out',
              }}
            className={`w-full flex items-center justify-between px-10 py-3 rounded-lg text-sm transition-colors ${
              activeCategory === category.id
                ? 'bg-gray-900 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{category.name}</span>
            <span
              className={`text-xs ${
                activeCategory === category.id
                  ? 'text-purple-500'
                  : 'text-gray-400'
              }`}
            >
              ({category.count})
            </span>
          </button>
        ))}
      </div>
    </div>
  </div>
);

// 主内容区组件
const MainContent = ({
  searchQuery,
  setSearchQuery,
  sortValue,
  setSortValue,
  filteredServices,
  onRefresh,
  activeCategory,
  sortOptions,
  t,
}) => {
  const sortMenu = (
    <Dropdown.Menu>
      {sortOptions.map((option) => (
        <Dropdown.Item
          key={option.value}
          onClick={() => setSortValue(option.value)}
          active={sortValue === option.value}
        >
          {option.label}
        </Dropdown.Item>
      ))}
    </Dropdown.Menu>
  );

  return (
    <div className='flex-1 flex flex-col h-full overflow-hidden'>
      {/* 筛选栏 */}
      <div className='flex items-center justify-between px-6 py-4 bg-white'>
        <div className='flex items-center gap-3'>
          <Input
            prefix={<IconSearch className='text-gray-400' />}
            placeholder={t('请输入，支持模糊搜索')}
            value={searchQuery}
            onChange={(value) => setSearchQuery(value)}
            className='w-64 !bg-gray-50'
          />
          <Dropdown trigger='click' position='bottomRight' content={sortMenu}>
            <Button
              iconRight={<IconChevronDown />}
              className='!bg-white !border-gray-100'
            >
              {sortOptions.find((o) => o.value === sortValue)?.label}
            </Button>
          </Dropdown>
          <Button
            icon={<IconRefresh />}
            onClick={onRefresh}
            className='!bg-white !border-gray-100'
          />
        </div>
      </div>

      {/* 服务卡片列表 */}
      <div className='flex-1 overflow-y-auto p-6'>
        {filteredServices.length > 0 ? (
          <div className='grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4'>
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onClick={() => console.log('点击了:', service.name)}
              />
            ))}
          </div>
        ) : activeCategory === 'my' ? (
          <div className='flex flex-col items-center justify-center h-full text-gray-400'>
            <p className='text-lg'>{t('暂无数据')}</p>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center h-full text-gray-400'>
            <IconSearch size={48} className='mb-4 opacity-50' />
            <p className='text-lg'>{t('未找到相关服务')}</p>
            <p className='text-sm mt-2'>{t('请尝试调整搜索关键词')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// 右侧悬浮按钮组件
const FloatingButtons = () => (
  <div className='fixed right-6 bottom-6 flex flex-col gap-3 z-50'>
    <button
      className='w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-purple-600 hover:shadow-xl transition-all duration-300'
      title='在线咨询'
    >
      <svg
        viewBox='0 0 24 24'
        className='w-5 h-5'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
      >
        <path d='M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z' />
      </svg>
    </button>
    <button
      className='w-12 h-12 bg-purple-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-purple-700 hover:shadow-xl transition-all duration-300'
      title='AI助理'
    >
      <svg
        viewBox='0 0 24 24'
        className='w-5 h-5'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
      >
        <rect x='3' y='11' width='18' height='10' rx='2' />
        <circle cx='12' cy='5' r='2' />
        <path d='M12 7v4' />
        <line x1='8' y1='16' x2='8' y2='16.01' />
        <line x1='16' y1='16' x2='16' y2='16.01' />
      </svg>
    </button>
  </div>
);

// 创建选项卡片组件
const CreateOptionCard = ({ option, onClick }) => (
  <div
    onClick={() => onClick(option)}
    className='group flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-white cursor-pointer transition-all duration-300 hover:border-purple-200 hover:shadow-md hover:-translate-y-0.5'
  >
    <div
      className={`w-12 h-12 rounded-xl ${option.iconBg} ${option.iconColor} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}
    >
      {option.icon}
    </div>
    <div className='flex-1 min-w-0'>
      <h4 className='text-base font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors'>
        {option.title}
      </h4>
      <p className='text-sm text-gray-500 line-clamp-2'>{option.description}</p>
    </div>
  </div>
);

// 主页面组件
const MCPMarket = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRecommend, setActiveRecommend] = useState('popular');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortValue, setSortValue] = useState('all');
  const [createModalVisible, setCreateModalVisible] = useState(false);

  // 获取翻译后的数据
  const categories = useMemo(() => getCategories(t), [t]);
  const sortOptions = useMemo(() => getSortOptions(t), [t]);
  const createOptions = useMemo(() => getCreateOptions(t), [t]);
  const servicesData = useMemo(() => getServicesData(t), [t]);

  // 筛选服务
  const filteredServices = useMemo(() => {
    // 我的开通分类 - 返回空数组表示暂无数据
    if (activeCategory === 'my') {
      return [];
    }

    let result = [...servicesData];

    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (service) =>
          service.name.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query) ||
          service.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    // 分类筛选
    if (activeCategory !== 'all') {
      const categoryMap = {
        cloud: [t('云原生')],
        devtools: [t('开发者工具')],
        search: [t('搜索工具')],
        data: [t('数据查询')],
        content: [t('内容生成'), t('AI生成')],
        enterprise: [t('企业服务')],
        life: [t('生活服务')],
      };
      const keywords = categoryMap[activeCategory] || [];
      if (keywords.length > 0) {
        result = result.filter((service) =>
          service.tags.some((tag) =>
            keywords.some((keyword) => tag.includes(keyword)),
          ),
        );
      }
    }

    // 排序
    if (sortValue === 'latest') {
      result = result.sort((a, b) => b.id - a.id);
    } else if (sortValue === 'hottest') {
      result = result.sort((a, b) => b.views - a.views);
    }

    return result;
  }, [searchQuery, activeCategory, sortValue, servicesData, t]);

  const handleRefresh = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setSortValue('all');
  };

  const handleCreateClick = () => {
    setCreateModalVisible(true);
  };

  const handleCreateOptionClick = (option) => {
    setCreateModalVisible(false);
    Toast.info(`${t('选择了')}: ${option.title}`);
    console.log('创建MCP类型:', option.id);
  };

  return (
    <div className='h-full flex flex-col bg-gray-50 pt-20'>
      {/* 顶部导航栏 */}
      <HeaderNav onCreateClick={handleCreateClick} t={t} />

      {/* 主体内容 */}
      <div className='flex-1 flex overflow-hidden'>
        {/* 左侧侧边栏 */}
        <Sidebar
          activeRecommend={activeRecommend}
          setActiveRecommend={setActiveRecommend}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          categories={categories}
        />

        {/* 中间主内容区 */}
        <MainContent
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortValue={sortValue}
          setSortValue={setSortValue}
          filteredServices={filteredServices}
          onRefresh={handleRefresh}
          activeCategory={activeCategory}
          sortOptions={sortOptions}
          t={t}
        />
      </div>

      {/* 右侧悬浮按钮 */}
      <FloatingButtons />

      {/* 创建MCP弹窗 */}
      <Modal
        title={t('创建 MCP')}
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        width={520}
        centered
      >
        <div className='grid grid-cols-1 gap-3 py-2'>
          {createOptions.map((option) => (
            <CreateOptionCard
              key={option.id}
              option={option}
              onClick={handleCreateOptionClick}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default MCPMarket;
