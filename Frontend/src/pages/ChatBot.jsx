import { useState } from 'react';
import axios from 'axios';
import { Dialog, Fab, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';

const ChatBot = () => {
    const [prompt, setPrompt] = useState("");
    const [conversation, setConversation] = useState([]);
    const [open, setOpen] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const question = prompt;
        try {
            const reply = await axios.post('https://bloggery-a3xc.onrender.com/assistant', { prompt: question });
            console.log("chat bot reply: ", reply);
            let answer = reply.data.response;
            let cleanAnswer = answer?.split(' ')?.filter(part => !part.includes('*'))?.join(' ');
            const newEntry = { question: question, answer: cleanAnswer };
            setConversation([...conversation, newEntry]);
            setPrompt('');
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="fixed bottom-4 right-4">
            <Fab
                color="primary"
                className="fixed bottom-4 right-4 z-10"
                onClick={handleOpen}
            >
                <ChatIcon />
            </Fab>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <IconButton onClick={handleClose} className="absolute top-0 right-0">
                    <CloseIcon />
                </IconButton>
                <div className="p-4">
                    <h1 className="text-2xl font-bold mb-4">Bloggery ChatBot</h1>
                    <div>
                        {conversation.map((entry, index) => (
                            <div key={index} className="mb-4 p-2 border-b flex flex-col gap-4 font-['Quattrocento']">
                                <p className="text-lg font-light capitalize border-r-4 border-orange-500 shadow-xl bg-gray-950 text-gray-100 rounded-lg p-3"><span className='font-bold'>You:</span> {entry.question}</p>
                                <p className="font-light text-lg text-right text-justify border-l-4 border-gray-400 shadow-lg p-3 bg-gray-900 text-gray-100 rounded-lg"><span className='font-bold'>Sam:</span> {entry.answer}</p>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSubmit} className="mb-4 flex">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="border p-2 rounded mr-2 w-full"
                            placeholder="Ask something..."
                        />
                        <button type="submit" className="bg-gray-800 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
                            <SendIcon />
                        </button>
                    </form>
                </div>
            </Dialog>
        </div>
    );
}

export default ChatBot;
