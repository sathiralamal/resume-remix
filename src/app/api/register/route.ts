import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { findUserByEmail } from "@/lib/firestore-helpers";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in Firestore
    const now = new Date();
    const userRef = await db.collection("users").add({
      name,
      email,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
      remixCount: 0,
      isSubscribed: false,
      lemonSqueezyCustomerId: null,
      subscriptionId: null,
      subscriptionStatus: null,
      subscriptionPlan: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: { id: userRef.id, name, email },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: (error as any).errors[0]?.message ?? "Validation failed" },
        { status: 400 }
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
