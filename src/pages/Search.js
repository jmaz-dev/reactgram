// Hooks
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useResetComponentMessage } from "../hooks/useResetComponentMessage";
import { useQuery } from "../hooks/useQuery";

// Components
import GetPhotoComponent from "../components/GetPhotoComponent";

// Redux
import { search } from "../slices/photoSlice";

const Search = () => {
  // hooks
  const dispatch = useDispatch();
  const query = useQuery();
  const s = query.get("q");
  const resetMessage = useResetComponentMessage(dispatch);

  const { user } = useSelector((state) => state.auth);
  const { photos, loading } = useSelector((state) => state.photo);

  useEffect(() => {
    dispatch(search(s));
  }, [dispatch, s]);

  if(loading) {
    return <p>Carregando...</p>
  }
  return (
    <div id="search">
      <h2>Você está buscando por: {s}</h2>
      <GetPhotoComponent
        photos={photos}
        user={user}
        txt={"Não foram encontrados resultados"}
        txt2={""}
      />
    </div>
  );
};

export default Search;
