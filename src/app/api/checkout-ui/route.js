// app/api/ui-settings/route.js
import connectDB from '@/lib/mongodb';
import StoreUISettings from '@/models/CheckoutUi';

// Helper to get storeId (you can change based on auth later)
function getStoreId(request) {
  const url = new URL(request.url);
  return url.searchParams.get('storeId'); 
}

export async function GET(request) {
  try {
    await connectDB();
    const storeId = getStoreId(request);

    if (!storeId) {
      return new Response(JSON.stringify({ error: 'storeId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let settings = await StoreUISettings.findOne({ storeId });

    // Create with defaults if not exists
    if (!settings) {
      settings = await StoreUISettings.create({ storeId });
    }

    return new Response(JSON.stringify(settings), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to fetch settings' }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const storeId = getStoreId(request);

    if (!storeId) {
      return new Response(JSON.stringify({ error: 'storeId is required' }), { status: 400 });
    }

    const updates = await request.json();

    // Upsert: update if exists, create if not
    const settings = await StoreUISettings.findOneAndUpdate(
      { storeId },
      { $set: updates },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return new Response(JSON.stringify({ success: true, settings }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to save settings' }), { status: 500 });
  }
}