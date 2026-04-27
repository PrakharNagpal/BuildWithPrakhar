import { Resend } from "resend";
import { config } from "dotenv";

config({ path: ".env.local" });

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey || apiKey === "re_xxxxxxxxx") {
  console.error("Replace re_xxxxxxxxx with your real Resend API key in .env.local.");
  process.exit(1);
}

const resend = new Resend(apiKey);

const { data, error } = await resend.emails.send({
  from: "onboarding@resend.dev",
  to: "prakharnagpal2001@gmail.com",
  subject: "Hello World",
  html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
});

if (error) {
  console.error(error);
  process.exit(1);
}

console.log("Email sent:", data);
