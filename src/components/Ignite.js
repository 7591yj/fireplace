import { dbService, storageService } from "fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { deleteObject, ref } from "firebase/storage";

const Ignite = ({ igniteObject, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newIgnite, setNewIgnite] = useState(igniteObject.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to quench this Ignite?");
    if (ok) {
      await deleteDoc(doc(dbService, "ignites", igniteObject.id));
    }
    if (igniteObject.attachmentURL) {
      await deleteObject(ref(storageService, igniteObject.attachmentURL));
    }
  };

  const toggleEditing = async () => setEditing((prev) => !prev);

  const onSubmit = async (event) => {
    event.preventDefault();
    console.log(igniteObject, newIgnite);
    await updateDoc(doc(dbService, `ignites/${igniteObject.id}`), {
      text: newIgnite,
    });
    setEditing(false);
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewIgnite(value);
  };

  return (
    <div>
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit}>
                <input
                  type="text"
                  placeholder="Edit your Ignite"
                  value={newIgnite}
                  required
                  onChange={onChange}
                />
                <input type="submit" value="Update Ignite" />
              </form>
              <button onClick={toggleEditing}>Cancel</button>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{igniteObject.text}</h4>
          {igniteObject.attachmentURL && (
            <img
              src={igniteObject.attachmentURL}
              width="50px"
              height="50px"
              alt="Attached file"
            />
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete</button>
              <button onClick={toggleEditing}>Edit</button>
            </>
          )}
        </>
      )}
    </div>
  );
};
export default Ignite;
