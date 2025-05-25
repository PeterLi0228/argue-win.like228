import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "REMOVED_SECRET",
});

export async function POST(request: NextRequest) {
  try {
    // 检查请求体是否为空
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
    } catch (parseError) {
      return NextResponse.json(
        { error: '无效的 JSON 格式' },
        { status: 400 }
      );
    }

    const { opponentText, intensity } = parsedBody;

    if (!opponentText || !intensity) {
      return NextResponse.json(
        { error: '缺少必要参数：opponentText 和 intensity' },
        { status: 400 }
      );
    }

    // 根据强烈程度调整提示词
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
3. 可以避免人身攻击
4. 每个回复都要有不同的角度和策略，不要重复
5. 回复要简洁有力，适合在聊天和日常中使用
6. 体现中文表达的智慧和幽默，可以使用网络用语

请直接给出3个回复，用换行符分隔，不要添加序号或其他格式。`;

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
        "HTTP-Referer": "https://argue-win.like228.com",
        "X-Title": "Argue-Win-App",
      }
    });

    const responseText = completion.choices[0]?.message?.content || '';
    const responses = responseText
      .split('\n')
      .filter(line => line.trim())
      .slice(0, 3); // 确保只返回3个回复

    return NextResponse.json({ responses });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: '生成回复时出错，请稍后重试' },
      { status: 500 }
    );
  }
} 