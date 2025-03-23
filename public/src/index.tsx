import React from 'react';
import ReactDOM from 'react-dom';
import Editor from './components/Editor';
import './styles/editor.css';

const App = () => {
    return (
        <div className="app">
            <Editor />
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));