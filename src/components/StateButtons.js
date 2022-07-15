import Message from "./Message";

const StateButtons = ({ loading, error, btn, message }) => {
  return (
    <div>
      {!loading && <input type="submit" value={`${btn}`} />}
      {loading && <input type="submit" disabled value="Aguarde..." />}
      {error && <Message msg={error} type="error" />}
      {message && <Message msg={message} type="success" />}
    </div>
  );
};

export default StateButtons;
