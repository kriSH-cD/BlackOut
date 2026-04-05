import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/lib/jwt';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, phone, physicianType } = body;

    // 1. Validate input
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    await dbConnect();

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 409 }
      );
    }

    // 3. Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Create new user in DB
    const newUser = await User.create({
      email,
      password: hashedPassword,
      phone: phone || '',
      physicianType: physicianType || '',
    });

    // 5. Generate JWT token
    const token = generateToken(newUser._id, newUser.email);

    // 6. Return Response
    return NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: newUser._id,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
