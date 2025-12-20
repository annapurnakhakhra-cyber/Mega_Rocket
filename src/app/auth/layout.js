// src/app/auth/layout.js
export const metadata = {
  title: "Login / Register",
  description: "Authentication pages",
};

export default function AuthLayout({ children }) {
  return (
    // <html lang="en">
     <div className="h-screen flex items-center justify-center bg-gray-50">
        <main className="w-full h-full bg-white shadow-lg">
          {children}
        </main>
      </div>
    // </html>
  );
}
