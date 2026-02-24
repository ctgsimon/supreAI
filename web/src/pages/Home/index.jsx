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
import { Button, Typography, Card, Tag } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';
import { IconPlay, IconFile, IconChevronRight } from '@douyinfe/semi-icons';
import { Link } from 'react-router-dom';

const { Text, Title } = Typography;

const Home = () => {
  const { t } = useTranslation();

  const agentTemplates = [
    {
      title: t('客户服务智能体助手'),
      description: t('这是一个智能客服系统，专门用于处理客户咨询和售后服务需求，能够提供专业、高效的客户服务体验'),
      icon: '/service.jpg',
    },
    {
      title: t('智能写作助手'),
      description: t('这是一个智能写作助手，将文字构思转化为适配多元创作需求的优质文案与结构化文稿的完整技能，适用于各类内容创作者'),
      icon: '/write.jpg',
    },
    {
      title: t('智能代码生成助手'),
      description: t('这是一个智能编程助手系统，专门用于协助用户解决各类编程问题，可提供专业、高效的编程辅助体验'),
      icon: '/code.jpg',
    },
  ];

  const myAgents = [
    {
      name: 'DataAnalysis_test',
      id: 'rydeb9oy2o54ppxtvtyvz',
      tools: ['SandboxTool'],
      features: ['Memory'],
    },
  ];

  return (
    <div className='w-full min-h-screen bg-white pt-20'>
      <div className='max-w-[140rem] 3xl:max-w-[160rem] 4xl:max-w-[200rem] 5xl:max-w-[240rem] mx-auto px-6 sm:px-8 lg:px-10 xl:px-12 3xl:px-16 4xl:px-20 5xl:px-24 py-8'>
        <div className='mb-10'>
          <Title
            level={1}
            className='text-3xl font-semibold text-gray-900 !mb-4'
          >
            {t('快速构建和部署生产可用的')}{' '}
            <span className='text-[#722ed1]'>Agent</span>
          </Title>
          <Text
            className='text-sm mb-4 leading-relaxed max-w-3xl 2xl:max-w-4xl 3xl:max-w-5xl 4xl:max-w-6xl 5xl:max-w-7xl block'
            style={{ color: '#6b7280' }}
          >
            {t('AgentKit 依托大量AI应用研发经验与企业服务实践构建的智能体全生命周期平台，通过长短记忆管理、知识库管理、MCP 生态、全链路应用观测等核心能力，帮助高效构建企业级 Agent')}
          </Text>

          <div className='flex gap-3'>
            <Button
              type='primary'
              theme='solid'
              size='default'
              className='!bg-[#1890ff] !hover:bg-[#40a9ff] !text-white !rounded !px-5 !py-1.5 !h-auto !text-sm'
            >
              {t('快速开始')}
            </Button>
            <Button
              type='secondary'
              theme='borderless'
              size='default'
              className='!border !border-gray-300 !text-gray-600 !rounded !px-5 !py-1.5 !h-auto !text-sm !hover:!border-[#1890ff] !hover:!text-[#1890ff]'
            >
              {t('使用说明')}
            </Button>
          </div>
        </div>

        <div className='mb-10'>
          <Card className='!border !border-gray-200 !rounded-lg !shadow-none !bg-white !p-5'>
            <div className='flex flex-col'>
              <div className='flex items-center gap-2 mb-3'>
                <span className='px-2 py-0.5 bg-[#f9f0ff] text-[#722ed1] text-xs rounded font-medium'>
                  {t('Agent 产品公测中')}
                </span>
              </div>
              <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4'>
                <Text
                  size='small'
                  className='text-gray-400 leading-relaxed flex-1'
                  style={{ color: '#6b7280' }}
                >
                  {t('测试阶段产品功能、接口、参数可能调整，请勿用于生产环境（SLA 承诺）；公测期间')}
                  <span className='text-[#722ed1]'>{t('平台不产生费用')}</span>
                  {t('，正式商业化时间及计费标准另行通知；试用时若涉及')}
                  <span className='text-[#722ed1]'>{t('已商业化云产品')}</span>
                  {t('将产生费用。自 2025-12-18起我们将自动发放')}
                  <span className='text-[#722ed1]'>{t('少量额度代金券')}</span>
                  {t('以支持完成产品基础能力试用。请及时清理试用过程中产生的资源，避免非必要费用。如有更多需求，欢迎')}
                  <span className='text-[#722ed1]'>{t('联系我们')}</span>
                </Text>
                <Button
                  type='tertiary'
                  theme='borderless'
                  size='small'
                  className='!text-[#722ed1] !border !border-[#d3adf7] !rounded !px-3 !py-1 !h-auto !text-xs !whitespace-nowrap !hover:!bg-[#f9f0ff]'
                  icon={<IconChevronRight />}
                >
                  {t('公测注意事项')}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className='mb-10'>
          <div className='flex justify-between items-center mb-4'>
            <div className='flex items-center gap-2'>
              <span className='text-sm font-semibold text-gray-900'>
                {t('快速部署')}
              </span>
              <Text
                size='small'
                className='text-gray-400'
                style={{ color: '#6b7280' }}
              >
                {t('基于最佳实践一键部署Agent')}
              </Text>
            </div>
            <Button
              type='tertiary'
              theme='borderless'
              size='small'
              className='!text-gray-500 !hover:!text-[#1890ff] !text-xs'
            >
              {t('查看全部')}
            </Button>
          </div>

          <div className='grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8'>
            {agentTemplates.map((template, index) => (
              <Card
                key={index}
                className='!border !border-gray-200 !rounded-lg !shadow-none !bg-white !cursor-pointer !hover:!shadow-md !transition-shadow !duration-200 !p-4'
              >
                <div className='flex flex-col'>
                  <div className='w-full h-28 mb-4 rounded-lg overflow-hidden bg-gray-50'>
                    <img
                      src={template.icon}
                      alt={template.title}
                      className='w-full h-full object-cover'
                    />
                  </div>
                  <span className='text-xs font-semibold mb-2 text-gray-900 block'>
                    {template.title}
                  </span>
                  <Text
                    size='small'
                    className='text-gray-400 leading-relaxed text-xs'
                    style={{ color: '#6b7280' }}
                  >
                    {template.description}
                  </Text>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <div className='flex justify-between items-center mb-4'>
            <span className='text-sm font-semibold text-gray-900'>
              {t('我的智能体')}
            </span>
            <Button
              type='tertiary'
              theme='borderless'
              size='small'
              className='!text-gray-500 !hover:!text-[#1890ff] !text-xs'
            >
              {t('查看全部')}
            </Button>
          </div>

          <div className='grid grid-cols-1 gap-4'>
            {myAgents.map((agent, index) => (
              <Card
                key={index}
                className='!border !border-gray-200 !rounded-xl !shadow-sm !bg-white !p-5 !hover:!shadow-md !transition-all !duration-300 !cursor-pointer group'
              >
                <div className='flex items-center gap-5'>
                  <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-[#722ed1] to-[#b37feb] flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow duration-300'>
                    <svg
                      viewBox='0 0 24 24'
                      className='w-6 h-6 text-white'
                      fill='currentColor'
                    >
                      <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
                    </svg>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-3 mb-2'>
                      <span className='text-sm font-semibold text-gray-900'>
                        {agent.name}
                      </span>
                      <Tag
                        color='purple'
                        size='small'
                        className='!text-xs !px-2 !py-0.5'
                      >
                        {t('运行中')}
                      </Tag>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Text size='small' className='text-gray-400 text-xs'>
                        ID: {agent.id}
                      </Text>
                      <div className='flex gap-2'>
                        {agent.tools.map((tool, toolIndex) => (
                          <Tag
                            key={toolIndex}
                            color='blue'
                            size='small'
                            className='!text-xs !px-2 !py-0.5'
                          >
                            {tool}
                          </Tag>
                        ))}
                        {agent.features.map((feature, featureIndex) => (
                          <Tag
                            key={featureIndex}
                            color='green'
                            size='small'
                            className='!text-xs !px-2 !py-0.5'
                          >
                            {feature}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button
                    type='tertiary'
                    theme='borderless'
                    size='small'
                    className='!text-gray-400 !hover:!text-[#722ed1] opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                    icon={<IconChevronRight />}
                  />
                </div>
              </Card>
            ))}
          </div>

          <div className='mt-6 text-center'>
            <Button
              type='tertiary'
              theme='borderless'
              size='default'
              className='!text-[#722ed1] !text-sm !hover:!text-[#531dab]'
              icon={<IconChevronRight />}
            >
              {t('创建智能体')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
