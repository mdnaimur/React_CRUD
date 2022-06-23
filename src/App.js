import React, { useState, useEffect } from "react";
import './App.css';
import UserForm from "./component/UserForm";

const URL = "https://rest-api-without-db.herokuapp.com/users/";

const App = () => {

  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setisLoding] = useState(true)

  const [updateFlag, setUpdateFlag] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUser, setSelectedUser] = useState({
    username: "",
    email: "",
  });
  const geAllUsers = () => {
    fetch(URL)
      .then((res) => {
        if (!res.ok) {
          throw Error("could not fetch")
        }
        return res.json()
      }).then((data) => {
        setUsers(data.users)

      }).catch((e) => {
        setError(e.message);
      }).finally(() => {
        setisLoding(false)
      })

  }

  useEffect(() => {
    geAllUsers();
  }, [])

  const handleDelete = (id) => {
    fetch(URL + `/${id}`, {
      method: `DELETE`
    })
      .then((res) => {
        if (!res.ok) {
          throw Error("could not Delete")
        }
        geAllUsers();
      }).catch((e) => {
        setError(e.message);
      })

  }
  const handleEdit = (id) => {

    setSelectedUserId(id);
    setUpdateFlag(true);
    const filteredData = users.filter((user) => user.id === id);
    setSelectedUser({
      username: filteredData[0].username,
      email: filteredData[0].email,
    });

  }
  const handleUpdate = (user) => {

    fetch(URL + `/${selectedUserId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("failed to update");
        }
        geAllUsers();
        setUpdateFlag(false);
      })
      .catch((err) => {
        setError(err.message);
      });
  }


  const addUser = (user) => {
    fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => {
        if (res.status === 201) {
          geAllUsers();
        } else {
          throw new Error("could not create new user");
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return <div className="App">
    <h1>User Management App</h1>
    {isLoading && <h2>Loading....</h2>}
    {error && <h2>{error}</h2>}

    {updateFlag ? (
      <UserForm
        btnText="Update User"
        selectedUser={selectedUser}
        handleSubmitData={handleUpdate}
      />
    ) : (
      <UserForm btnText="Add User" handleSubmitData={addUser} />
    )}


    <section>
      {users &&
        users.map((user) => {
          const { id, username, email } = user;
          return (
            <article key={id} className="card">
              <p>{username}</p>
              <p>{email}</p>
              <button
                className="btn"
                onClick={() => {
                  handleEdit(id);
                }}
              >
                Edit
              </button>
              <button
                className="btn"
                onClick={() => {
                  handleDelete(id);
                }}
              >
                Delete
              </button>
            </article>
          );
        })}
    </section>

  </div>
}

export default App;
