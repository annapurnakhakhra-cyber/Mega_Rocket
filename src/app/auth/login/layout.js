// app/auth/layout.js
import "../../globals.css"; 

export const metadata = {
  title: "Login / Register",
  description: "Authentication pages",
};

export default function AuthLayout({ children }) {
  return (
    // <html lang="en">
       <div className="min-h-screen flex items-center justify-center bg-white">
        <main className="w-full min-h-screen p-6 shadow-md flex items-center justify-center">
          {children}
        </main>
     </div>
    // </html>
  );
}
  