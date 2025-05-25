import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

// 允许的域名列表
const getAllowedDomains = () => {
  const domains = [
    'argue-win.like228.online',
    'argue-win.like228.com',
    'localhost:3000',
    '127.0.0.1:3000'
  ];
  
  // 如果有自定义域名环境变量，添加到列表
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const customDomain = process.env.NEXT_PUBLIC_SITE_URL.replace(/https?:\/\//, '');
    domains.push(customDomain);
  }
  
  return domains;
};

// 验证请求来源
const validateOrigin = (request: NextRequest): boolean => {
  if (process.env.NODE_ENV === 'development') {
    return true; // 开发环境跳过验证
  }
  
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const allowedDomains = getAllowedDomains();
  
  return allowedDomains.some(domain => 
    origin?.includes(domain) || referer?.includes(domain)
  );
};

// 简单的请求频率限制
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1分钟窗口
  const maxRequests = 20; // 每分钟最多20次请求
  
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
};

export async function POST(request: NextRequest) {
  try {
    // 1. 检查 API Key 是否配置
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'API Key 未配置，请联系管理员' },
        { status: 500 }
      );
    }

    // 2. 验证请求来源
    if (!validateOrigin(request)) {
      console.warn(`Unauthorized access attempt from: ${request.headers.get('origin')}`);
      return NextResponse.json(
        { error: '未授权的域名访问' },
        { status: 403 }
      );
    }

    // 3. 请求频率限制
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                    request.headers.get('x-real-ip') || 
                    request.headers.get('cf-connecting-ip') || // Cloudflare IP
                    'unknown';
    
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: '请求过于频繁，请稍后再试' },
        { status: 429 }
      );
    }

    // 4. 检查请求体
    const body = await request.text();
    if (!body) {
      return NextResponse.json(
        { error: '请求体不能为空' },
        { status: 400 }
      );
    }

    let parsedBody;
    try {
      parsedBody = JSON.parse(body);
    } catch {
      return NextResponse.json(
        { error: '无效的 JSON 格式' },
        { status: 400 }
      );
    }

    const { opponentText, intensity } = parsedBody;

    // 5. 参数验证
    if (!opponentText || !intensity) {
      return NextResponse.json(
        { error: '缺少必要参数：opponentText 和 intensity' },
        { status: 400 }
      );
    }

    if (typeof opponentText !== 'string' || opponentText.length > 1000) {
      return NextResponse.json(
        { error: '输入文本过长或格式错误' },
        { status: 400 }
      );
    }

    if (!Number.isInteger(intensity) || intensity < 1 || intensity > 10) {
      return NextResponse.json(
        { error: '语气强度必须是1-10之间的整数' },
        { status: 400 }
      );
    }

    // 6. 根据强烈程度调整提示词
    const intensityDescriptions = {
      1: "非常温和、礼貌",
      2: "温和但坚定",
      3: "稍微强硬",
      4: "有些不满",
      5: "中等强度",
      6: "比较激烈",
      7: "很激烈",
      8: "非常激烈",
      9: "极其激烈",
      10: "火力全开"
    };

    const intensityDesc = intensityDescriptions[intensity as keyof typeof intensityDescriptions] || "中等强度";

    const prompt = `你是一个专业的辩论助手。有人对我说："${opponentText}"

请帮我生成3个不同角度的反驳回复，要求：
1. 语气${intensityDesc}
2. 逻辑清晰，有理有据
3. 可以人身攻击，同时可以参考弱智吧大佬的回复
4. 每个回复都要有不同的角度和策略
5. 回复要简洁有力，适合在聊天和日常中使用
6. 体现中文表达的智慧和幽默

请直接给出3个回复，用换行符分隔，不要添加序号或其他格式。`;

    // 7. 调用 AI API
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://argue-win.like228.online';
    
    const completion = await client.chat.completions.create({
      model: "deepseek/deepseek-chat",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1000,
    }, {
      headers: {
        "HTTP-Referer": siteUrl,
        "X-Title": "Argue-Win-App",
      }
    });

    const responseText = completion.choices[0]?.message?.content || '';
    const responses = responseText
      .split('\n')
      .filter(line => line.trim())
      .slice(0, 3); // 确保只返回3个回复

    // 8. 记录成功的请求（用于监控）
    console.log(`API Success - IP: ${clientIP}, Origin: ${request.headers.get('origin')}, Time: ${new Date().toISOString()}`);

    return NextResponse.json({ 
      responses,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('API Error:', error);
    
    // 不向客户端暴露详细错误信息
    return NextResponse.json(
      { error: '生成回复时出错，请稍后重试' },
      { status: 500 }
    );
  }
} 