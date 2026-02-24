import React, { useState, useEffect } from 'react';
import { Button } from '@douyinfe/semi-ui';
import { IconPlus } from '@douyinfe/semi-icons';
import { useTranslation } from 'react-i18next';

// 步骤卡片组件 - 按照附件图片设计
const StepCard = ({ stepNumber, title, description, icon, delay, t }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="group bg-white rounded-xl p-5 shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
        {/* Step - 01 标题行 */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-gray-500 text-base font-normal">{t('skillsCenter.step')}</span>
            <span className="text-gray-300 text-2xl font-light">-</span>
            <span className="text-gray-800 text-3xl font-light tracking-wide">
              {String(stepNumber).padStart(2, '0')}
            </span>
          </div>
          {/* 分隔线 */}
          <div className="w-full h-px bg-gray-200"></div>
        </div>

        {/* 图标 */}
        <div className="mb-5">
          <div className="w-10 h-10 flex items-center justify-center">
            {icon}
          </div>
        </div>

        {/* 标题 */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          {title}
        </h3>

        {/* 描述 */}
        <p className="text-sm text-gray-500 leading-relaxed flex-1">
          {description}
        </p>
      </div>
    </div>
  );
};

// 页面头部组件
const HeaderSection = ({ t }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`mb-12 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{t('skillsCenter.title')}</h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-3xl leading-relaxed text-[#6b7280]">
            {t('skillsCenter.subtitle')}
          </p>
        </div>
        <Button
          theme="solid"
          type="primary"
          icon={<IconPlus />}
          className="bg-blue-600 hover:bg-blue-700 shrink-0"
        >
          {t('skillsCenter.createSkill')}
        </Button>
      </div>
    </div>
  );
};

// 步骤流程区域
const StepsSection = ({ t }) => {
  const steps = [
    {
      stepNumber: 1,
      title: t('skillsCenter.step1.title'),
      description: t('skillsCenter.step1.description'),
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      stepNumber: 2,
      title: t('skillsCenter.step2.title'),
      description: t('skillsCenter.step2.description'),
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      stepNumber: 3,
      title: t('skillsCenter.step3.title'),
      description: t('skillsCenter.step3.description'),
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="relative flex-1">
      {/* 步骤卡片容器 - 响应式网格布局 */}
      <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 h-full items-stretch">
        {steps.map((step, index) => (
          <StepCard
            key={step.stepNumber}
            stepNumber={step.stepNumber}
            title={step.title}
            description={step.description}
            icon={step.icon}
            delay={index * 150}
            t={t}
          />
        ))}
      </div>
    </div>
  );
};

// 主页面组件
const SkillsCenter = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 pt-20 pb-8 flex flex-col">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-200/10 rounded-full blur-3xl" />
      </div>

      {/* 内容 - 使用 flex-1 铺满剩余空间 */}
      <div className="relative flex-1 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col">
        <HeaderSection t={t} />
        <StepsSection t={t} />
      </div>
    </div>
  );
};

export default SkillsCenter;
