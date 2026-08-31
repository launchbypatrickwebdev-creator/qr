import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";

export async function DELETE() {
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

    const { data: businesses, error: businessesError } =
      await supabase
        .from("businesses")
        .select("id")
        .eq("owner_id", user.id);

    if (businessesError) {
      throw businessesError;
    }

    const businessIds =
      businesses?.map(
        (business) => business.id
      ) ?? [];

    if (businessIds.length > 0) {
      const { error: linksError } =
        await adminClient
          .from("links")
          .delete()
          .in(
            "business_id",
            businessIds
          );

      if (linksError) {
        throw linksError;
      }
    }

    const { error: deleteBusinessesError } =
      await adminClient
        .from("businesses")
        .delete()
        .eq("owner_id", user.id);

    if (deleteBusinessesError) {
      throw deleteBusinessesError;
    }

    const {
      error: deleteUserError,
    } =
      await adminClient.auth.admin.deleteUser(
        user.id
      );

    if (deleteUserError) {
      throw deleteUserError;
    }

    await supabase.auth.signOut();

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to delete account.",
      },
      {
        status: 500,
      }
    );
  }
}