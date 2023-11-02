import { useState } from "react";

const JoinChat = ({joinChat}) => {
    const [name, setName] = useState(undefined);
    const handleJoin = (e) => {
        e?.preventDefault();
        sessionStorage.name = name;
        joinChat(true);
    }
    return(<div>
        <h4>Join Chat</h4>
        <form onSubmit={(e) => handleJoin(e)}>
            <label style={{margin:'0px 1rem'}}>Enter Name:</label>
            <input value={name} onChange={(event) => setName(event?.target?.value)} />
            <button style={{margin:'0px 1rem'}} disabled={name ? false : true}>Join</button>
        </form>
    </div>)
};

export default JoinChat;