import React, { useState, useEffect } from 'react';
import { Input } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';
import {
  IconSearch,
  IconArrowRight,
  IconLink,
  IconStar,
  IconGift,
  IconShield,
  IconBolt,
  IconPriceTag,
} from '@douyinfe/semi-icons';
import { Link } from 'react-router-dom';

// Hero区域组件 - 按照图片设计
const HeroSection = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      {/* Shimmer 动画样式 */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s ease-in-out;
        }
      `}</style>
      <div
        className={`w-full rounded-3xl p-8 transition-all mb-8 duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{
          background:
            'linear-gradient(to right, #ffffff 0%, #ffffff 25%, #ffffff 50%, #f2f4f7 75%, #f5f7fa 100%)',
        }}
      >
        <div className='flex flex-row gap-8 items-stretch'>
          {/* 左侧内容区域 */}
          <div className='flex-1 flex flex-col'>
            <div className='flex-1 flex flex-col justify-center'>
              {/* 顶部标签 */}
              <div className='flex items-center gap-3 mb-5'>
                {/* 模型上新标签 - 现代化设计 */}
                <span className='relative inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white rounded-full overflow-hidden group cursor-default'>
                  {/* 渐变背景 */}
                  <span className='absolute inset-0 bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500'></span>
                  {/* 微光动画层 */}
                  <span className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_ease-in-out]'></span>
                  {/* 脉冲光晕 */}
                  <span className='absolute inset-0 rounded-full bg-blue-400/50 animate-pulse'></span>
                  {/* 内容 */}
                  <IconBolt size={14} className='relative z-10' />
                  <span className='relative z-10'>{t('模型上新')}</span>
                  {/* 闪烁星星装饰 */}
                  {/* <span className="absolute -top-0.5 -right-0.5 text-yellow-300 text-[8px] animate-pulse">✦</span> */}
                </span>

                {/* 代币现货标签 - 现代化设计 */}
                <span className='relative inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white rounded-full overflow-hidden group cursor-default'>
                  {/* 渐变背景 */}
                  <span className='absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500'></span>
                  {/* 微光动画层 */}
                  <span className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_ease-in-out]'></span>
                  {/* 内容 */}
                  <IconPriceTag size={14} className='relative z-10' />
                  <span className='relative z-10'>{t('快速接入')}</span>
                  {/* 闪光装饰 */}
                  {/* <span className="absolute top-0.5 right-1 text-yellow-200 text-[6px] animate-pulse">✨</span> */}
                </span>
              </div>

              {/* 标题 */}
              <h1 className='text-5xl font-bold text-slate-900 mb-1 tracking-tight'>
                {t('AIHub')}
              </h1>
              <h2 className='text-3xl font-bold text-slate-800 mb-5'>
                {/* 代币转售平台 */}
              </h2>

              {/* 描述文本 */}
              <p className='text-slate-500 text-sm mb-7 leading-relaxed max-w-md text-[#6b7280]'>
                {t('可信卖家、透明定价、即时交付。更像模型市场的采购体验：搜索、筛选、对比、下单一气呵成。')}
              </p>

              {/* 主要按钮 */}
              <div className='flex flex-wrap items-center gap-3 mb-8'>
                {/* <button className='px-5 py-2.5 bg-white text-slate-700 text-sm font-medium rounded-full border border-slate-200 hover:bg-slate-50 transition-all duration-300'>
                  开始交易
                </button> */}
                <a
                  href='https://docs.newapi.pro/zh/docs/api'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='px-5 py-2.5 bg-white text-slate-700 text-sm font-medium rounded-full border border-slate-200 hover:bg-slate-50 transition-all duration-300 inline-block'
                >
                  {t('API文档')}
                </a>
                <button className='group px-5 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-medium rounded-full hover:from-violet-600 hover:to-fuchsia-600 transition-all duration-300 flex items-center gap-1.5'>
                  <IconGift size={14} />
                  {t('邀请码绑定与获取')}
                  <IconLink size={12} />
                </button>
              </div>
            </div>

            {/* 底部信息标签 */}
            <div className='flex flex-wrap gap-6 mt-auto'>
              <div className='flex items-center gap-2 text-slate-500 text-sm'>
                <svg
                  viewBox='0 0 24 24'
                  className='w-4 h-4 text-slate-400'
                  fill='currentColor'
                >
                  <path d='M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z' />
                </svg>
                {t('指数交易')}
              </div>
              <div className='flex items-center gap-2 text-slate-500 text-sm'>
                <svg
                  viewBox='0 0 24 24'
                  className='w-4 h-4 text-slate-400'
                  fill='currentColor'
                >
                  <path d='M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z' />
                </svg>
                {t('秒级交付')}
              </div>
              <div className='flex items-center gap-2 text-slate-500 text-sm'>
                <IconShield size={14} className='text-slate-400' />
                {t('可信卖家')}
              </div>
            </div>
          </div>

          {/* 右侧统计卡片 - 位于Hero内部 */}
          <div className='w-[500px] flex flex-col gap-4 shrink-0'>
            {/* 今日成交卡片 */}
            <div className='bg-white rounded-2xl p-5 shadow-sm'>
              <div className='text-slate-400 text-xs mb-1 text-[#6b7280]'>
                {t('今日成交')}
              </div>
              <div className='text-2xl font-bold text-slate-900 mb-1'>
                ¥ 128,430
              </div>
              <div className='text-slate-400 text-xs text-[#6b7280]'>
                {t('平均交付时间')}：<span className='text-slate-600'>28 {t('秒')}</span>
              </div>
            </div>

            {/* 保障与支付卡片 */}
            <div className='bg-white rounded-2xl p-5 shadow-sm'>
              <div className='flex items-center justify-between mb-3'>
                <span className='text-slate-700 text-sm font-medium text-[#6b7280]'>
                  {t('保障与支付')}
                </span>
                {/* <IconShield size={16} className="text-slate-400" /> */}
              </div>
              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <div className='text-slate-400 text-xs mb-0.5 text-[#6b7280]'>
                    {t('售后保障')}
                  </div>
                  <div className='text-slate-700 text-sm font-medium'>7×24</div>
                </div>
                <div>
                  <div className='text-slate-400 text-xs mb-0.5 text-[#6b7280]'>
                    {t('退款处理')}
                  </div>
                  <div className='text-slate-700 text-sm font-medium'>
                    {t('可追踪')}
                  </div>
                </div>
              </div>
            </div>

            {/* 新手引导卡片 */}
            <div className='bg-slate-900 rounded-2xl p-5 text-white shadow-sm'>
              <div className='text-slate-300 text-xs mb-1 text-[#6b7280]'>
                {t('新手引导')}
              </div>
              <div className='text-white text-sm font-medium mb-0.5 mb-1'>
                {t('先试后买，支持小额起购')}
              </div>
              <div className='text-slate-400 text-xs text-[#6b7280]'>
                {t('从筛选开始，快速定位最适合的模型')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// 搜索栏组件 - 按照附件设计
const SearchBar = ({ value, onChange }) => {
  const { t } = useTranslation();
  return (
    <div className='w-full max-w-4xl mx-auto xl:max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl 4xl:max-w-8xl 5xl:max-w-9xl mb-4'>
      <div className='relative'>
        <IconSearch
          className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400'
          size={18}
        />
        <Input
          placeholder={t('搜索模型名称或ID')}
          value={value}
          onChange={onChange}
          className='w-full h-12 pl-12 pr-4 rounded-lg border-2 border-gray-900 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:ring-0 transition-colors duration-300 bg-white text-base'
        />
      </div>
    </div>
  );
};

// 筛选标签组件 - 按照附件设计
const FilterTags = ({
  selectedType,
  setSelectedType,
  selectedVendor,
  setSelectedVendor,
}) => {
  const { t } = useTranslation();
  const types = [
    { key: 'featured', label: t('精选'), icon: '✨' },
    { key: 'all', label: t('所有模型'), icon: '🤖' },
    { key: 'multimodal', label: t('多模态'), icon: '🔮' },
    { key: 'text', label: t('文本'), icon: '💬' },
    { key: 'image', label: t('图像'), icon: '🖼️' },
    { key: 'audio', label: t('音频'), icon: '🎵' },
    { key: 'video', label: t('视频'), icon: '🎬' },
    { key: 'embedding', label: t('嵌入'), icon: '📊' },
    { key: 'rerank', label: t('重排序'), icon: '🔄' },
    { key: 'vision', label: t('视觉'), icon: '👁️' },
  
  ];

  const vendors = [
    { key: 'grok', label: 'Grok', icon: '⚡' },
    { key: 'teleai', label: 'Teleai', icon: '🚀' },
    { key: 'anthropic', label: 'Anthropic', icon: 'AI' },
    { key: 'google', label: 'Google', icon: '🔍' },
    { key: 'openai', label: 'OpenAI', icon: '🤖' },
    { key: 'deepseek', label: 'DeepSeek', icon: '🌊' },
    { key: 'qwen', label: 'Qwen', icon: '❄️' },
    { key: 'moonshot', label: 'MoonshotAI', icon: '🌙' },
    { key: 'llama', label: 'Llama', icon: '🦙' },
    { key: 'other', label: t('其他'), icon: '📦' },
  ];

  return (
    <div className='w-full bg-gray-50 rounded-xl p-4 mb-6'>
      {/* 类型筛选 */}
      <div className='flex flex-wrap items-center gap-2 mb-4'>
        <span className='text-gray-600 text-sm mr-3'>{t('类型')}:</span>
        {types.map((type) => {
          const isSelected = selectedType === type.key;
          return (
            <button
              key={type.key}
              onClick={() => {
                setSelectedType(isSelected ? '' : type.key);
              }}
              style={{
                backgroundColor: isSelected ? '#111827' : '#f3f4f6',
                color: isSelected ? '#ffffff' : '#4b5563',
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
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.target.style.backgroundColor = '#e5e7eb';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.target.style.backgroundColor = '#f3f4f6';
                }
              }}
            >
              <span>{type.icon}</span>
              {type.label}
            </button>
          );
        })}
      </div>

      {/* 厂商筛选 */}
      <div className='flex flex-wrap items-center gap-2'>
        <span className='text-gray-600 text-sm mr-3'>{t('厂商')}:</span>
        {vendors.map((vendor) => {
          const isSelected = selectedVendor === vendor.key;
          return (
            <button
              key={vendor.key}
              onClick={() => {
                setSelectedVendor(isSelected ? '' : vendor.key);
              }}
              style={{
                backgroundColor: isSelected ? '#111827' : '#f3f4f6',
                color: isSelected ? '#ffffff' : '#4b5563',
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
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.target.style.backgroundColor = '#e5e7eb';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.target.style.backgroundColor = '#f3f4f6';
                }
              }}
            >
              <span>{vendor.icon}</span>
              {vendor.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// 模型图标组件 - ui-ux-pro-max优化
const ModelIcon = ({ vendor }) => {
  const icons = {
    glm: (
      <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200'>
        <svg viewBox='0 0 24 24' className='w-5 h-5' fill='currentColor'>
          <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z' />
        </svg>
      </div>
    ),
    teleChat: (
      <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-pink-200'>
        <svg viewBox='0 0 24 24' className='w-5 h-5' fill='currentColor'>
          <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z' />
        </svg>
      </div>
    ),
    kimi: (
      <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-slate-200'>
        K
      </div>
    ),
    minimax: (
      <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-pink-200'>
        <svg viewBox='0 0 24 24' className='w-5 h-5' fill='currentColor'>
          <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z' />
        </svg>
      </div>
    ),
    teleai: (
      <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-200'>
        T
      </div>
    ),
    moonshot: (
      <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-slate-200'>
        M
      </div>
    ),
    openai: (
      <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-200'>
        O
      </div>
    ),
    deepseek: (
      <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-200'>
        D
      </div>
    ),
    qwen: (
      <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-200'>
        Q
      </div>
    ),
    other: (
      <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-gray-200'>
        📦
      </div>
    ),
  };

  return (
    icons[vendor] || (
      <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-slate-200'>
        ?
      </div>
    )
  );
};

// 模型卡片组件 - ui-ux-pro-max设计
const ModelCard = ({ model, index }) => {
  const { t } = useTranslation();
  
  // 分类中文到翻译key的映射
  const categoryToKey = {
    '文本': '文本',
    '多模态': '多模态',
    '图像': '图像',
    '音频': '音频',
    '视频': '视频',
    '嵌入': '嵌入',
    '重排序': '重排序',
    '视觉': '视觉',
  };
  
  // 生成模型详情页链接
  const getModelLink = () => {
    const modelIdMap = {
      1: 'telechat2',
      2: 'glm-47',
      3: 'kimi-k25',
      4: 'chatgpt-52',
      5: 'deepseek-v32',
      6: 'qwen3-max',
      7: 'hunyuan-image3'
    };
    const modelId = modelIdMap[model.id] || 'glm-47';
    return `/tokenhub/model/${modelId}`;
  };

  return (
    <Link
      to={getModelLink()}
      className='group bg-white rounded-xl p-5 shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1'
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* 头部 */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'>
          <ModelIcon vendor={model.vendor} />
          <span className='text-xs text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded'>
            {t(categoryToKey[model.category] || model.category)}
          </span>
        </div>
        {model.isNew && (
          <span className='text-xs font-bold text-gray-900'>NEW</span>
        )}
      </div>

      {/* 模型名称 */}
      <h3 className='text-lg font-bold text-gray-900 mb-4'>{model.name}</h3>

      {/* 虚线分隔线 */}
      <div className='border-t border-dashed border-gray-300 my-4 text-[#868b97]'></div>

      {/* 价格信息 */}
      <div className='grid grid-cols-2 gap-y-4 gap-x-6 text-sm mb-0'>
        <div>
          <div className='text-gray-900 font-semibold'>
            ${model.inputPrice}/Mt
          </div>
          <div className='text-gray-500 text-xs text-[#6b7280]'>{t('输入')}</div>
        </div>
        <div>
          <div className='text-gray-900 font-semibold'>
            ${model.outputPrice}/Mt
          </div>
          <div className='text-gray-500 text-xs text-[#6b7280]'>{t('输出')}</div>
        </div>
        <div>
          <div className='text-gray-900 font-semibold'>
            {model.contextLength}
          </div>
          <div className='text-gray-500 text-xs text-[#6b7280]'>{t('上下文')}</div>
        </div>
        <div>
          <div className='text-gray-900 font-semibold'>
            ${model.cachePrice || '0'}/Mt
          </div>
          <div className='text-gray-500 text-xs text-[#6b7280]'>{t('Cache Read')}</div>
        </div>
      </div>

      {/* 查看详情按钮 */}
      <div className='flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
        <span className='flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-gray-700'>
          {/* 查看详情 */}
          <IconArrowRight
            size={14}
            className='transition-transform group-hover:translate-x-1'
          />
        </span>
      </div>
    </Link>
  );
};

// 模型列表组件 - ui-ux-pro-max优化
const ModelList = ({ selectedType, selectedVendor, searchValue }) => {
  const { t } = useTranslation();
  // 展开状态管理
  const [expandedCategories, setExpandedCategories] = useState({});

  // 切换展开状态
  const toggleExpand = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // 分类中文到翻译key的映射
  const categoryToKey = {
    '文本': '文本',
    '多模态': '多模态',
    '图像': '图像',
    '音频': '音频',
    '视频': '视频',
    '嵌入': '嵌入',
    '重排序': '重排序',
    '视觉': '视觉',
  };

  const models = [
    {
      id: 1,
      category: '文本',
      name: 'TeleChat2',
      inputPrice: '0.6',
      outputPrice: '3.0',
      cachePrice: '0.1',
      contextLength: '262144',
      isNew: false,
      vendor: 'teleai',
    },
    {
      id: 2,
      category: '多模态',
      name: 'GLM-4.7',
      inputPrice: '0.6',
      outputPrice: '2.2',
      cachePrice: '0',
      contextLength: '204800',
      isNew: true,
      vendor: 'other',
    },
    {
      id: 3,
      category: '文本',
      name: 'Kimi K2.5',
      inputPrice: '0.6',
      outputPrice: '3.0',
      cachePrice: '0.1',
      contextLength: '262144',
      isNew: true,
      vendor: 'moonshot',
    },
    {
      id: 4,
      category: '文本',
      name: 'ChatGPT 5.2',
      inputPrice: '0.6',
      outputPrice: '3.0',
      cachePrice: '0.1',
      contextLength: '262144',
      isNew: true,
      vendor: 'openai',
    },
    {
      id: 5,
      category: '文本',
      name: 'DeepSeek-V3.2',
      inputPrice: '0.6',
      outputPrice: '3.0',
      cachePrice: '0.1',
      contextLength: '262144',
      isNew: true,
      vendor: 'deepseek',
    },
    {
      id: 6,
      category: '文本',
      name: 'Qwen3-Max',
      inputPrice: '0.6',
      outputPrice: '3.0',
      cachePrice: '0.1',
      contextLength: '262144',
      isNew: true,
      vendor: 'qwen',
    },
    {
      id: 7,
      category: '图像',
      name: 'Hunyuan Image 3',
      inputPrice: '0.6',
      outputPrice: '3.0',
      cachePrice: '0.1',
      contextLength: '262144',
      isNew: true,
      vendor: 'other',
    },
  ];

  // 类型 key 到 label 的映射
  const typeKeyToLabel = {
    'text': '文本',
    'image': '图像',
    'audio': '音频',
    'video': '视频',
    'embedding': '嵌入',
    'rerank': '重排序',
    'vision': '视觉',
    'multimodal': '多模态',
  };

  // 筛选模型
  const filteredModels = models.filter((model) => {
    // 类型筛选
    let typeMatch = true;
    if (selectedType && selectedType !== '') {
      if (selectedType === 'all') {
        typeMatch = true;
      } else if (selectedType === 'featured') {
        typeMatch = model.isNew;
      } else {
        typeMatch = typeKeyToLabel[selectedType] === model.category;
      }
    }

    // 厂商筛选
    let vendorMatch = true;
    if (selectedVendor && selectedVendor !== '') {
      vendorMatch = model.vendor === selectedVendor;
    }

    // 搜索筛选
    const searchMatch = !searchValue ||
      model.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      model.id.toString().includes(searchValue);

    return typeMatch && vendorMatch && searchMatch;
  });

  // 按类型分组
  const groupedModels = filteredModels.reduce((acc, model) => {
    const category = model.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(model);
    return acc;
  }, {});

  // 定义分类展示顺序
  const categoryOrder = ['文本', '多模态', '图像', '音频', '视频', '嵌入', '重排序', '视觉'];

  // 获取有模型的分类并按顺序排列
  const sortedCategories = categoryOrder.filter(cat => groupedModels[cat] && groupedModels[cat].length > 0);

  return (
    <div className='space-y-8'>
      {sortedCategories.map((category) => {
        const modelsInCategory = groupedModels[category];
        const isExpanded = expandedCategories[category];
        const needsExpand = modelsInCategory.length > 3;
        const displayedModels = isExpanded ? modelsInCategory : modelsInCategory.slice(0, 3);

        return (
          <div key={category}>
            {/* 分类标题 */}
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-3'>
                <span className='text-slate-900 text-sm'>{t(categoryToKey[category] || category)}</span>
                <span className='text-slate-400 text-sm bg-slate-100 px-0 py-1 rounded-full'>
                  ({modelsInCategory.length})
                </span>
              </div>
              {needsExpand && (
                <button
                  onClick={() => toggleExpand(category)}
                  className='flex items-center gap-1 text-slate-500 text-sm font-medium hover:text-slate-900 transition-colors group'
                >
                  {isExpanded ? t('收起') : t('更多')}
                  <svg
                    viewBox='0 0 24 24'
                    className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                  >
                    <path d='M6 9l6 6 6-6' />
                  </svg>
                </button>
              )}
            </div>

            {/* 该分类的模型卡片网格 */}
            <div className='grid grid-cols-3 gap-4'>
              {displayedModels.map((model, index) => (
                <ModelCard key={model.id} model={model} index={index} />
              ))}
            </div>
          </div>
        );
      })}

      {/* 如果没有模型，显示空状态 */}
      {sortedCategories.length === 0 && (
        <div className='text-center py-12 text-slate-400'>
          {t('没有找到匹配的模型')}
        </div>
      )}
    </div>
  );
};

// 主页面组件 - ui-ux-pro-max优化
const TokenHub = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedType, setSelectedType] = useState('featured');
  const [selectedVendor, setSelectedVendor] = useState('');

  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pt-20 pb-12'>
      {/* 背景装饰 */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-0 left-1/4 w-96 h-96 2xl:w-[32rem] 2xl:h-[32rem] 3xl:w-[40rem] 3xl:h-[40rem] 4xl:w-[50rem] 4xl:h-[50rem] 5xl:w-[60rem] 5xl:h-[60rem] bg-blue-200/20 rounded-full blur-3xl' />
        <div className='absolute bottom-0 right-1/4 w-80 h-80 2xl:w-[28rem] 2xl:h-[28rem] 3xl:w-[36rem] 3xl:h-[36rem] 4xl:w-[44rem] 4xl:h-[44rem] 5xl:w-[52rem] 5xl:h-[52rem] bg-violet-200/20 rounded-full blur-3xl' />
        <div className='absolute top-1/2 left-1/2 w-64 h-64 2xl:w-[24rem] 2xl:h-[24rem] 3xl:w-[32rem] 3xl:h-[32rem] 4xl:w-[40rem] 4xl:h-[40rem] 5xl:w-[48rem] 5xl:h-[48rem] bg-cyan-200/10 rounded-full blur-3xl' />
      </div>

      {/* 内容 */}
      <div className='relative max-w-[140rem] 3xl:max-w-[160rem] 4xl:max-w-[200rem] 5xl:max-w-[240rem] mx-auto px-6 sm:px-8 lg:px-10 xl:px-12 3xl:px-16 4xl:px-20 5xl:px-24'>
        <HeroSection />
        <SearchBar value={searchValue} onChange={setSearchValue} />
        <FilterTags
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedVendor={selectedVendor}
          setSelectedVendor={setSelectedVendor}
        />
        <ModelList
          selectedType={selectedType}
          selectedVendor={selectedVendor}
          searchValue={searchValue}
        />
      </div>
    </div>
  );
};

export default TokenHub;
