// shiprocket/src/app/components/AddressStep.js

import React, { useState } from 'react';

const COUNTRIES = [
    { code: '', name: 'Select Country/Region *' }, 
    { code: 'IN', name: 'India' },
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'SG', name: 'Singapore' },
];

const AddressStep = ({ initialAddress, onAddressConfirm, userName }) => {
    const [address, setAddress] = useState(initialAddress || {
        country: '', 
        first_name: '',
        last_name: '',
        line1: '', 
        address2: '', 
        city: '',
        state: '',
        pincode: '',
        saveInfo: true, 
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        setAddress(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Input validation check for required fields
        if (!address.country || address.country === '' || !address.first_name || !address.last_name || !address.line1 || !address.city || !address.state || !address.pincode) {
            alert('Please fill in all required address fields (marked with *), including Country/Region.');
            return;
        }
        
        onAddressConfirm(address);
    };

    // Check if initialAddress exists and has the primary address line to confirm auto-fill
    const isAddressAutoFilled = initialAddress && initialAddress.line1 !== '';

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-2xl font-bold text-blue-600">Delivery Address</h3>
            
            {/* Auto-fill Notification */}
            {isAddressAutoFilled && (
                <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-sm font-semibold">
                    👋 Welcome back, {userName}! Your address is auto-filled.
                </div>
            )}

            {/* Country/Region Selector */}
            <select
                name="country"
                value={address.country}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500"
                required
            >
                {COUNTRIES.map((country) => (
                    <option 
                        key={country.code} 
                        value={country.code} 
                        disabled={country.code === ''}
                    >
                        {country.name}
                    </option>
                ))}
            </select>
            
            {/* First Name and Last Name */}
            <div className="grid grid-cols-2 gap-4">
                <input 
                    type="text" name="first_name" placeholder="First Name *" 
                    value={address.first_name} onChange={handleChange} 
                    className="p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500" 
                    required 
                />
                <input 
                    type="text" name="last_name" placeholder="Last Name *" 
                    value={address.last_name} onChange={handleChange} 
                    className="p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500" 
                    required 
                />
            </div>

            {/* Address (Line 1) */}
            <input 
                type="text" 
                name="line1" 
                placeholder="Address (Street, House No., Locality) *" 
                value={address.line1} 
                onChange={handleChange} 
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500" 
                required 
            />

            {/* Address Line 2 (Apartment, suite, etc. - Optional field) */}
            <input 
                type="text" 
                name="address2" 
                placeholder="Apartment, suite, building, etc. (Optional)" 
                value={address.address2} 
                onChange={handleChange} 
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500" 
            />

            {/* City, State, Pincode */}
            <div className="grid grid-cols-2 gap-4">
                <input 
                    type="text" name="city" placeholder="City *" 
                    value={address.city} onChange={handleChange} 
                    className="p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500" 
                    required 
                />
                <input 
                    type="text" name="state" placeholder="State *" 
                    value={address.state} onChange={handleChange} 
                    className="p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500" 
                    required 
                />
            </div>
            <input 
                type="text" name="pincode" placeholder="Pincode *" 
                value={address.pincode} onChange={handleChange} 
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500" 
                required 
            />

            {/* Save Information Checkbox */}
            <div className="flex items-center pt-2">
                <input
                    type="checkbox"
                    id="saveInfo"
                    name="saveInfo"
                    checked={address.saveInfo}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="saveInfo" className="ml-2 block text-base text-gray-900 font-medium">
                    Save this information for next time
                </label>
            </div>
            
            <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 mt-6"
            >
                Proceed to Payment
            </button>
        </form>
    );
};

export default AddressStep;