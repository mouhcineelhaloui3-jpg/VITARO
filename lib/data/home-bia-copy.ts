import { biaMetricFields } from "@/lib/data/bia-fields";

export const homeBiaCopy = {
  badge: "تحليل مقاومة الجسم",
  title: "تحليل ذكي، بإشارة خفيفة وآمنة.",
  body: "كيستعمل تقنية تحليل مقاومة الجسم (BIA)، وهي تقنية معروفة عالمياً لتحليل مكونات الجسم باستعمال تيار كهربائي خفيف جداً وغير محسوس، وآمن للاستعمال اليومي.",
  fields: [...biaMetricFields],
  pulseLabel: "إشارة خفيفة · غير محسوسة",
} as const;
