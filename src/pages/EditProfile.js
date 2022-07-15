import { uploads } from "../utils/config";

// Hooks
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useResetComponentMessage } from "../hooks/useResetComponentMessage";

// Redux
import { profile, updateProfile } from "../slices/userSlice";

// Components
import StateButtons from "../components/StateButtons";
import Swal from "sweetalert2";

const EditProfile = () => {
  // Redux
  const { user, message, error, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // States
  const [hide, setHide] = useState("none");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [bio, setBio] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  // Hook
  const resetMessage = useResetComponentMessage(dispatch);

  // Load user data
  useEffect(() => {
    dispatch(profile());
  }, [dispatch]);

  // Fill form with user data
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setBio(user.bio);
    }
  }, [user]);

  // Update user
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Gather user data from states
    const userData = {
      name,
    };

    if (profileImage) {
      userData.profileImage = profileImage;
    }

    if (bio) {
      userData.bio = bio;
    }

    if (password === confirmPassword) {
      userData.password = password;
    } else if (password !== confirmPassword) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "As senhas precisam ser iguais.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    // Build form data
    const formData = new FormData();

    const userFormData = Object.keys(userData).forEach((key) =>
      formData.append(key, userData[key])
    );

    formData.append("user", userFormData);

    await dispatch(updateProfile(formData));

    resetMessage();
  };

  // Fill image state
  const handleFile = (e) => {
    // image preview
    const image = e.target.files[0];

    setPreviewImage(image);

    // Update image state
    setProfileImage(image);
  };

  //Password btn
  const handlePass = (e) => {
    e.preventDefault();
    if (hide === "none") {
      setHide("block");
    } else {
      setHide("none");
    }
  };
  return (
    <div id="edit-profile">
      <h2>Edite seus dados</h2>
      <p className="subtitle">
        Adicione uma imagem de perfil, e conte um pouco mais sobre você...
      </p>
      {(user.profileImage || previewImage) && (
        <img
          className="profile-image"
          src={
            previewImage
              ? URL.createObjectURL(previewImage)
              : `${uploads}/users/${user.profileImage}`
          }
          alt={user.name}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          onChange={(e) => setName(e.target.value)}
          value={name || ""}
        />
        <input type="text" placeholder="E-mail" disabled value={email || ""} />
        <label>
          <span>Imagem do Perfil:</span>
          <input type="file" onChange={handleFile} />
        </label>
        <label>
          <span>Bio:</span>
          <textarea
            type="text"
            placeholder="Descrição do perfil"
            onChange={(e) => setBio(e.target.value)}
            value={bio || ""}
          />
        </label>
        <button onClick={handlePass} className="change-pass">
          Alterar senha
        </button>
        <div style={{ display: `${hide}` }}>
          <label>
            <span>Nova senha</span>
            <input
              type="password"
              placeholder="Digite sua nova senha"
              onChange={(e) => setPassword(e.target.value)}
              value={password || ""}
            />
          </label>
          <label>
            <span>Confirmar nova senha</span>
            <input
              type="password"
              placeholder="Confirme a nova senha"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword || ""}
            />
          </label>
        </div>
        <div>
          <StateButtons
            error={error}
            loading={loading}
            btn={"Atualizar"}
            message={message}
          />
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
