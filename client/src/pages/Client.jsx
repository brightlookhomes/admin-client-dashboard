import { useParams } from "react-router-dom";

export default function Client() {
  const { id } = useParams();

  return (
    <div>
      <h2>Client</h2>
      <p>Client ID: {id}</p>
      <p>Coming soon.</p>
    </div>
  );
}

