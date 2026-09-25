import { z } from "zod";

export const issueReportSchema = z.object({
  title: z.string().min(5, "শিরোনাম অন্তত ৫ অক্ষরের হতে হবে"),
  category: z.string().min(1, "ক্যাটাগরি নির্বাচন করুন"),
  ward: z.string().min(1, "ওয়ার্ড নির্বাচন করুন"),
  area: z.string().min(2, "এলাকার নাম লিখুন"),
  description: z.string().min(10, "বিস্তারিত বিবরণ অন্তত ১০ অক্ষরের হতে হবে"),
  reporterName: z.string().optional(),
  reporterPhone: z.string().optional(),
  reporterEmail: z.string().email("সঠিক ইমেইল দিন").optional().or(z.literal("")),
});

export type IssueReportFormValues = z.infer<typeof issueReportSchema>;
