import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserRole,
  loadAllUsers,
  deleteUser,
} from "../../actions/adminActions";

const UserDetails = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin);

  const [editingUserId, setEditingUserId] = useState(null);
  const [editedRole, setEditedRole] = useState("");

  useEffect(() => {
    dispatch(loadAllUsers());
  }, [dispatch]);

  const handleEditClick = (user) => {
    setEditingUserId(user._id);
    setEditedRole(user.role);
  };

  const handleRoleChange = (e) => {
    setEditedRole(e.target.value);
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await dispatch(deleteUser(userId));
      } catch (err) {
        console.error("Failed to delete user:", err);
      }
    }
  };

  const handleSave = async (userId) => {
    try {
      await dispatch(updateUserRole(userId, editedRole)); // Update only
      setEditingUserId(null); // ✅ Done — no need to re-fetch
    } catch (err) {
      console.error("Failed to update role:", err);
    }
  };

  const handleCancel = () => {
    setEditingUserId(null);
    setEditedRole("");
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title text-uppercase mb-0">Manage Users</h5>
            </div>

            <div className="table-responsive">
              <table className="table no-wrap user-table mb-0">
                <thead>
                  <tr>
                    <th className="border-0 text-uppercase font-medium pl-4">
                      #
                    </th>
                    <th className="border-0 text-uppercase font-medium">
                      Name
                    </th>
                    <th className="border-0 text-uppercase font-medium">
                      Email
                    </th>
                    <th className="border-0 text-uppercase font-medium">
                      Joined
                    </th>
                    <th className="border-0 text-uppercase font-medium">
                      Role
                    </th>
                    <th className="border-0 text-uppercase font-medium">
                      Manage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6">Loading...</td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="6">Error: {error}</td>
                    </tr>
                  ) : (
                    users.map((user, index) => (
                      <tr key={user._id}>
                        <td className="pl-4">{index + 1}</td>
                        <td>
                          <h5 className="font-medium mb-0">{user.name}</h5>
                        </td>
                        <td>
                          <span className="text-muted">{user.email}</span>
                        </td>
                        <td>
                          <span className="text-muted">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                          <br />
                          <span className="text-muted">
                            {new Date(user.createdAt).toLocaleTimeString()}
                          </span>
                        </td>
                        <td>
                          {editingUserId === user._id ? (
                            <select
                              className="form-control category-select"
                              value={editedRole}
                              onChange={handleRoleChange}
                            >
                              <option value="admin">Admin</option>
                              <option value="user">User</option>
                            </select>
                          ) : (
                            <span className="text-muted">
                              {user.role.charAt(0).toUpperCase() +
                                user.role.slice(1)}
                            </span>
                          )}
                        </td>
                        <td className="manage-buttons">
                          {editingUserId === user._id ? (
                            <>
                              <button
                                type="button"
                                className="btn btn-primary btn-sm mr-2"
                                onClick={() => handleSave(user._id)}
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={handleCancel}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="btn btn-success btn-circle btn-lg btn-circle"
                                onClick={() => handleEditClick(user)}
                              >
                                <img src="/images/edit.svg" alt="edit" />
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger btn-circle btn-lg btn-circle"
                                onClick={() => handleDelete(user._id)}
                              >
                                <img src="/images/delete.svg" alt="delete" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
