import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";

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

    // Prepare payload with timestamp metadata
    const payload = {
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save document to Firestore
    const docRef = await addDoc(collection(db, "applications"), payload);

    return NextResponse.json(
      {
        message: "Application submitted successfully.",
        id: docRef.id,
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

export async function GET() {
  try {
    const applicationsRef = collection(db, "applications");
    const q = query(applicationsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const applications = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    return NextResponse.json(
      { message: "Failed to load applications." },
      { status: 500 }
    );
  }
}
