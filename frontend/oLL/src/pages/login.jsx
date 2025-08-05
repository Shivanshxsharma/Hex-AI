import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { dark, neobrutalism } from '@clerk/themes';
function Login() {
  return (
    <div className="flex justify-center items-center min-h-screen !bg-neutral-950">
      <SignIn

        signUpUrl='/signup'
        appearance={{
          baseTheme:dark,
          elements: {
            // 🌑 Full Card Style
            card: "!bg-neutral-900 !text-white !shadow-xl !rounded-2xl !border !border-violet-700",
            logoBox: "w-full flex justify-center",
            logoImage: "!w-24 !h-24",

            // 📝 Form Fields
            input: "!bg-zinc-800 !text-white !placeholder-gray-400 !border-gray-700",
            formFieldLabel: "!text-white",
            headerTitle: "!text-white !text-xl !font-bold",
            headerSubtitle: "!text-gray-400",

            // ✅ Button Styles
            formButtonPrimary: "!bg-violet-600 !hover:bg-violet-500 !text-white !font-semibold",

            // 💬 Social Auth Buttons
            // 🔻 Divider Between Social + Email
            dividerLine: "!bg-zinc-600",
            dividerText: "!text-gray-400",

            // 🧠 Footer / Help / Links
            footer:"!bg-black",
            footerActionText: "!text-white",
            footerActionLink: "!text-violet-700 hover:!text-violet-300",
          },
          layout: {
            // socialButtonsVariant: 'blockButton',
            logoImageUrl: "/Owl.logo.png",
            logoPlacement: "inside",
          },
        }}
      />
    </div>
  );
}

export default Login;





