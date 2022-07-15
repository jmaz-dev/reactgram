// Components
import { Link } from "react-router-dom";
import PhotoItem from "./PhotoItem";
import LikeContainer from "./LikeContainer";

// Hooks
import { useDispatch } from "react-redux";
import { useResetComponentMessage } from "../hooks/useResetComponentMessage";

// Redux
import { like } from "../slices/photoSlice";

const GetPhotoComponent = ({ photos, user, txt, txt2 }) => {
  const dispatch = useDispatch();

  const resetMessage = useResetComponentMessage(dispatch);

  const handleLike = (photo) => {
    dispatch(like(photo._id));
    resetMessage();
  };

  return (
    <div>
      {photos && photos.length > 0 ? (
        photos.map((photo) => (
          <div key={photo._id}>
            <PhotoItem photo={photo} />
            <LikeContainer photo={photo} user={user} handleLike={handleLike} />
            <Link className="btn" to={`/photos/${photo._id}`}>
              Ver mais
            </Link>
          </div>
        ))
      ) : (
        <h2 className="no-photos">
          {`${txt}`} <Link to={`/users/${user._id}`}>{`${txt2}`}</Link>
        </h2>
      )}
    </div>
  );
};

export default GetPhotoComponent;
