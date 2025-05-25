'use client';

import { useState } from 'react';
import { Send, MessageCircle, Zap, Copy, Check } from 'lucide-react';

export default function Home() {
  const [opponentText, setOpponentText] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [responses, setResponses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <div className="bg-green-500 text-white p-4 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-center space-x-2">
          <MessageCircle className="w-6 h-6" />
          <h1 className="text-xl font-bold">吵架包赢</h1>
          <Zap className="w-6 h-6" />
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              对方说了什么？
            </label>
            <textarea
              value={opponentText}
              onChange={(e) => setOpponentText(e.target.value)}
              placeholder="输入对方的话..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              语气强烈程度: {intensity}
            </label>
            <div className="relative">
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${(intensity - 1) * 11.11}%, #e5e7eb ${(intensity - 1) * 11.11}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>温和</span>
                <span>激烈</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!opponentText.trim() || isLoading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 wechat-button"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>AI 正在思考...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>开始吵架</span>
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        {responses.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span>反击神器</span>
            </h2>
            <div className="space-y-3">
              {responses.map((response, index) => (
                <div
                  key={index}
                  className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg"
                >
                  <p className="text-gray-800 leading-relaxed mb-2">{response}</p>
                  <button
                    onClick={() => handleCopy(response, index)}
                    className="text-xs text-green-600 hover:text-green-700 font-medium copy-button px-2 py-1 rounded flex items-center space-x-1"
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
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">💡 使用小贴士</h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• 描述越详细，AI 生成的回复越精准</li>
            <li>• 调节语气强度来匹配你的需求</li>
            <li>• 理性讨论，避免恶意争吵</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 py-4">
          <p>理性讨论，和谐交流 💚</p>
        </div>
      </div>

    </div>
  );
}
