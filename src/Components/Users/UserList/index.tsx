import React, { useState, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import { BsFilter } from "react-icons/bs";
import { fetchUsers, addUser, editUser } from "../../../services/userService";

interface User {
  usrId: number;
  usrFirstname: string;
  usrLastname: string;
  usrUsername: string;
  usrEmail?: string;
  usrStatus: string;
  usrCdate: string;
  usrMdate: string | null;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [newUser, setNewUser] = useState<{ firstname: string; lastname: string; username: string; status: string }>({
    firstname: "",
    lastname: "",
    username: "",
    status: "1",
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers(currentPage);
        setUsers(data.content);
        setTotalPages(data.totalPages);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [currentPage]);

  const filteredUsers = users.filter(user =>
    `${user.usrFirstname} ${user.usrLastname} ${user.usrUsername}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleAddUser = async () => {
    try {
      if (isEditMode && currentUserId !== null) {
        await editUser(currentUserId, newUser.firstname, newUser.lastname, newUser.username, newUser.status);
      } else {
        await addUser(newUser.firstname, newUser.lastname, newUser.username);
      }
      setNewUser({ firstname: "", lastname: "", username: "", status: "1" });
      setIsModalOpen(false);
      setIsEditMode(false);
      setCurrentUserId(null);
      const data = await fetchUsers(currentPage);
      setUsers(data.content);
    } catch (err) {
      if (err instanceof Error) {
        setError(isEditMode ? "Failed to edit user: " + err.message : "Failed to add user: " + err.message);
      } else {
        setError("Failed to process user due to an unexpected error.");
      }
    }
  };

  const handleEditClick = (user: User) => {
    setNewUser({
      firstname: user.usrFirstname,
      lastname: user.usrLastname,
      username: user.usrUsername,
      status: user.usrStatus,
    });
    setCurrentUserId(user.usrId);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-kcbDarkBlue">User Management</h1>
          <p className="text-sm text-gray-500">Manage your team members and their account permissions here.</p>
        </div>
        <button
          className="bg-kcbGreen text-white px-6 py-2 rounded-lg"
          onClick={() => {
            setIsEditMode(false);
            setNewUser({ firstname: "", lastname: "", username: "", status: "1" });
            setIsModalOpen(true);
          }}
        >
          + Add User
        </button>
      </div>

      <div className="bg-kcbWhite shadow-lg rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-kcbDarkBlue rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring focus:ring-kcbTeal"
              />
              <FaSearch className="absolute top-2 right-3 text-kcbTeal" />
            </div>
            <button className="ml-3 bg-gray-200 text-kcbDarkBlue px-4 py-2 rounded-lg flex items-center">
              <BsFilter className="mr-2" /> Filters
            </button>
          </div>
          <div className="text-sm text-gray-500">All users {users.length}</div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="w-full bg-gray-100 text-left text-sm text-gray-600">
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Username</th>
                <th className="py-3 px-6">Access</th>
                <th className="py-3 px-6">Last Active</th>
                <th className="py-3 px-6">Date Added</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.usrId} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6">
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <div>
                        <h3 className="text-sm font-semibold text-kcbDarkBlue">
                          {user.usrFirstname} {user.usrLastname}
                        </h3>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-sm">
                    {user.usrUsername}
                  </td>
                  <td className="py-3 px-6 text-sm">
                    <span className="bg-kcbGreen text-white px-2 py-1 rounded-full text-xs">Admin</span>
                  </td>
                  <td className="py-3 px-6 text-sm">
                    {user.usrMdate ? new Date(user.usrMdate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="py-3 px-6 text-sm">
                    {new Date(user.usrCdate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6 text-right">
                    <button className="text-gray-400 hover:text-gray-600" onClick={() => handleEditClick(user)}>
                      <FiMoreVertical />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <button
            disabled={currentPage === 0}
            onClick={() =>
              setCurrentPage((prevPage) => Math.max(prevPage - 1, 0))
            }
            className="px-4 py-2 bg-kcbTeal text-white rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          <span>
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages - 1}
            onClick={() =>
              setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1))
            }
            className="px-4 py-2 bg-kcbTeal text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">{isEditMode ? "Edit User" : "Add New User"}</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={newUser.firstname}
                onChange={(e) => setNewUser({ ...newUser, firstname: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={newUser.lastname}
                onChange={(e) => setNewUser({ ...newUser, lastname: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Username</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Status</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={newUser.status}
                onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-kcbGreen text-white px-4 py-2 rounded-lg"
                onClick={handleAddUser}
              >
                {isEditMode ? "Save Changes" : "Add User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
