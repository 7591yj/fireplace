import { dbService, storageService } from "fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { deleteObject, ref } from "firebase/storage";
import { faMinusSquare, faPenSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "css/Ignite.css";

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
              <div className="igniteForm">
                <form onSubmit={onSubmit} className="container">
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
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className="container">
            {igniteObject.attachmentURL && (
              <img
                className="igniteImage"
                src={igniteObject.attachmentURL}
                alt="Attached file"
              />
            )}
            <span className="igniteWrittenBy">
              Written by: {igniteObject.creatorDisplayName}
            </span>
            <div className="igniteBottomRow">
              <h4 className="igniteTitle">{igniteObject.text}</h4>
              {isOwner && (
                <>
                  <div className="igniteControls">
                    <FontAwesomeIcon
                      icon={faMinusSquare}
                      color={"#2f3640"}
                      size="1x"
                      onClick={onDeleteClick}
                      className="igniteDelete"
                    />
                    <FontAwesomeIcon
                      icon={faPenSquare}
                      color={"#2f3640"}
                      size="1x"
                      onClick={toggleEditing}
                      className="igniteEdit"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Ignite;
