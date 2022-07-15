// Components
import GetPhotoComponent from "../components/GetPhotoComponent";

// Hooks
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

// Redux
import { getPhotos } from "../slices/photoSlice";

const Home = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const { photos, loading } = useSelector((state) => state.photo);

  useEffect(() => {
    dispatch(getPhotos());
  }, [dispatch]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div id="home">
      <GetPhotoComponent
        photos={photos}
        user={user}
        txt={"Ainda não há fotos publicadas,"}
        txt2={"clique aqui."}
      />
    </div>
  );
};

export default Home;
