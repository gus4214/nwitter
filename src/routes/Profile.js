import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { auth, dbService } from "fbase";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { storageService } from "fbase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import "routes/Profile.scss";

const Profile = ({ userObj, refreshUser }) => {
  const navigate = useNavigate();
  const onLogOutClick = () => {
    auth.signOut();
    navigate("/");
  };

  const getMyNweets = async () => {
    const q = query(
      collection(dbService, "nweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, "=>", doc.data());
    });
  };

  useEffect(() => {
    getMyNweets();
  }, []);

  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [profileAttachment, setProfileAttachment] = useState("");

  const onChange = (e) => {
    const { value } = e.target;
    setNewDisplayName(value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let attachmentUrl = userObj.photoURL;
    if (profileAttachment !== "") {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(
        attachmentRef,
        profileAttachment,
        "data_url"
      );
      attachmentUrl = await getDownloadURL(response.ref);
    }

    if (userObj.displayName !== newDisplayName || userObj.photoURL !== "") {
      await updateProfile(auth.currentUser, {
        displayName: newDisplayName,
        photoURL: attachmentUrl,
      });
    }
    refreshUser();
    setProfileAttachment("");
  };

  const onFileChange = (e) => {
    const { files } = e.target;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const { result } = finishedEvent.currentTarget;
      setProfileAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  const fileInput = useRef();

  const onClearAttachment = () => {
    setProfileAttachment("");
    fileInput.current.value = null;
  };

  return (
    <div className="profileContainer">
      <form onSubmit={onSubmit} className="profileForm">
        {userObj.photoURL && (
          <div className="profileForm_profilePhoto">
            <img
              src={userObj.photoURL}
              alt={"myImage"}
              style={{
                backgroundImage: userObj.photoURL,
                width: 50,
                height: 50,
              }}
            />
          </div>
        )}
        <span className="profileFrom_profileName">
          {userObj.displayName
            ? `${userObj.displayName}님, 환영합니다`
            : "Profile"}
        </span>
        <input
          className="formInput"
          type="text"
          autoFocus
          placeholder="Display name"
          onChange={onChange}
          value={newDisplayName}
        />
        <label htmlFor="attach-file" className="profileInput__label">
          <span>Update photos</span>
          <FontAwesomeIcon icon={faPlus} />
        </label>
        <input
          id="attach-file"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInput}
          style={{
            opacity: 0,
          }}
        />
        {profileAttachment && (
          <div className="profileForm__attachment">
            <img
              src={profileAttachment}
              alt={"myImage"}
              style={{
                backgroundImage: profileAttachment,
              }}
            />
            <div className="profileForm__clear" onClick={onClearAttachment}>
              <span>Remove</span>
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>
        )}
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
};

export default Profile;
