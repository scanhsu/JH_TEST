import { GoogleGenAI, Type } from "@google/genai";
import { Subject, QuizQuestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuiz = async (subject: Subject, level: number): Promise<QuizQuestion[]> => {
  // Map simple level to topic complexity or specific focus areas if needed
  const topics = {
    [Subject.Chinese]: ["字音字形", "成語運用", "文言文閱讀", "白話文閱讀", "國學常識"],
    [Subject.English]: ["文法", "單字運用", "閱讀測驗", "克漏字", "對話理解"],
    [Subject.Math]: ["數與量", "代數", "幾何", "統計與機率", "函數"],
    [Subject.Science]: ["生物", "理化(物理)", "理化(化學)", "地球科學"],
    [Subject.Social]: ["台灣歷史", "中國歷史", "世界歷史", "地理", "公民"],
  };

  // Pick a random topic to focus this micro-battle on
  const subjectTopics = topics[subject];
  const randomTopic = subjectTopics[Math.floor(Math.random() * subjectTopics.length)];

  const prompt = `
    You are an expert tutor for the Taiwan Junior High School Comprehensive Assessment Program (國中教育會考).
    Create 3 multiple-choice questions for the subject: ${subject}.
    Focus on the topic: ${randomTopic}.
    Target Audience: 9th Grade students (Grade 3 Junior High).
    Difficulty Level: ${level > 5 ? 'Hard' : level > 2 ? 'Medium' : 'Easy'}.
    
    Requirements:
    1. Language: Traditional Chinese (Taiwan usage). For English subject, questions can be in English but explanations in Traditional Chinese.
    2. Format: 4 options per question.
    3. Content: Must be relevant to the 會考 syllabus.
    4. Explanation: Detailed and encouraging, explaining why the answer is correct.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING, description: "The question stem" },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "An array of 4 possible answers"
              },
              correctIndex: { type: Type.INTEGER, description: "The index (0-3) of the correct answer" },
              explanation: { type: Type.STRING, description: "Why this is correct and others are wrong" },
              topic: { type: Type.STRING, description: "The specific sub-topic" }
            },
            required: ["text", "options", "correctIndex", "explanation"],
          },
        },
      },
    });

    const data = JSON.parse(response.text || "[]");
    
    // Add IDs to questions
    return data.map((q: any, index: number) => ({
      ...q,
      id: `q-${Date.now()}-${index}`,
      // Fallback if topic isn't generated well
      topic: q.topic || randomTopic 
    }));

  } catch (error) {
    console.error("Failed to generate quiz:", error);
    // Fallback mock data to prevent crash if API fails or quota exceeded
    return [
      {
        id: "mock-1",
        text: "API 連線發生問題，請稍後再試。以下為範例題：《雅量》一文中，「綠豆糕」與「稿紙」的爭辯，主要在說明什麼道理？",
        options: ["朋友要互相忍讓", "審美觀點人人不同", "食物要與人分享", "寫作需要靈感"],
        correctIndex: 1,
        explanation: "雅量一文透過衣料與綠豆糕的例子，說明每個人觀點不同，應彼此尊重。",
        topic: "文意理解"
      }
    ];
  }
};