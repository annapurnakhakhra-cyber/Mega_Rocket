import connectToDB  from "@/lib/db";

async function testDB() {
  try {
    await connectToDB();
    console.log("DB connected successfully!");
    process.exit(0);
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
}

testDB();
