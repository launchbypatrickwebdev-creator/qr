import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  request: Request
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const { businessId } =
      await request.json();

    if (!businessId) {
      return NextResponse.json(
        {
          error: "Business ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const { data: business } = await supabase
      .from("businesses")
      .select("id")
      .eq("id", businessId)
      .eq("owner_id", user.id)
      .single();

    if (!business) {
      return NextResponse.json(
        {
          error:
            "Business not found or access denied.",
        },
        {
          status: 404,
        }
      );
    }

    const { error: linksError } =
      await supabase
        .from("links")
        .delete()
        .eq("business_id", business.id);

    if (linksError) {
      throw linksError;
    }

    const { error: businessError } =
      await supabase
        .from("businesses")
        .delete()
        .eq("id", business.id)
        .eq("owner_id", user.id);

    if (businessError) {
      throw businessError;
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to delete business.",
      },
      {
        status: 500,
      }
    );
  }
}