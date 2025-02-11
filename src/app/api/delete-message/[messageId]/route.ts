import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

export default async function DELETE(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  const messageId = params.messageId;
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    );
  }

  try {
    const response = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (response.modifiedCount == 0) {
      return Response.json(
        { success: false, message: "Message not found or already deleted" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Message Deleted" },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error deleting message", error);
    return Response.json(
      { success: "false", message: "Error occured while deleting message" },
      { status: 500 }
    );
  }
}
