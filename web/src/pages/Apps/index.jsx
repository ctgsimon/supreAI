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

import React, { useState, useEffect } from 'react';
import { Typography, Input, Badge } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';
import {
  IconSearch,
  IconEyeOpened,
  IconLikeThumb,
  IconDownload,
  IconStar,
  IconBolt,
} from '@douyinfe/semi-icons';

const { Title, Text } = Typography;

// SVG 图标组件
const icons = {
  toolkit: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  robot: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="11" width="18" height="10" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="5" r="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 7v4" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="8" y1="16" x2="8" y2="16.01" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="16" y1="16" x2="16" y2="16.01" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 20V10M12 20V4M6 20v-6" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="2" y="20" width="20" height="2" rx="1"/>
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  write: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  target: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="6" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  car: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="6.5" cy="16.5" r="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="16.5" cy="16.5" r="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="m21 21-4.35-4.35" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  shopping: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 10a4 4 0 0 1-8 0" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  video: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="20" height="20" rx="2.18" strokeLinecap="round" strokeLinejoin="round"/>
      <polygon points="10,8 16,12 10,16 10,8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  file: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="14,2 14,8 20,8" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="10,9 9,9 8,9" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  drama: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2a3 3 0 0 0-3 3v14a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19 10v4a3 3 0 0 1-6 0" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 10v4a3 3 0 0 0 6 0" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="12" y1="18" x2="12.01" y2="18" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  diamond: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 3h12l4 6-10 13L2 9l4-6z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 22V9" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="m12 9 8.5-6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="m12 9-8.5-6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  book: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  burst: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  camera: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="13" r="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  art: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 19l7-7 3 3-7 7-3-3z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 2l7.586 7.586" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="11" cy="11" r="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  mic: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="12" y1="19" x2="12" y2="23" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="8" y1="23" x2="16" y2="23" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

// 分类数据 - 使用函数获取以支持国际化
const getCategories = (t) => [
  { id: 'all', name: t('全部'), icon: '✨' },
  { id: 'agent', name: t('智能体'), icon: '🤖' },
  { id: 'workflow', name: t('工作流'), icon: '⚡' },
  { id: 'solution', name: t('解决方案'), icon: '💡' },
  { id: 'tool', name: t('工具'), icon: '🛠️' },
];

// 应用数据 - 使用函数获取以支持国际化
const getAppsData = (t) => [
  {
    id: 1,
    name: t('多模态交互开发套件'),
    description: t('提供音视频对话、语音合成、多模态理解等能力'),
    icon: icons.toolkit,
    gradient: 'from-blue-500 via-cyan-400 to-teal-400',
    tags: [t('多模态'), t('语音合成')],
    views: 1205,
    likes: 89,
    rating: 4.8,
    isHot: true,
  },
  {
    id: 2,
    name: t('通义晓蜜 CCAI'),
    description: t('智能对话分析系统，提供情感分析、意图识别能力'),
    icon: icons.robot,
    gradient: 'from-purple-500 via-pink-500 to-rose-400',
    tags: [t('智能客服'), t('情感分析')],
    views: 2341,
    likes: 156,
    rating: 4.9,
    isNew: true,
  },
  {
    id: 3,
    name: t('全妙-VOC挖掘'),
    description: t('企业声音挖掘工具，自动分析用户评论和反馈'),
    icon: icons.chart,
    gradient: 'from-emerald-400 via-teal-400 to-cyan-400',
    tags: [t('VOC分析'), t('用户洞察')],
    views: 892,
    likes: 67,
    rating: 4.6,
  },
  {
    id: 4,
    name: t('通义晓蜜-Agent'),
    description: t('智能客服对话机器人，支持多轮对话和知识库问答'),
    icon: icons.chat,
    gradient: 'from-orange-400 via-amber-400 to-yellow-400',
    tags: [t('智能客服'), t('对话机器人')],
    views: 3456,
    likes: 234,
    rating: 4.9,
    isHot: true,
  },
  {
    id: 5,
    name: t('文章风格学习'),
    description: t('学习特定作者或品牌的写作风格，生成风格一致内容'),
    icon: icons.write,
    gradient: 'from-rose-400 via-pink-400 to-fuchsia-400',
    tags: [t('内容创作'), t('风格学习')],
    views: 1567,
    likes: 123,
    rating: 4.7,
  },
  {
    id: 6,
    name: t('听悟-智能纪要'),
    description: t('智能会议记录工具，自动转录语音和生成纪要'),
    icon: icons.target,
    gradient: 'from-cyan-400 via-blue-400 to-indigo-400',
    tags: [t('会议纪要'), t('语音转录')],
    views: 2134,
    likes: 189,
    rating: 4.8,
    isHot: true,
  },
  {
    id: 7,
    name: t('汽车销售洞察'),
    description: t('针对汽车销售场景的服务质量分析工具'),
    icon: icons.car,
    gradient: 'from-indigo-400 via-purple-400 to-pink-400',
    tags: [t('汽车销售'), t('服务质检')],
    views: 678,
    likes: 45,
    rating: 4.5,
  },
  {
    id: 8,
    name: t('通用服务洞察'),
    description: t('通用型服务质量分析工具，适用于多种服务场景'),
    icon: icons.search,
    gradient: 'from-green-400 via-emerald-400 to-teal-400',
    tags: [t('服务质检'), t('通用分析')],
    views: 1234,
    likes: 98,
    rating: 4.6,
  },
  {
    id: 9,
    name: t('电商文案生成'),
    description: t('专为电商场景设计的文案生成工具'),
    icon: icons.shopping,
    gradient: 'from-amber-400 via-orange-400 to-red-400',
    tags: [t('电商'), t('文案生成')],
    views: 2890,
    likes: 234,
    rating: 4.8,
    isHot: true,
  },
  {
    id: 10,
    name: t('视频理解'),
    description: t('视频内容理解工具，自动分析和生成摘要'),
    icon: icons.video,
    gradient: 'from-violet-400 via-purple-400 to-fuchsia-400',
    tags: [t('视频理解标签'), t('内容分析')],
    views: 1567,
    likes: 134,
    rating: 4.7,
  },
  {
    id: 11,
    name: t('ChatPDF'),
    description: t('基于企业知识库的文档问答系统'),
    icon: icons.file,
    gradient: 'from-sky-400 via-blue-400 to-indigo-400',
    tags: [t('知识库'), t('文档问答')],
    views: 4567,
    likes: 389,
    rating: 4.9,
    isHot: true,
  },
  {
    id: 12,
    name: t('剧本创作助手'),
    description: t('支持剧情构思、角色设定、对话生成'),
    icon: icons.drama,
    gradient: 'from-fuchsia-400 via-pink-400 to-rose-400',
    tags: [t('剧本创作'), t('影视互娱')],
    views: 2345,
    likes: 198,
    rating: 4.8,
    isNew: true,
  },
  {
    id: 13,
    name: t('车机问答系统'),
    description: t('车载智能问答系统，支持实时热点信息查询'),
    icon: icons.phone,
    gradient: 'from-teal-400 via-cyan-400 to-blue-400',
    tags: [t('车机系统'), t('智能问答')],
    views: 890,
    likes: 67,
    rating: 4.5,
  },
  {
    id: 14,
    name: t('线索挖掘工具'),
    description: t('企业销售线索挖掘工具，识别潜在客户'),
    icon: icons.diamond,
    gradient: 'from-yellow-400 via-amber-400 to-orange-400',
    tags: [t('销售线索'), t('客户挖掘')],
    views: 1234,
    likes: 89,
    rating: 4.6,
  },
  {
    id: 15,
    name: t('内容安全审核'),
    description: t('自动识别违规内容、敏感信息、不当言论'),
    icon: icons.shield,
    gradient: 'from-red-400 via-rose-400 to-pink-400',
    tags: [t('内容审核'), t('安全合规')],
    views: 3456,
    likes: 267,
    rating: 4.8,
    isHot: true,
  },
  {
    id: 16,
    name: t('小说创作助手'),
    description: t('支持故事大纲生成、角色设定、情节发展'),
    icon: icons.book,
    gradient: 'from-blue-400 via-indigo-400 to-violet-400',
    tags: [t('小说创作'), t('故事生成')],
    views: 4567,
    likes: 389,
    rating: 4.9,
  },
  {
    id: 17,
    name: t('公众号爆文创作'),
    description: t('微信公众号文章创作工具，支持热点追踪'),
    icon: icons.burst,
    gradient: 'from-green-400 via-lime-400 to-yellow-400',
    tags: [t('公众号'), t('内容创作')],
    views: 5678,
    likes: 456,
    rating: 4.9,
    isHot: true,
  },
  {
    id: 18,
    name: t('产品视频生成'),
    description: t('电商视频生成工具，将商品信息转化为营销视频'),
    icon: icons.camera,
    gradient: 'from-pink-400 via-rose-400 to-red-400',
    tags: [t('电商'), t('视频生成')],
    views: 2345,
    likes: 234,
    rating: 4.7,
    isNew: true,
  },
  {
    id: 19,
    name: t('短剧生成工具'),
    description: t('短剧视频生成工具，支持动漫风格'),
    icon: icons.art,
    gradient: 'from-purple-400 via-violet-400 to-indigo-400',
    tags: [t('短剧'), t('动漫')],
    views: 3456,
    likes: 345,
    rating: 4.8,
  },
  {
    id: 20,
    name: t('语音对话机器人'),
    description: t('语音对话机器人，支持自然语言交互'),
    icon: icons.mic,
    gradient: 'from-cyan-400 via-blue-400 to-sky-400',
    tags: [t('语音对话'), t('智能客服')],
    views: 2890,
    likes: 234,
    rating: 4.8,
    isHot: true,
  },
];

// 评分星星组件
const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <IconStar
        key={star}
        size={10}
        className={star <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}
      />
    ))}
    <span className="text-xs text-gray-400 ml-1">{rating}</span>
  </div>
);

