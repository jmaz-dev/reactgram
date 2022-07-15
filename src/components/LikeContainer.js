import { BsHeart, BsHeartFill } from "react-icons/bs";

const LikeContainer = ({ photo, user, handleLike }) => {
  return (
    <div className="like">
      {photo.likes && user && (
        <>
          {photo.likes.includes(user._id) ? (
            <BsHeartFill />
          ) : (
            <BsHeart onClick={() => handleLike(photo)} />
          )}
          <p>
            {photo.likes.length} Like
            <span>{photo.likes.length < 2 ? "" : "s"}</span>
          </p>
        </>
      )}
    </div>
  );
};

export default LikeContainer;
