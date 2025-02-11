import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function PUT(req: Request) {
  const { username } = await req.json();
  await dbConnect();

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    user.verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verifyCodeExpiry = new Date(Date.now() + 3600000);

    await user.save();

    const emailResponse = await sendVerificationEmail(
      user.email,
      user.username,
      user.verifyCode
    );

    if (emailResponse.success) {
      return Response.json(
        { success: true, message: "Verification Email send" },
        { status: 200 }
      );
    }
    return Response.json(
      { success: false, message: emailResponse.message },
      { status: 500 }
    );
  } catch (error) {
    console.log("Error sending verification email", error);
    return Response.json(
      { success: false, message: "Error reseding verification email" },
      { status: 500 }
    );
  }
}
