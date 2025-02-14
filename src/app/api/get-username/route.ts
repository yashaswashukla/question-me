import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function PUT(req: Request) {
  dbConnect();
  try {
    const { messageUrl } = await req.json();
    const response = await UserModel.findOne({ messageUrl });

    if (response) {
      return Response.json(
        { success: true, username: response.username },
        { status: 200 }
      );
    }

    return Response.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  } catch (error) {
    console.log("Error finding user", error);
    return Response.json(
      { success: false, message: "Error finding user" },
      { status: 500 }
    );
  }
}
