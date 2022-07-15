import { uploads } from "../utils/config";
// Components
import { Link } from "react-router-dom";
import PhotoItem from "../components/PhotoItem";

// Hooks
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useResetComponentMessage } from "../hooks/useResetComponentMessage";

// Redux
import { getPhotoById, like, comment } from "../slices/photoSlice";
import LikeContainer from "../components/LikeContainer";
import Message from "../components/Message";

const Photo = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const resetMessage = useResetComponentMessage(dispatch);

  const { user } = useSelector((state) => state.auth);

  const { photo, loading, error, message } = useSelector(
    (state) => state.photo
  );
  // comments
  const [commentText, setCommentText] = useState("");

  console.log(commentText);
  //load photo data
  useEffect(() => {
    dispatch(getPhotoById(id));
  }, [dispatch, id]);

  // Insert Like
  const handleLike = () => {
    dispatch(like(photo._id));
    resetMessage();
  };
  // Insert comment
  const handleComment = (e) => {
    e.preventDefault();

    const commentData = {
      comment: commentText,
      id: photo._id,
    };
    dispatch(comment(commentData));

    setCommentText("");

    resetMessage();
  };

  if (loading) {
    return <p>Carregando...</p>;
  }
  return (
    <div id="photo">
      <PhotoItem photo={photo} />
      <LikeContainer photo={photo} user={user} handleLike={handleLike} />
      <div className="message-container">
        {error && <Message msg={error} type="error" />}
        {message && <Message msg={message} type="success" />}
      </div>
      <div className="comments">
        {photo.comments && (
          <>
            <h3>
              Comentário<span>{photo.comments.length < 2 ? "" : "s"}</span> (
              {photo.comments.length}):
            </h3>
            <form onSubmit={handleComment}>
              <input
                type="text"
                placeholder="Insira seu comentário..."
                onChange={(e) => setCommentText(e.target.value)}
                value={commentText || ""}
              />
              <input className="btn" type="submit" value="Enviar" />
            </form>
            {photo.comments.length === 0 && <p>Não há comentários...</p>}
            {photo.comments.map((comment, key) => (
              <div className="comment" key={key}>
                <div className="author">
                  {comment.userImage && (
                    <img
                      src={`${uploads}/users/${comment.userImage}`}
                      alt={comment.userName}
                    />
                  )}
                  <Link to={`/users/${comment.userId}`}>
                    <span>{comment.userName}</span>
                  </Link>
                  <span>{comment.comment}</span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Photo;
