import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Login/Login.css'

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [hasCapital, setHasCapital] = useState(false);
  const [hasLow, setHasLow] = useState(false);
  const [hasSymbol, setHasSymbol] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasLeast8Char, setHasLeast8Char] = useState(false);

  const [showPass, setShowPass] = useState(false);

  const handleShowPass = () => setShowPass(prev => !prev);

  const handlePassChange = (e) => {
    const pass = e.target.value;
    setPassword(pass);
    setHasCapital(/[A-Z]/.test(pass));
    setHasLow(/[a-z]/.test(pass));
    setHasSymbol(/[$#@.]/.test(pass));
    setHasNumber(/[0-9]/.test(pass));
    setHasLeast8Char(pass.length >= 8);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:4000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');
      setSuccessMsg('Signup successful! You can now login.');
      setUsername('');
      setEmail('');
      setPassword('');
      setTimeout(() => {
        setSuccessMsg('');
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        /><br />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        /><br />
        <input
          type={showPass ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={e => {
            setPassword(e.target.value);
            handlePassChange(e);
          }}
          required
        />
        <button type="button" onClick={handleShowPass} style={{ marginLeft: '10px' }}>
          {showPass ? 'Hide Password' : 'Show Password'}
        </button>
<br />
        <p>
          {hasCapital ? '✅' : '❌'} At least one capital (A-Z)<br />
          {hasLow ? '✅' : '❌'} At least one lowercase (a-z)<br />
          {hasSymbol ? '✅' : '❌'} At least one symbol (@, #, $, .)<br />
          {hasNumber ? '✅' : '❌'} At least one number (0-9)<br />
          {hasLeast8Char ? '✅' : '❌'} At least 8 characters
        </p>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
