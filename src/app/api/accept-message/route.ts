import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: "false",
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }
  const userId = user._id;
  const { acceptMessages } = await req.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage: acceptMessages,
      },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        { success: "false", message: "Failed to update the user status" },
        { status: 401 }
      );
    }
    return Response.json(
      {
        success: "true",
        message: "Successfully update the user status",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to update user status to update accept message", error);
    return Response.json(
      {
        success: "false",
        message: "Failed to update the user status to accept messages",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: "false",
        message: "Not authenticated",
      },
      { status: 500 }
    );
  }

  const userId = user._id;
  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        { success: "false", message: "User not found" },
        { status: 404 }
      );
    }
    return Response.json(
      { success: "true", isAcceptingMessage: foundUser.isAcceptingMessage },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error user message status", error);
    return Response.json(
      { success: "false", mesasge: "Error user message status" },
      { status: 500 }
    );
  }
}
