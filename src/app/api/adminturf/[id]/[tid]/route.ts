import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Turf from "@/app/model/turf";
import { log } from "console";


  
  export async function PATCH(req: NextRequest, { params }: { params: { tid: string } }) {
      await connectToDatabase();
  
      try {
          const id = params.tid;
          console.log("Updating Turf ID:", id);
  
          // Extract update fields from request body
          const updateData = await req.json();
          console.log("Update data:", updateData);
  
          // Ensure updateData is not empty
          if (!updateData || Object.keys(updateData).length === 0) {
              return NextResponse.json({ error: "No update data provided" }, { status: 400 });
          }
  
//  // Replace the entire document
//  const replacedTurf = await Turf.findOneAndReplace({ _id: id }, updatedData, { new: true });

          // Find and update the Turf
          const updatedTurf = await Turf.findByIdAndUpdate(id, updateData, { new: true });
  
          if (!updatedTurf) {
              return NextResponse.json({ error: "Turf not found" }, { status: 404 });
          }
  
          console.log("Updated Turf:", updatedTurf);
          return NextResponse.json({ message: "Turf updated successfully", updatedTurf }, { status: 200 });
  
      } catch (error) {
          console.error("Error updating turf:", error);
          return NextResponse.json({ error: "Server error" }, { status: 500 });
      }
  }
  

interface Params{
    params:{tid:string}
}


export async function DELETE(req: NextRequest, { params }: { params: { tid: string } }) {
    await connectToDatabase();

    try {
        const id = params.tid;
        console.log("Deleting Turf ID:", id);

        if (!id) {
            return NextResponse.json({ error: "Turf ID is required" }, { status: 400 });
        }

        const deletedTurf = await Turf.findByIdAndDelete(id);

        if (!deletedTurf) {
            return NextResponse.json({ error: "Turf not found" }, { status: 404 });
        }

        console.log("Deleted Turf:", deletedTurf);
        return NextResponse.json({ message: "Turf deleted successfully", deletedTurf }, { status: 200 });

    } catch (error) {
        console.error("Error deleting turf:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
