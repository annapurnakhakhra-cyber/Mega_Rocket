// shiprocket/src/app/checkout/page.js

import CheckoutLayout from '../components/CheckoutLayout'; 

export const metadata = {
    title: 'Custom Fast Checkout',
};

export default function CheckoutPage() {
    return (
        <>
            {/* Import FontAwesome CSS for icons */}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
            
            <div className="min-h-screen bg-gray-100 p-4">
                <CheckoutLayout />
            </div>
        </>
    );
}