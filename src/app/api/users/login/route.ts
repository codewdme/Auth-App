import { connect } from "@/dbConfig/dbconfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { emailID, password } = reqBody;

    const user = await User.findOne({ emailID });
    if (!user) {
      return NextResponse.json({ error: "Invalid emailID" });
    }
    // compare passwords using bcryptjs
    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    //Create token data
    const tokenData = {
      userID: user._id,
      emailID: user.emailID,
    };
    //create token
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "30s",
    });

    //response
    const response = NextResponse.json({
      message: "User successfully logged in",
      success: true,
      emailID: user.emailID,
      cookie: token,
    });

    response.cookies.set("token", token, { httpOnly: true });
    console.log("response sent");
    return response;
    //
  } catch (error: any) {
    return NextResponse.json(
      { error: "Server Error occurred" },
      { status: 400 }
    );
  }
}
