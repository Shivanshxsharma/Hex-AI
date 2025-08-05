import { useState } from 'react'
import './App.css'
import {createBrowserRouter, createRoutesFromElements, Link,NavLink, Route, RouterProvider, Routes} from 'react-router-dom'
import ChatInput from './components/ChatInput'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import ChatBubble from './components/ChatBubble'
import PersonalityCard from './components/PersonalityCard'
import Home from './pages/Home'
import ChatPage from './pages/ChatPage'

import { useEffect } from 'react'
import { useUser, useAuth, SignIn, SignUp } from '@clerk/clerk-react'
const api_url =import.meta.env.VITE_API_URL

const router =createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<SignIn/>} />
      <Route path='/signup' element={<SignUp/>} />
      <Route path='/normal/new' element={<ChatPage Headline="Normal" />} />
      <Route path='/astro/new' element={<ChatPage Headline="Astro"/>} />
      <Route path='/code/new' element={<ChatPage Headline="Code"/>} />
      <Route path='/therapist/new' element={<ChatPage Headline="Therapist"/>} />
      <Route path='/friend/new' element={<ChatPage Headline="Friend"/>} />
      <Route path='/movie/new' element={<ChatPage Headline="Movie"/>} />
      <Route path='/study/new' element={<ChatPage Headline="Study"/>} />
      <Route path='/career/new' element={<ChatPage Headline="Career"/>} />




      <Route path='/normal/chats/:chatId' element={<ChatPage Headline="Normal" />} />
      <Route path='/astro/chats/:chatId' element={<ChatPage Headline="Astro"/>} />
      <Route path='/code/chats/:chatId' element={<ChatPage Headline="Code"/>} />
      <Route path='/therapist/chats/:chatId' element={<ChatPage Headline="Therapist"/>} />
      <Route path='/friend/chats/:chatId' element={<ChatPage Headline="Friend"/>} />
      <Route path='/movie/chats/:chatId' element={<ChatPage Headline="Movie"/>} />
      <Route path='/study/chats/:chatId' element={<ChatPage Headline="Study"/>} />
      <Route path='/career/chats/:chatId' element={<ChatPage Headline="Career"/>} />
    </>
  )


)

function App() {
const {user,isSignedIn}=useUser();
const { getToken } = useAuth();

useEffect(() => {
  if (!isSignedIn || !user || localStorage.getItem("userSynced")) return;
  const SignInHandler=async ()=>{
  try {

const token = await getToken();
await fetch(`${api_url}/api/user`, {
  method: "POST",
  headers: {
    
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  }})
    console.log("user Added");
    localStorage.setItem("userSynced", "true");
  } catch (error) {
     console.error("❌ Error syncing user:", error);
  }
  }


SignInHandler();
}, [user,isSignedIn])









  return (
    <>
    <RouterProvider router={router}/>
    </>
  );
}

export default App;

