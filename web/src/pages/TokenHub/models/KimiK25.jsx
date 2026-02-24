import React, { useState, useEffect, useRef } from 'react';
import { IconArrowLeft, IconCopy, IconTickCircle, IconLink, IconStar } from '@douyinfe/semi-icons';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Kimi K2.5模型详情页面 - ui-ux-pro-max设计系统优化
const KimiK25 = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [activeLang, setActiveLang] = useState('Python');
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const codeRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const languages = [
    { id: 'Python', label: 'Python', color: '#3776ab' },
    { id: 'TypeScript', label: 'TypeScript', color: '#3178c6' },
    { id: 'Java', label: 'Java', color: '#007396' },
    { id: 'Go', label: 'Go', color: '#00add8' },
    { id: 'Shell', label: 'Shell', color: '#4eaa25' }
  ];

  const codeExamples = {
    Python: `import openai

client = openai.OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.jiekou.ai/v1"
)

response = client.chat.completions.create(
    model="kimi-k2.5",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello, how are you?"}
    ],
    max_tokens=1000,
    temperature=0.7
)

print(response.choices[0].message.content)`,
    TypeScript: `import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'YOUR_API_KEY',
  baseURL: 'https://api.jiekou.ai/v1',
});

async function main() {
  const response = await client.chat.completions.create({
    model: 'kimi-k2.5',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Hello, how are you?' }
    ],
    max_tokens: 1000,
    temperature: 0.7
  });
  console.log(response.choices[0].message.content);
}

main();`,
    Java: `import com.openai.OpenAI;
import com.openai.models.*;

OpenAI client = new OpenAI("YOUR_API_KEY", "https://api.jiekou.ai/v1");

ChatCompletionRequest request = ChatCompletionRequest.builder()
    .model("kimi-k2.5")
    .messages(Arrays.asList(
        new ChatMessage("system", "You are a helpful assistant."),
        new ChatMessage("user", "Hello, how are you?")
    ))
    .maxTokens(1000)
    .temperature(0.7)
    .build();

ChatCompletion response = client.chatCompletions().create(request);
System.out.println(response.getChoices().get(0).getMessage().getContent());`,
    Go: `package main

import (
    "context"
    "fmt"
    "github.com/sashabaranov/go-openai"
)

func main() {
    client := openai.NewClientWithConfig(openai.ClientConfig{
        AuthToken: "YOUR_API_KEY",
        BaseURL:   "https://api.jiekou.ai/v1",
    })

    resp, err := client.CreateChatCompletion(
        context.Background(),
        openai.ChatCompletionRequest{
            Model: "kimi-k2.5",
            Messages: []openai.ChatCompletionMessage{
                {Role: "system", Content: "You are a helpful assistant."},
                {Role: "user", Content: "Hello, how are you?"},
            },
            MaxTokens:   1000,
            Temperature: 0.7,
        },
    )
    if err != nil {
        panic(err)
    }
    fmt.Println(resp.Choices[0].Message.Content)
}`,
    Shell: `curl -X POST https://api.jiekou.ai/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "kimi-k2.5",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Hello, how are you?"}
    ],
    "max_tokens": 1000,
    "temperature": 0.7
  }'`
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeExamples[activeLang]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(t('复制失败'), err);
    }
  };

  const pricingData = [
    { 
      label: '输入（每百万tokens）', 
      officialPrice: '$10.00', 
      ourPrice: '$9.50', 
      savings: '5%'
    },
    { 
      label: '输出（每百万tokens）', 
      officialPrice: '$30.00', 
      ourPrice: '$28.50', 
      savings: '5%'
    }
  ];

  const features = [
    { label: '上下文长度', value: '262,144' },
    { label: '最大输出', value: '8,192' },
    { label: '函数调用', value: '支持', highlight: true },
    { label: '结构化输出', value: '支持', highlight: true },
    { label: '推理', value: '支持', highlight: true },
    { label: 'serverless', value: '支持', highlight: true },
    { label: 'Input', value: 'text' },
    { label: 'Output', value: 'text' }
  ];

  return (
      <div className="min-h-screen bg-[#F8FAFC]">
        {/* 滚动进度条 */}
        <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
  
        {/* 背景装饰 - 柔和的渐变 */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] 2xl:w-[800px] 2xl:h-[800px] 3xl:w-[1000px] 3xl:h-[1000px] 4xl:w-[1200px] 4xl:h-[1200px] 5xl:w-[1400px] 5xl:h-[1400px] bg-blue-100/40 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] 2xl:w-[700px] 2xl:h-[700px] 3xl:w-[900px] 3xl:h-[900px] 4xl:w-[1100px] 4xl:h-[1100px] 5xl:w-[1300px] 5xl:h-[1300px] bg-cyan-100/30 rounded-full blur-[100px]" />
        </div>
  
        {/* 主内容 */}
        <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-24 pb-16">
          {/* 返回按钮 */}
          <Link 
            to="/tokenhub" 
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium text-gray-600 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-md transition-all duration-200 group"
          >
            <IconArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            {t('返回模型市场')}
          </Link>
  
          <div 
            className="bg-white rounded-2xl p-5 shadow-sm"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* 模型信息 */}
                <div className="flex items-center gap-5">
                     {/* 模型图标 */}
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
                      <span className="text-2xl font-bold">K</span>
                    </div>
                  <div className="flex items-center gap-40">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-bold text-[#1E293B]">
                          Kimi-K2.5
                        </h1>
                        <span className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-full">
                          NEW
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <code className="px-2 py-1 bg-gray-50 rounded-md text-gray-500 font-mono text-xs border border-gray-100">kimi-k2.5</code>
                        <button 
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          onClick={() => navigator.clipboard.writeText('kimi-k2.5')}
                          title={t('复制模型ID')}
                        >
                          <IconCopy size={14} />
                        </button>
                      </div>
                    </div>
                        {/* 操作按钮 */}
                    <div className="flex items-center gap-3">
                      <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200">
                        <IconStar size={16} />
                        {t('试用模型')}
                      </button>
                      
                      <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
                        {t('API 文档')}
                        <IconLink size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
          <div 
        className={`w-full rounded-3xl p-8 transition-all mb-8 duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        
      >
        <div className="flex flex-row gap-8 items-stretch">
          {/* 左侧内容区域 */}
          <div className="flex-1 flex flex-col">
              <div 
                className="bg-white rounded-2xl p-5 shadow-sm"
              >
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-[#1E293B] mb-1">{t('价格对比')}</h2>
                  <p className="text-sm text-gray-500">{t('平台价格对比原渠道，为您节省成本')}</p>
                </div>
  
                {/* 价格对比表格 */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  {/* 表头 */}
                  <div className="grid grid-cols-4 bg-gray-50/80 border-b border-gray-200">
                    <div className="px-6 py-4 text-sm font-medium text-[#1E293B]">{t('计费项')}</div>
                    <div className="px-6 py-4 text-sm font-medium text-[#1E293B] text-center">{t('官方渠道价')}</div>
                    <div className="px-6 py-4 text-sm font-medium text-[#1E293B] text-center">{t('本平台价格')}</div>
                    <div className="px-6 py-4 text-sm font-medium text-[#1E293B] text-center">{t('节省')}</div>
                  </div>
                  {/* 表格内容 */}
                  {pricingData.map((item, index) => (
                    <div 
                      key={item.label}
                      className={`grid grid-cols-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                      }`}
                    >
                      <div className="px-6 py-4 text-sm text-gray-700 flex items-center">{t(item.label)}</div>
                      <div className="px-6 py-4 text-sm text-gray-400 text-center flex items-center justify-center line-through">{item.officialPrice}</div>
                      <div className="px-6 py-4 text-sm font-semibold text-[#2563EB] text-center flex items-center justify-center">{item.ourPrice}</div>
                      <div className="px-6 py-4 text-center flex items-center justify-center">
                        <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-full border border-green-100">
                          {item.savings}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
  
            {/* API使用区域 */}
              <div 
                className="bg-white rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-[#1E293B]">{t('API使用')}</h2>
                  <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full border border-blue-100">REST API</span>
                </div>
                <p className="text-sm text-gray-500 mb-6">{t('使用以下代码示例快速集成我们的API，支持多种编程语言')}</p>
  
                {/* 语言切换标签 */}
                <div className="flex flex-wrap items-center gap-2 mb-6 p-1.5 bg-gray-100 rounded-xl">
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setActiveLang(lang.id)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        activeLang === lang.id
                          ? 'bg-white text-[#1E293B] shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: lang.color }}
                        />
                        {lang.label}
                      </span>
                    </button>
                  ))}
                </div>
  
                {/* 代码示例区域 */}
                <div className="relative rounded-xl overflow-hidden bg-[#1e1e1e] border border-gray-800">
                  {/* 编辑器标题栏 */}
                  <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                      </div>
                      <span className="ml-4 text-xs text-gray-400 font-mono">example.{activeLang.toLowerCase()}</span>
                    </div>
                    <button
                      onClick={handleCopy}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                        copied 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {copied ? <IconTickCircle size={14} /> : <IconCopy size={14} />}
                      {copied ? t('已复制') : t('复制代码')}
                    </button>
                  </div>
                  
                  {/* 代码内容 */}
                  <div className="p-6 overflow-x-auto">
                    <pre className="text-sm font-mono leading-relaxed" style={{ color: '#e2e8f0' }}>
                      <code>{codeExamples[activeLang]}</code>
                    </pre>
                  </div>
                </div>
              </div>
          </div>
  
          {/* 右侧统计卡片 - 位于Hero内部 */}
          <div className="w-[500px] flex flex-col gap-4 shrink-0">
                       {/* 信息卡片 */}
              <div 
                className="bg-white rounded-2xl p-5 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-[#1E293B] mb-5">{t('信息')}</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-500">{t('提供商')}</span>
                    <span className="text-sm font-medium text-[#1E293B]">{t('智谱AI')}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-500">{t('量化')}</span>
                    <span className="text-sm font-medium text-gray-400">-</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm text-gray-500">{t('版本')}</span>
                    <span className="text-sm font-medium text-[#1E293B]">2.5</span>
                  </div>
                </div>
              </div>  
                       
                       
                        {/* 支持的功能卡片 */}
              <div 
                className="bg-white rounded-2xl p-5 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-[#1E293B] mb-5">{t('支持的功能')}</h3>
                <div className="space-y-3">
                  {features.map((feature) => (
                    <div 
                      key={feature.label}
                      className="flex justify-between items-center py-2.5"
                    >
                      <span className="text-sm text-gray-600">{t(feature.label)}</span>
                      <span className={`text-sm font-medium ${feature.highlight ? 'text-[#2563EB]' : 'text-[#1E293B]'}`}>
                        {t(feature.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
  
          </div>
        </div>
      </div>
        
        </div>
      </div>
    );
};

export default KimiK25;