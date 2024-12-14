import React, { useState, useContext, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {UserContext} from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Uncategorized');
  const [desc, setDesc] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const {currentUser} = useContext(UserContext);
  const token = currentUser?.token;

  // redirect to login page for any user who is not logged in
  useEffect(() => {
    if(!token) {
      navigate('/login');
    }
  });

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  }

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video'
  ]

  const POST_CATEGORIES = [
    'Uncategorized',
    'Agriculture',
    'Art',
    'Business',
    'Education',
    'Entertainment',
    'Investment',
    'Weather'
  ]

  const createPost = async (e) => {
    e.preventDefault();
    const postData = new FormData();
    postData.set('title', title);
    postData.set('category', category);
    postData.set('desc', desc);
    postData.set('thumbnail', thumbnail);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/posts/create`, postData, { withCredentials: true, headers: {Authorization: `Bearer ${token}`}});

      console.log("response : ", response.data);

      if(response.status === 201) {
        navigate('/');
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  }

  return (
    <section className='create-post'>
      <div className="container">
        <h2>Create Post</h2>
        {error && <p className='form_error-message'>{error}</p>}
        <form className="form create-post_form" onSubmit={createPost}>
          <input type="text" placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} autoFocus />
          <select name="category" value={category} onChange={e => setCategory(e.target.value)}>
            {
              POST_CATEGORIES.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))
            }
          </select>
            <ReactQuill modules={modules} formats={formats} value={desc} onChange={setDesc} placeholder='Description' />
          <input type="file" name='thumbnail' id='thumbnail' accept='png, jpg, jpeg' onChange={e => setThumbnail(e.target.files[0])} />
          <button type='submit' className='btn primary'>Create Post</button>
        </form>
      </div>
    </section>
  )
}

export default CreatePost
