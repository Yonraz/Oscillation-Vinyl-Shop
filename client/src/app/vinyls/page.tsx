import { getVinyls } from "@/api/get-vinyls";
import { Vinyl } from "@/types/vinyl";

const Vinyls = async () => {
  const tickets: Vinyl[] = await getVinyls();
  return (
    <div>
      <h1>Tickets</h1>
      {tickets && (
        <ul>
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <h2>{ticket.title}</h2>
              <p>{ticket.price}</p>
            </li>
          ))}
        </ul>
      )}
      {!tickets && <p>No tickets found</p>}
    </div>
  );
};
export default Vinyls;
