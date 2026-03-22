import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { authenticateRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = authenticateRequest(req);
  if (!auth.success) return auth.response;

  try {
    const userId = auth.payload.userId;

    // Fetch user's calls
    const calls = await prisma.callRecord.findMany({
      where: { userId },
      include: {
        analysis: {
          include: {
            lesson: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20, // max 20 recent calls
    });

    // Calculate average score over the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentScoreCalls = await prisma.callRecord.findMany({
      where: { 
        userId,
        createdAt: { gte: thirtyDaysAgo }
      },
      include: { analysis: true }
    });

    let totalScore = 0;
    let scoredCallsCount = 0;
    
    for (const call of recentScoreCalls) {
      if (call.analysis && call.analysis.score) {
        totalScore += call.analysis.score;
        scoredCallsCount++;
      }
    }

    const averageScore = scoredCallsCount > 0 ? (totalScore / scoredCallsCount).toFixed(1) : 0;

    // Find the most recent lesson recommendation from low-score calls (e.g., score < 4)
    let recommendedLesson = null;
    let recentBadCallReason = null;
    
    for (const call of calls) {
      if (call.analysis && call.analysis.score < 4 && call.analysis.lesson) {
        recommendedLesson = call.analysis.lesson;
        recentBadCallReason = call.analysis.summary;
        // Found the most recent lesson recommendation, stop
        break;
      }
    }

    return NextResponse.json({
      averageScore: parseFloat(averageScore as string),
      calls: calls.slice(0, 5), // return top 5 for the UI lists,
      recommendedLesson,
      recentBadCallReason,
    });
  } catch (error) {
    console.error("Dashboard datasi olishda xato:", error);
    return NextResponse.json(
      { error: "Server ichki xatosi" },
      { status: 500 }
    );
  }
}
