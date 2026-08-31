import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function cleanText(value: unknown) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

export async function POST(request: Request) {
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

    const body = await request.json();

    /*
     * Honeypot field.
     * Normal users should leave this empty.
     */
    const website = cleanText(body.website);

    if (website) {
      return NextResponse.json({
        success: true,
      });
    }

    const name = cleanText(body.name);
    const email = cleanText(body.email);
    const subject = cleanText(body.subject);
    const message = cleanText(body.message);

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          error: "Please complete all required fields.",
        },
        {
          status: 400,
        }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        {
          error: "Name is too long.",
        },
        {
          status: 400,
        }
      );
    }

    if (email.length > 254) {
      return NextResponse.json(
        {
          error: "Email is too long.",
        },
        {
          status: 400,
        }
      );
    }

    if (subject.length > 200) {
      return NextResponse.json(
        {
          error: "Subject is too long.",
        },
        {
          status: 400,
        }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        {
          error: "Message is too long.",
        },
        {
          status: 400,
        }
      );
    }

    const emailIsValid =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailIsValid) {
      return NextResponse.json(
        {
          error: "Please enter a valid email address.",
        },
        {
          status: 400,
        }
      );
    }

    const { error } = await supabase
      .from("support_requests")
      .insert({
        user_id: user.id,
        name,
        email,
        subject,
        message,
      });

    if (error) {
      console.error(
        "Support request error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Unable to send your support request.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Support API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to send your support request.",
      },
      {
        status: 500,
      }
    );
  }
}