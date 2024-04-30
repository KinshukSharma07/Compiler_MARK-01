import React, { useState } from 'react';
import axios from 'axios';
import AceEditor from 'react-ace'; // Import AceEditor
import 'ace-builds/src-noconflict/mode-c_cpp'; // Import C++ mode
import 'ace-builds/src-noconflict/theme-monokai'; // Import Monokai theme

const App = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');

  const handleRunCode = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const response = await axios.post('http://localhost:5000/evaluate/cpp', { code, language });
      console.log(response.data);
      // Handle response from backend
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-md shadow-md" onSubmit={handleRunCode}>
      <h2 className="text-xl font-semibold mb-4">Code Compiler</h2>
      <div className="mb-4">
        <label htmlFor="code" className="block text-gray-700">Enter your code:</label>
        <AceEditor
          className='rounded-lg'
          mode="c_cpp" // Set the mode to C++
          theme="monokai" // Set the theme (you can change it)
          onChange={setCode} // Handle onChange event
          value={code}
          name="code"
          editorProps={{ $blockScrolling: true }}
          width="100%"
          height="300px"
          fontSize={16}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="language" className="block text-gray-700">Select language:</label>
        <select
          id="language"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="" disabled>Select language</option>
          <option value="c">C</option>
          <option value="py">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
      </div>
      <button
        type="submit"
        className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none"
      >Submit</button>
    </form>
  );
}

export default App;
