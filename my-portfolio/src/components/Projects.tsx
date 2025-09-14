import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import '../style/Projects.css';

interface Issue {
    id: number;
    title: string;
    body: string;
    html_url: string;
}

//Fetch當前時間
const Blog: React.FC = () => {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('https://api.github.com/repos/jason980102/jasonBlog/issues')
            .then(r => r.ok ? r.json() : Promise.reject('Failed to fetch issues'))
            .then(setIssues)
            .catch(e => setError(String(e)));
    }, []);

    return (
        <div className="blog-container">
            <h1 className="blog-title">MY PROJECT</h1>
            {error && <div className="error">Error: {error}</div>}
            <ul className="blog-list">
                {issues.slice().reverse().map(issue => (
                    <li key={issue.id} className="block visible">
                        <a href={issue.html_url} target="_blank" rel="noreferrer">{issue.title}</a>
                        <div className="issue-body"><ReactMarkdown>{issue.body}</ReactMarkdown></div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Blog;
