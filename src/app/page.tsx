'use client';

import { useState, useEffect } from 'react';
import { Send, MessageCircle, Zap, Copy, Check, Sparkles, Target, Shield, TrendingUp } from 'lucide-react';

export default function Home() {
  const [opponentText, setOpponentText] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [responses, setResponses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async () => {
    if (!opponentText.trim()) return;
    
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/argue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          opponentText,
          intensity,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResponses(data.responses);
        
        // 保存到 localStorage
        const history = JSON.parse(localStorage.getItem('argueHistory') || '[]');
        history.unshift({
          opponentText,
          intensity,
          responses: data.responses,
          timestamp: new Date().toISOString(),
        });
        localStorage.setItem('argueHistory', JSON.stringify(history.slice(0, 10))); // 只保留最近10条
      } else {
        const errorData = await response.json();
        setError(errorData.error || '生成失败，请重试');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('网络错误，请检查网络连接后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  const getIntensityColor = (value: number) => {
    if (value <= 3) return 'from-green-400 to-green-600';
    if (value <= 6) return 'from-yellow-400 to-orange-500';
    return 'from-orange-500 to-red-600';
  };

  const getIntensityText = (value: number) => {
    if (value <= 3) return '温和理性';
    if (value <= 6) return '适度反击';
    return '强力反驳';
  };

  if (!mounted) {
    return null; // 防止服务端渲染不匹配
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-8 py-12">
      {/* 装饰性背景元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* 主卡片 - 60%宽度居中卡片 */}
      <div className="relative w-full max-w-3xl mx-auto" style={{width: '60%'}}>
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5 text-center">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <div className="bg-white/20 p-2 rounded-full">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">吵架包赢</h1>
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            </div>
            <p className="text-blue-100 text-xs">AI智能反驳助手</p>
          </div>

          {/* 功能特色标签 */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-2">
            <div className="flex items-center justify-center space-x-4 text-white text-xs">
              <div className="flex items-center space-x-1">
                <Target className="w-3 h-3" />
                <span>精准反击</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="w-3 h-3" />
                <span>理性辩论</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3" />
                <span>智能升级</span>
              </div>
            </div>
          </div>

          {/* 主要内容区域 */}
          <div className="p-6 space-y-5">
            
            {/* 输入区域 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  对方的话
                </label>
                <div className="relative">
                  <textarea
                    value={opponentText}
                    onChange={(e) => setOpponentText(e.target.value)}
                    placeholder="请输入对方说的话..."
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 resize-none bg-gray-50 text-sm"
                    rows={3}
                    maxLength={500}
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                    {opponentText.length}/500
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  语气强烈程度: <span className={`font-bold bg-gradient-to-r ${getIntensityColor(intensity)} bg-clip-text text-transparent`}>
                    {getIntensityText(intensity)}
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={intensity}
                    onChange={(e) => setIntensity(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer intensity-slider"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(intensity - 1) * 11.11}%, #e5e7eb ${(intensity - 1) * 11.11}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>温和</span>
                    <span>激烈</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!opponentText.trim() || isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none text-sm"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>开始吵架</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>开始吵架</span>
                  </>
                )}
              </button>
            </div>

            {/* 结果区域 */}
            {responses.length > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <h3 className="text-base font-bold text-gray-800">反击神器</h3>
                  <div className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {responses.length} 条回复
                  </div>
                </div>
                
                <div className="space-y-2">
                  {responses.map((response, index) => (
                    <div
                      key={index}
                      className="group bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-3 rounded-lg hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                          回复 {index + 1}
                        </div>
                        <button
                          onClick={() => handleCopy(response, index)}
                          className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-green-600 hover:text-green-700 text-xs px-2 py-0.5 rounded flex items-center space-x-1 bg-white/80 hover:bg-white"
                        >
                          {copiedIndex === index ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>已复制</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>复制</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-gray-800 text-sm leading-relaxed">{response}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 使用提示 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>💡 使用小贴士</span>
              </h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• 描述越详细，AI 生成的回复越精准</li>
                <li>• 调节语气强度来匹配你的需求</li>
                <li>• 理性讨论，避免恶意争吵</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 text-center border-t border-gray-200">
            <p className="text-xs text-gray-500">吵架包赢 © 2025 · 让你的每一场争论都能占据上风！</p>
          </div>
        </div>
      </div>
    </div>
  );
}
