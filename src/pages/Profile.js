import { uploads } from "../utils/config";

// Components
import { Link } from "react-router-dom";
import * as Bs from "react-icons/bs";
import StateButtons from "../components/StateButtons";

// Hooks
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useResetComponentMessage } from "../hooks/useResetComponentMessage";

// Redux
import { getUserDetails } from "../slices/userSlice";
import {
  getUserPhotos,
  publishPhoto,
  deletePhoto,
  updatePhoto,
} from "../slices/photoSlice";

const Profile = () => {
  // catch user by URL
  const { id } = useParams();

  const dispatch = useDispatch();

  const resetMessage = useResetComponentMessage(dispatch);

  // States
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  const [editId, setEditId] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editTitle, setEditTitle] = useState("");

  // New form and edit form refs
  const newPhotoForm = useRef();
  const editPhotoForm = useRef();

  // User caught with id params(any user)
  const { user, loading } = useSelector((state) => state.user);
  // Authenticated user with token
  const { user: userAuth } = useSelector((state) => state.auth);

  const {
    photos,
    loading: loadingPhoto,
    message: messagePhoto,
    error: errorPhoto,
  } = useSelector((state) => state.photo);

  //Set payload user with params
  useEffect(() => {
    dispatch(getUserDetails(id));
    dispatch(getUserPhotos(id));
  }, [dispatch, id]);

  // Fill image state
  const handleFile = (e) => {
    const image = e.target.files[0];

    setPreviewImage(image);

    setImage(image);
  };

  //Publish Photo
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Gather user data from states
    const photoData = {
      title,
      image,
    };
    // Build form data
    const formData = new FormData();

    const photoFormData = Object.keys(photoData).forEach((key) =>
      formData.append(key, photoData[key])
    );

    formData.append("photo", photoFormData);

    await dispatch(publishPhoto(formData));

    setImage("");
    setPreviewImage("");
    setTitle("");
    resetMessage();
  };

  // Delete a photo
  const handleDelete = async (id) => {
    dispatch(deletePhoto(id));
    resetMessage();
  };

  //Show or hide forms
  const hideOrShowForms = () => {
    newPhotoForm.current.classList.toggle("hide");
    editPhotoForm.current.classList.toggle("hide");
  };

  // Update photo
  const handleUpdate = async (e) => {
    e.preventDefault();

    const photoData = {
      id: editId,
      title: editTitle,
    };
    dispatch(updatePhoto(photoData));
    hideOrShowForms();

    resetMessage();
  };

  // Fill edit state
  const handleEdit = (photo) => {
    if (editPhotoForm.current.classList.contains("hide")) {
      hideOrShowForms();
    }
    setEditId(photo._id);
    setEditTitle(photo.title);
    setEditImage(photo.image);
  };

  // Cancel Update
  const handleCancelEdit = (e) => {
    e.preventDefault();
    hideOrShowForms();
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div id="profile">
      {/* Info */}
      <div className="profile-header">
        {user.profileImage && (
          <img src={`${uploads}/users/${user.profileImage}`} alt={user.name} />
        )}
        <div className="profile-description">
          <h2>{user.name}</h2>
          <p>{user.bio}</p>
        </div>
      </div>
      {id === userAuth._id && (
        <>
          {/* Publish photo form */}
          <div className="new-photo" ref={newPhotoForm}>
            <h3>Compartilhe algum momento seu:</h3>
            <form onSubmit={handleSubmit}>
              <label>
                <span>Título para foto:</span>
                <input
                  type="text"
                  placeholder="Insíra um título"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title || ""}
                />
              </label>
              {previewImage && (
                <>
                  <p className="prev">Preview Image:</p>
                  <img
                    className="preview-image"
                    src={URL.createObjectURL(previewImage)}
                    alt=""
                  />
                </>
              )}
              <label>
                <span>Imagem:</span>
                <input type="file" onChange={handleFile} />
              </label>
              <StateButtons
                loading={loadingPhoto}
                error={errorPhoto}
                btn={"Postar"}
                message={messagePhoto}
              />
            </form>
          </div>
          {/* Update Image */}
          <div className="edit-photo hide" ref={editPhotoForm}>
            <p>Editando:</p>
            {editImage && (
              <img src={`${uploads}/photos/${editImage}`} alt={editTitle} />
            )}
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                onChange={(e) => setEditTitle(e.target.value)}
                value={editTitle || ""}
              />
              <input type="submit" value="Atualizar" />
              <button className="cancel-btn" onClick={handleCancelEdit}>
                Cancelar edição
              </button>
            </form>
          </div>
        </>
      )}
      {/* Get user photos */}
      <div className="user-photos">
        <h2>Fotos publicadas:</h2>
        <div className="photos-container">
          {photos &&
            photos.map((photo) => (
              <div className="photo" key={photo._id}>
                {photo.image && (
                  <img
                    src={`${uploads}/photos/${photo.image}`}
                    alt={photo.title}
                  />
                )}
                {id === userAuth._id ? (
                  <div className="actions">
                    <Link to={`/photos/${photo._id}`}>
                      <Bs.BsFillEyeFill />
                    </Link>
                    <Bs.BsPencilFill onClick={() => handleEdit(photo)} />
                    <Bs.BsXLg onClick={() => handleDelete(photo._id)} />
                  </div>
                ) : (
                  <Link className="btn" to={`/photos/${photo._id}`}>
                    Ver
                  </Link>
                )}
              </div>
            ))}
        </div>
        {photos.length === 0 && <p>Ainda não há fotos publicadas.</p>}
      </div>
    </div>
  );
};

export default Profile;
