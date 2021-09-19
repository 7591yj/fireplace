import React, { useState, useRef } from "react";
import { addDoc, collection } from "firebase/firestore";
import { storageService, dbService } from "fbase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { faImage, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "css/IgniteFac.css";

const IgniteFac = ({ userObj }) => {
  const [ignite, setIgnite] = useState("");
  const [attachment, setAttachment] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentURL = "";
    if (attachment !== "") {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentURL = await getDownloadURL(response.ref);
    }

    const igniteObj = {
      text: ignite,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      creatorDisplayName: userObj.displayName,
      attachmentURL,
    };

    try {
      const docRef = await addDoc(collection(dbService, "ignites"), igniteObj);
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.log("Error while adding document: ", error);
    }

    setIgnite("");
    setAttachment("");
    fileInput.current.value = "";
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setIgnite(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;

    const _file = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      console.log(finishedEvent);
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(_file);
  };

  const fileInput = useRef();

  const onClearAttachment = () => {
    setAttachment("");
    fileInput.current.value = "";
  };

  return (
    <form onSubmit={onSubmit} className="form">
      {attachment && (
        <div className="factoryForm__attachment">
          <img
            alt="Attachment preview"
            src={attachment}
            style={{
              backgroundImage: attachment,
            }}
          />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <FontAwesomeIcon icon={faTimes} />
            <span> Remove</span>
          </div>
        </div>
      )}
      <input
        className="formInput"
        value={ignite}
        onChange={onChange}
        type="text"
        placeholder="What's on your mind?"
        maxLength={120}
      />
      <div>
        <label for="attach-file" className="factoryInput__label">
          <FontAwesomeIcon icon={faImage} />
          <span style={{ fontSize: 12 }}> Add a picture</span>
        </label>
        <input
          id="attach-file"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInput}
          style={{ opacity: 0 }}
        />
        <input type="submit" value="Ignite" className="formBtn" />
      </div>
    </form>
  );
};

export default IgniteFac;
