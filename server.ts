import express from "express";
import path from "path";

import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const __dirname = path.resolve();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy/safe initialization of GoogleGenAI
const getAI = () => {
  const apiKey =
    process.env.M_NASSAR_REALSTATE_KEY ;
    
  if (!apiKey) {
    console.warn("API Key is not set. Using intelligent fallback advisor.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "M.Nassar Real Estate" });
});

// 1. Gemini AI Real Estate Assistant Chat Endpoint
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "الرجاء إدخال نص السؤال." });
      return;
    }

    const ai = getAI();
    if (!ai) {
      // Graceful fallback response when API key is not configured
      const reply = `أهلاً بك في م. نصار العقارية. نحن متخصصون في شقق وفيلات وأراضي بيروت (الحمرا، رأس بيروت، الأشرفية، تلة الخياط، المصيطبة) وكافة المناطق اللبنانية.
يسرنا خدمتكم مباشرة عبر الهاتف أو الواتساب على الرقم: +961 76 743 414 للإجابة الفورية وتنسيق الجولات الميدانية ومعاملات السند الأخضر (2400 سهم).`;
      res.json({ reply });
      return;
    }

    const systemInstruction = `أنت "مستشار م. نصار العقاري الذكي" (M.Nassar Real Estate AI Advisor)، خبير عقاري متخصص وحصري في السوق العقاري اللبناني (بيروت ومختلف المناطق اللبنانية).
تحدث دائماً بأسلوب راقٍ، مهني، وموثوق باللغة العربية (أو بالإنجليزية إذا سأل المستخدم بالإنجليزية).
خبراتك تشمل:
1. شقق وعقارات داخل بيروت (الحمرا، المصيطبة، تلة الخياط، رأس بيروت، الروشة، الأشرفية، قريطم، الردينة، الصيفي، عين المريسة...).
2. عقارات خارج بيروت (المتن، كسروان، الشوف، جبل لبنان، المناطق الساحلية والجبلية).
3. المعاملات القانونية العقارية في لبنان: السند الأخضر (طابو مفرز 2400 سهم)، التسجيل العقاري، رسوم الانتقال، ورخص البناء.
4. النصائح الاستثمارية والعائد على الإيجار بالدولار الكاش في بيروت.
5. الإجابة بدقة ووضوح وتقديم النصيحة بأسلوب المكاتب العقارية الموثوقة.
إذا سألك المستخدم عن رقم التواصل أو الواتساب، اذكر رقم م. نصار العقارية: +961 76 743 414.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ reply: response.text || "عذراً، لم أستطع معالجة طلبك حالياً." });
  } catch (error: any) {
    console.error("Gemini AI Chat Error:", error);
    res.json({
      reply: `مرحباً بك في م. نصار العقارية. يمكنك التواصل المباشر مع فريقنا المختص عبر الواتساب على الرقم +961 76 743 414 للحصول على أدق تفاصيل العقارات في بيروت وجبل لبنان.`,
    });
  }
});

// 2. Gemini AI Property Evaluation / Investment Analysis Endpoint
app.post("/api/ai/evaluate", async (req, res) => {
  try {
    const { propertyTitle, location, price, propertyType, areaSqM, bedrooms, bathrooms, description } = req.body;

    const ai = getAI();
    if (!ai) {
      const evaluation = `### تقرير تقييم مبدئي من م. نصار العقارية
**العقار:** ${propertyTitle || 'عقار في لبنان'} - ${location || 'بيروت'}
**السعر المقترح:** $${price?.toLocaleString?.() || price} | **المساحة:** ${areaSqM || '-'} م²
1. **التقييم العام:** السعر يعكس متوسطات السوق الحالية للمنطقة بالدولار الفريش.
2. **الجدوى الاستثمارية:** تتمتع المنطقة بطلب إيجار قوي وعائد استثماري يتراوح بين 6% إلى 8% سنوياً.
3. **توصية م. نصار العقارية:** نوصي بمعاينة سند الملكية (2400 سهم) والتأكد من براءة الذمة المالية. للاستشارة المباشرة اتصل على: +961 76 743 414.`;
      res.json({ evaluation });
      return;
    }

    const systemInstruction = `أنت محلل عقاري ومثمن عقاري معتمد في لبنان لدى شركة "م. نصار العقارية".
قم بتحليل العقار المعروض وتقديم تقرير تثمين واستثمار شامل باللغة العربية ينقسم إلى:
1. **التقييم العام والتسعير**: هل السعر منطقي لمساحة ${areaSqM} م² وموقع ${location}؟
2. **المميزات الاستثمارية**: أبرز نقاط القوة (الموقع، التوزيع، العائد المتوقع).
3. **نصيحة للمشتري/المستثمر**: توصية م. نصار العقارية بخصوص هذا العقار والسندات العقارية في لبنان.
اجعل الإجابة منسقة وواضحة جداً وبنقاط جودة عالية.`;

    const prompt = `الرجاء تقييم هذا العقار:
- العنوان: ${propertyTitle || 'عقار في بيروت'}
- الموقع: ${location}
- السعر المطلوب: $${price?.toLocaleString?.() || price}
- النوع: ${propertyType}
- المساحة: ${areaSqM} م²
- عدد الغرف: ${bedrooms} نوم / ${bathrooms} حمام
- الوصف الإضافي: ${description || 'لا يوجد'}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    res.json({ evaluation: response.text || "تم التقييم بنجاح." });
  } catch (error: any) {
    console.error("Gemini AI Valuation Error:", error);
    res.json({
      evaluation: `تم استلام تفاصيل العقار. للتقييم الدقيق ومراجعة الأسعار التقديرية الحالية في ${location || 'بيروت'}، يرجى تزويدنا برقم السجل العقاري عبر واتساب م. نصار: +961 76 743 414.`,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