// 应用卡片组件
const AppCard = ({ app, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
      }}
    >
      {/* 卡片主体 */}
      <div className="group bg-white rounded-xl p-5 shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
        {/* 背景渐变光晕 */}
        <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${app.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
        
        {/* 徽章 */}
        {app.isHot && (
          <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-xs font-bold text-white shadow-lg shadow-orange-500/30">
            <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor">
              <path d="M12 2c0 3.33-2.5 5.5-2.5 8.5 0 1.5.5 2.5 1.5 3.5-2.5.5-4.5 2.5-4.5 5 0 2.5 2 4.5 4.5 4.5h2c2.5 0 4.5-2 4.5-4.5 0-2.5-2-4.5-4.5-5 1-1 1.5-2 1.5-3.5C14.5 7.5 12 5.33 12 2z"/>
            </svg>
            HOT
          </div>
        )}
        {app.isNew && (
          <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-xs font-bold text-white shadow-lg shadow-green-500/30">
            <IconBolt size={12} />
            NEW
          </div>
        )}

        {/* 图标 */}
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.gradient} p-0.5 mb-5 group-hover:scale-110 transition-transform duration-300`}>
          <div className="w-full h-full bg-gray-900 rounded-2xl flex items-center justify-center text-white">
            {app.icon}
          </div>
        </div>

        {/* 内容 */}
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
          {app.name}
        </h3>
        
        <p className="text-sm text-gray-400 mb-4 line-clamp-2 leading-relaxed min-h-[40px]">
          {app.description}
        </p>

        <div className="flex-grow min-h-[px]"></div>

        {/* 标签 */}
        <div className="flex flex-nowrap gap-2 mb-3 overflow-hidden h-7 items-center">
          {app.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 text-xs font-medium bg-gray-800/80 text-gray-300 rounded-full border border-gray-700/50 max-w-[120px] truncate whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 底部信息 */}
        <div className="flex items-center pt-3 border-t border-gray-700/50">
          <StarRating rating={app.rating} />

          <div className="flex-grow min-w-2"></div>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1 hover:text-blue-400 transition-colors">
              <IconEyeOpened size={12} />
              {app.views.toLocaleString()}
            </span>
            <span className="flex items-center gap-1 hover:text-pink-400 transition-colors">
              <IconLikeThumb size={12} />
              {app.likes}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hero 区域
const HeroSection = ({ t }) => (
  <div className="relative min-h-[50vh] flex items-center justify-center overflow-hidden mb-[-105px]">
    {/* 背景动画 */}
    <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950">
      {/* 动态光晕 */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px]"></div>
    </div>

    {/* 网格背景 */}
    <div 
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }}
    ></div>

    {/* 内容 */}
    <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-0">
      
      <h1 className="text-5xl md:text-6xl font-bold mb-6">
        <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          {t('发现下一代AI 应用')}
        </span>
      </h1>
      
      <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
        {t('探索基于大模型的智能应用生态，从智能客服到内容创作，助力您的业务实现智能化升级')}
      </p>

      <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <span className="text-blue-400 font-bold">20+</span>
          </div>
          <span>{t('精选应用')}</span>
        </div>
        <div className="w-px h-8 bg-gray-700"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <span className="text-purple-400 font-bold">8</span>
          </div>
          <span>{t('应用分类')}</span>
        </div>
        <div className="w-px h-8 bg-gray-700"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
            <span className="text-pink-400 font-bold">10k+</span>
          </div>
          <span>{t('活跃用户')}</span>
        </div>
      </div>
    </div>
  </div>
);

// 搜索和筛选栏
const FilterBar = ({ searchQuery, setSearchQuery, activeCategory, setActiveCategory, categories, t }) => (
  <div className="w-full sticky top-16 z-40 bg-gray-900/80 backdrop-blur-xl py-4 mb-3">
    <div className="w-full max-w-7xl mx-auto px-6">
      <div className="w-full flex flex-col md:flex-row items-center gap-4">
        {/* 搜索框 */}
        <div className="relative w-full md:w-96">
          <Input
            prefix={<IconSearch className="text-gray-500" />}
            placeholder={t('搜索应用') + '...'}
            value={searchQuery}
            onChange={(value) => setSearchQuery(value)}
            className="w-full !bg-gray-800/50 !border-gray-700 !text-white !rounded-xl hover:!border-gray-600 focus:!border-blue-500 transition-colors"
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"></div>
        </div>

        {/* 分类标签 */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Apps = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // 获取分类数据
  const categories = getCategories(t);

  // 获取应用数据
  const appsData = getAppsData(t);

  // 筛选应用
  const filteredApps = appsData.filter((app) => {
    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        app.name.toLowerCase().includes(query) ||
        app.description.toLowerCase().includes(query) ||
        app.tags.some((tag) => tag.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    // 分类筛选
    if (activeCategory !== 'all') {
      const categoryMap = {
        agent: [t('智能体'), 'Agent', t('智能客服'), t('对话机器人')],
        workflow: [t('工作流'), t('VOC分析'), t('服务质检')],
        solution: [t('解决方案'), t('内容审核'), t('知识库')],
        tool: [t('工具'), t('创作'), t('生成')],
      };
      const keywords = categoryMap[activeCategory] || [];
      const matchesCategory = app.tags.some((tag) =>
        keywords.some((keyword) => tag.includes(keyword))
      ) || keywords.some((keyword) => app.name.includes(keyword));
      if (!matchesCategory) return false;
    }

    return true;
  });

  return (
    <div className="w-full min-h-screen bg-gray-950">
      {/* 全局样式 */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Hero 区域 */}
      <HeroSection t={t} />

      {/* 筛选栏 */}
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categories={categories}
        t={t}
      />

      {/* 应用网格 */}
      <div className="w-full mx-auto px-6 pb-20">
        <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-6">
          {filteredApps.map((app, index) => (
            <AppCard key={app.id} app={app} index={index} />
          ))}
        </div>

        {/* 空状态 */}
        {filteredApps.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800/50 flex items-center justify-center">
              <IconSearch size={40} className="text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {t('未找到相关应用')}
            </h3>
            <p className="text-gray-500">
              {t('尝试调整筛选条件或搜索关键词')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Apps;
