import React, { useState } from 'react';
import axios from 'axios';
import LeftBoxContent from '../LeftBox/LeftBoxContent';

import {
  Container,
  AppBar,
  Toolbar,
  InputBase,
  Button,
  Grid,
  Paper,
  Divider,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Define the shape of the message object
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatComponentProps {}

const ChatComponent: React.FC<ChatComponentProps> = (props) => {
  // State for user input and chat messages
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  // Handler for updating input state on user input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Handler for sending a message to the OpenAI API
  const handleSendMessage = async () => {
    const modelName = 'gpt-3.5-turbo';
    const maxTokens = 200;

    try {
      // Send a POST request to the OpenAI chat completion endpoint
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: input },
          ],
          model: modelName,
          max_tokens: maxTokens,
        },
        {
          // Include OpenAI API key for authorization
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      // Update the messages state with the assistant's response
      setMessages([...messages, { role: 'assistant', content: response.data.choices[0].message.content }]);
      // Clear the input field after sending the message
      setInput('');
    } catch (error) {
      // Return an error message if there is an issue sending the message
      console.error('Error sending message:', error);
    }
    };


  return (
    <Container>
      <div style={{ paddingTop: '20px' }}> {/* Adjust the value as needed */}
      {/* AppBar is the where the search bar is located. It contains a toolbar with the search bar.*/} 
      <AppBar position="static" style={{
          background: 'white',
          borderRadius: '20px',
          padding: '10px',
        }}> 
      <Toolbar>
          {/* This is the search bar*/} 
          <InputBase
            placeholder="What do you want to know?"
            inputProps={{ 'aria-label': 'type your message' }}
            value={input}
            onChange={handleInputChange}
            style={{ borderRadius: '20px', padding: '10px', color: 'black', flex: 1, marginRight: '10px'}}
          />
          <Button variant="contained" color="primary" onClick={handleSendMessage}>
            <SearchIcon></SearchIcon>
          </Button>
        </Toolbar>
      </AppBar>
      </div>
       {/* This where left and right box is placed inside a grid/container */} 
      <Grid container spacing={1} style={{ marginTop: '20px' }}>
        {/* This is where LeftBoxContent is placed */} 
        <LeftBoxContent/> 

        {/* This where the GPT's response is output */} 
        <Grid item xs={6}>
          <Divider orientation="vertical" flexItem />
          <Paper elevation={3} style={{ padding: '20px', overflowY: 'auto', height: '70vh' }}>

             {/* This is test-text for the right box */} 
            <p style={{ textAlign: 'left' }}>This is just text for testing this box, so you dont have to ask GPT. But if you ask, the response will return under.</p>
            
            {/* Mapping through messages and displaying them in the right box */} 
            {messages.map((message, index) => (
              <Typography
                key={index}
                variant="body1"
                align='left'
                color={message.role === 'user' ? 'primary' : 'success'}
              >
                {message.content}
              </Typography>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChatComponent;
