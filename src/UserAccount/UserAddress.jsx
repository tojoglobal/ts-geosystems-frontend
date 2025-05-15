import { useState } from 'react';
import { Link } from 'react-router-dom';

const UserAddress = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'Momen Hossain',
      company: 'Ian McCarry Solicitors',
      address1: '1980-1984 Maryhill Road',
      address2: 'ssd',
      city: 'Glasgow',
      postcode: 'G20 0EF',
      country: 'United Kingdom',
      phone: '0176761606'
    }
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Existing Addresses */}
      {addresses.map((address) => (
        <div key={address.id} className="bg-[#cac9c9] p-6 rounded-lg">
          <div className="space-y-1 mb-4">
            <p className="font-semibold">{address.name}</p>
            <p>{address.company}</p>
            <p>{address.address1}</p>
            <p>{address.address2}</p>
            <p>
              {address.city} {address.postcode}
            </p>
            <p>{address.country}</p>
            <p>Phone: {address.phone}</p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/account/edit-address-book"
              className="px-6 py-1 bg-crimson-red text-white rounded hover:bg-red-700"
            >
              EDIT
            </Link>
            <button
              className="px-6 cursor-pointer py-1 bg-crimson-red text-white rounded hover:bg-red-700"
              onClick={() => {}}
            >
              DELETE
            </button>
          </div>
        </div>
      ))}

      {/* Add New Address Card */}
      <Link
        to="/account/account-settings"
        className="border-2 group border-dashed border-gray-300 p-6 flex flex-col items-center justify-center cursor-pointer  hover:border-crimson-red transition-colors"
      >
        <div className="text-5xl text-crimson-red group-hover:text-red-700 mb-2">
          +
        </div>
        <p className="text-gray-600">New Address</p>
      </Link>
    </div>
  );
};

export default UserAddress;