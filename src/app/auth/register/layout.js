// src/app/auth/register/layout.js
export const metadata = {
  title: "Register - Shop Admin",
  description: "Shop admin registration page",
};

export default function RegisterLayout({ children }) {
  return (
    <div className="flex items-center justify-center bg-gray-50">
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}
