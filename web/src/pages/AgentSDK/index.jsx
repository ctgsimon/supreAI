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

import React from 'react';
import { Typography, Card, Button } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';
import {
  IconLink,
  IconCode,
  IconArrowRight,
} from '@douyinfe/semi-icons';
import PageLayout from '../../components/layout/PageLayout';

const { Title, Text } = Typography;



// SDK 平台卡片组件
const SDKCard = ({ logo, title, subtitle, description, domain, link, color, officialDomainLabel }) => (
  <Card className="!border !border-gray-200 !rounded-xl !shadow-sm !bg-white !p-6 !hover:!shadow-md !transition-all !duration-300">
    <div className="flex items-start gap-4 mb-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: color }}
      >
        {logo}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
    <p className="text-sm text-gray-600 leading-relaxed mb-4">{description}</p>
    <div className="flex items-center gap-2 text-sm text-gray-500 pt-4 border-t border-gray-100">
      <IconLink size={14} className="text-gray-400" />
      <span className="text-gray-400">{officialDomainLabel}</span>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-700 ml-auto"
      >
        {domain}
      </a>
    </div>
  </Card>
);

// 谷歌 Logo
const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

// 阿里云 Logo
const AliyunLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
    <path
      d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 字节跳动 Logo
const ByteDanceLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
    <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.5L19.5 8 12 11.5 4.5 8 12 4.5zM4 9.5l7 3.5v6.5l-7-3.5V9.5zm9 10v-6.5l7-3.5v6.5l-7 3.5z" />
  </svg>
);

const AgentSDK = () => {
  const { t } = useTranslation();

  const sdkPlatforms = [
    {
      logo: <GoogleLogo />,
      title: t('谷歌 SDK 控制台'),
      subtitle: t('Google Cloud & Android 生态'),
      description: t('管理Google Cloud API、Android SDK、AI/ML模型等全球开发者生态资源'),
      domain: 'console.cloud.google.com',
      link: 'https://google.github.io/adk-docs/',
      color: '#4285F4',
    },
    {
      logo: <AliyunLogo />,
      title: t('大模型服务平台百炼控制台'),
      subtitle: t('一站式云服务开发平台'),
      description: t('管理阿里云全场景云服务SDK、AccessKey、API网关等本土化云资源'),
      domain: 'developer.aliyun.com',
      link: 'https://bailian.console.aliyun.com/',
      color: '#FF6A00',
    },
    {
      logo: <ByteDanceLogo />,
      title: t('火山引擎控制台'),
      subtitle: t('企业级 AI Agent 平台'),
      description: t('快速构建和部署 Agent 应用到火山引擎 AgentKit Platform'),
      domain: 'developer.bytedance.com',
      link: 'https://console.volcengine.com/agentkit',
      color: '#3C8CFF',
    },
  ];

  const handleOpenPlayground = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token || '';
    // 获取当前语言设置
    const currentLang = localStorage.getItem('i18nextLng') || 'zh';
    // const apiUrl = `${window.location.origin}/v1/chat/completions`;
    window.open(
      `/adk/260206.html?lang=${currentLang}`,
      '_blank',
    );
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-50 to-white overflow-hidden  pt-16">
        {/* Hero 区域 */}
        <div className="bg-white/80 backdrop-blur-sm flex-shrink-0">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5">
                {/* <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <IconBox className="w-5 h-5 text-white" />
                </div> */}
                <Title heading={3} className="mb-0 text-gray-900">{t('SDK 控制台统一入口')}</Title>
              </div>
              <Text
            className="text-base leading-relaxed max-w-3xl mx-auto block"
            style={{ color: '#6b7280' }}
          >
            {t('一站式聚合主流厂商Agent SDK控制台，简化多平台SDK集成流程，降低开发成本，提升研发效率。覆盖云服务、AI能力、开放平台等全场景SDK，满足企业级应用开发的多元化需求。')}
          </Text>
              <div className="mt-8">
                <button
                  onClick={handleOpenPlayground}
                  className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold text-base rounded-full shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 ease-out overflow-hidden"
                >
                  {/* 背景光效 */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                  
                  {/* 图标 */}
                  <span className="relative flex items-center justify-center w-10 h-10 bg-white/20 rounded-full backdrop-blur-sm">
                    <IconCode size={20} className="relative" />
                  </span>
                  
                  {/* 文字 */}
                  <span className="relative">{t('打开 Playground')}</span>
                  
                  {/* 箭头 */}
                  <IconArrowRight 
                    size={18} 
                    className="relative transition-transform duration-300 group-hover:translate-x-1" 
                  />
                </button>
                
                {/* 辅助文字 */}
                <p className="mt-3 text-sm text-gray-500 flex items-center gap-2" style={{ color: '#6b7280' }}>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  {t('在线体验 LLM SDK 功能')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Playground 演示视频 */}
        <div className="mb-16">
          <video
            src="/20260210.mp4"
            autoPlay
            loop
            muted
            playsInline
            controls
            className="w-full h-auto max-h-[500px]"
            style={{ objectFit: 'contain' }}
          />
        </div>

        {/* SDK 平台卡片 */}
        <div className="grid grid-cols-3 gap-6">
          {sdkPlatforms.map((platform, index) => (
            <SDKCard key={index} {...platform} officialDomainLabel={t('官方域名')} />
          ))}
        </div>
    </div>
  );
};

export default AgentSDK;
