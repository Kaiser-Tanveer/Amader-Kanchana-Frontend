import { z } from "zod";

export const volunteerSchema = z.object({
  name: z.string().min(2, "নাম লিখুন"),
  mobile: z.string().min(11, "সঠিক মোবাইল নম্বর দিন"),
  email: z.string().email("সঠিক ইমেইল দিন").optional().or(z.literal("")),
  ward: z.string().min(1, "ওয়ার্ড নির্বাচন করুন"),
  profession: z.string().optional(),
  interests: z.array(z.string()).min(1, "অন্তত একটি ক্ষেত্র নির্বাচন করুন"),
  skills: z.string().optional(),
  availability: z.string().optional(),
  message: z.string().optional(),
});

export type VolunteerFormValues = z.infer<typeof volunteerSchema>;
