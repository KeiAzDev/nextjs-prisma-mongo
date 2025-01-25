// pages/api/cleanup.ts (定期実行用API)
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  
    await prisma.userDate.deleteMany({
      where: {
        date: {
          lt: threeMonthsAgo
        }
      }
    });
  
    res.status(200).json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to cleanup dates' });
  }
}