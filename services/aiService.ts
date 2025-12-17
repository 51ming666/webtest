import { GoogleGenAI } from "@google/genai";
import { env } from '../utils/env';

const getClient = () => {
  const apiKey = env.GEMINI_API_KEY();
  if (!apiKey) {
    console.warn("Gemini API Key is missing - AI features will be disabled");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateSmartReply = async (postContent: string, postTitle: string): Promise<string> => {
  const client = getClient();
  if (!client) return "无法连接到AI服务 (Missing API Key)";

  try {
    const prompt = `
      你是一个论坛的资深用户。请根据以下帖子内容，生成一个简短、有建设性且友好的回复。
      
      帖子标题: ${postTitle}
      帖子内容: ${postContent}
      
      回复要求:
      1. 语气轻松自然。
      2. 长度控制在100字以内。
      3. 直接给出回复内容，不要加引号。
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "AI 暂时无法思考...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 生成失败，请稍后再试。";
  }
};

export const checkContentSafety = async (content: string): Promise<boolean> => {
  // Simple mock or real check. For now, we simulate an AI check or perform a basic check.
  // Real implementation would use safetySettings.
  return true; 
};

export const summarizeThread = async (postContent: string, comments: string[]): Promise<string> => {
   const client = getClient();
  if (!client) return "无法连接到AI服务";

  try {
     const commentsText = comments.join("\n- ");
     const prompt = `
      请总结以下论坛讨论帖的要点：
      
      主贴内容: ${postContent}
      
      评论:
      - ${commentsText}
      
      请用3-5个要点进行总结。
     `;
     
     const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "无法生成总结";

  } catch (error) {
    return "总结失败";
  }
}