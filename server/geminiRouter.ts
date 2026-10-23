import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import type { IncomingMessage, ServerResponse } from 'http';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';

const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, statusCode: number, data: any) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export async function handleGeminiApi(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const url = req.url || '';

  if (!url.startsWith('/api/gemini/')) {
    return false;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return true;
  }

  if (!apiKey) {
    sendJson(res, 500, { error: 'GEMINI_API_KEY is not configured on the server' });
    return true;
  }

  try {
    const body = await parseJsonBody(req);

    if (url === '/api/gemini/chat') {
      const { messages, model = 'gemini-3.8-flash', systemInstruction } = body;
      const selectedModel = model === 'gemini-3.1-flash-lite' ? 'gemini-3.1-flash-lite' : 'gemini-3.8-flash';

      const contents = (messages || []).map((m: { role: string; text: string }) => ({
        role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents,
        config: {
          systemInstruction:
            systemInstruction ||
            'You are AirNix Educator Assistant, a world-class AI pedagogical partner for teachers. You help manage classrooms, design engaging lesson plans, provide constructive grading feedback, draft empathetic parent communications, and analyze student growth trajectories over time. Keep answers organized, practical, and clear with clean Markdown.',
        },
      });

      sendJson(res, 200, {
        text: response.text || 'No response generated.',
        model: selectedModel,
      });
      return true;
    }

    if (url === '/api/gemini/quick-assist') {
      // Low-latency mode strictly using gemini-3.1-flash-lite
      const { prompt, context } = body;
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: `${context ? `Context: ${context}\n\n` : ''}Task: ${prompt}`,
        config: {
          systemInstruction:
            'You are an ultra-fast teaching assistant. Provide concise, immediate, and direct 1-3 sentence answers or snippets without filler.',
        },
      });

      sendJson(res, 200, {
        text: response.text || '',
        model: 'gemini-3.1-flash-lite',
      });
      return true;
    }

    if (url === '/api/gemini/student-report') {
      const { studentName, gradeTrend, attendanceRate, assignmentStats, subject } = body;

      const prompt = `Generate a comprehensive Student Growth & Progress Report for:
Student: ${studentName}
Subject: ${subject || 'General Academics'}
Attendance Rate: ${attendanceRate}%
Grade Trends: ${JSON.stringify(gradeTrend)}
Assignment Completion: ${JSON.stringify(assignmentStats)}

Please generate:
1. Executive Summary & Growth Trajectory
2. Academic Strengths & Mastery Areas
3. Areas for Growth & Interventions Needed
4. Actionable Next Steps for Teacher & Student
5. Short Parent-Teacher Conference Talking Point`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are an educational analytics specialist generating professional, motivating, and actionable student progress reports.',
        },
      });

      sendJson(res, 200, {
        report: response.text || '',
        model: 'gemini-3.8-flash',
      });
      return true;
    }

    sendJson(res, 404, { error: 'Endpoint not found' });
    return true;
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    sendJson(res, 500, {
      error: error?.message || 'Internal server error while processing Gemini request',
    });
    return true;
  }
}
