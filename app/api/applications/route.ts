import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Application } from "@/models/Application";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (
      !body?.personalInfo?.name ||
      !body?.personalInfo?.email ||
      !body?.personalInfo?.country ||
      !body?.creatorProfile?.handle ||
      !body?.creatorProfile?.niche ||
      !body?.creatorProfile?.followerCount ||
      !body?.additionalDetails?.bio ||
      !body?.consents?.termsAndConditions
    ) {
      return NextResponse.json(
        { message: "Missing required application fields." },
        { status: 400 }
      );
    }

    await connectDB();

    const application = await Application.create(body);

    return NextResponse.json(
      {
        message: "Application submitted successfully.",
        id: application._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to save application:", error);
    return NextResponse.json(
      { message: "Failed to submit application. Please try again." },
      { status: 500 }
    );
  }
}
