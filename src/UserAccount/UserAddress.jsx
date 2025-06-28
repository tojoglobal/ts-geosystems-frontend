import { Link } from "react-router-dom";
import useDataQuery from "../utils/useDataQuery";
import Swal from "sweetalert2";
import { useAxiospublic } from "../Hooks/useAxiospublic";

const UserAddress = () => {
  const axiosPublicUrl = useAxiospublic();
  const { data: addresses = [], refetch } = useDataQuery(
    ["addresses"],
    "/api/addresses"
  );

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete address?",
      text: "Are you sure you want to delete this address?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e62245",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Delete",
    });
    if (confirm.isConfirmed) {
      await axiosPublicUrl.delete(`/api/addresses/${id}`);
      Swal.fire({
        title: "Deleted",
        text: "Address has been deleted.",
        icon: "success",
        timer: 4000,
      });
      refetch();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {addresses.map((address) => (
        <div key={address.id} className="bg-[#cac9c9] p-6 rounded-lg">
          <div className="space-y-1 mb-4">
            <p className="font-semibold">
              {address.first_name} {address.last_name}
            </p>
            <p>{address.company}</p>
            <p>{address.address_line_1}</p>
            <p>{address.address_line_2}</p>
            <p>
              {address.city} {address.postcode}
            </p>
            <p>{address.country}</p>
            <p>County/State: {address.state}</p>
            <p>Phone: {address.phone}</p>
          </div>
          <div className="flex gap-2">
            <Link
              to={`/user/account/edit-address/${address.id}`}
              className="px-6 py-1 bg-crimson-red text-white rounded hover:bg-red-700"
            >
              EDIT
            </Link>
            <button
              className="px-6 cursor-pointer py-1 bg-crimson-red text-white rounded hover:bg-red-700"
              onClick={() => handleDelete(address.id)}
            >
              DELETE
            </button>
          </div>
        </div>
      ))}
      <Link
        to="/user/account/add-address"
        className="border-2 group border-dashed border-gray-300 p-6 flex flex-col items-center justify-center cursor-pointer hover:border-crimson-red transition-colors"
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
