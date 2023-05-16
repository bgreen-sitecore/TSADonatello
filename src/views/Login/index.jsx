import React, { useState } from 'react';
import { sendIdentityEvent } from '../../services/personalizeService';

const LoginView = () => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform login logic here
    console.log('Login submitted!', email);
    sendIdentityEvent(email, 'login');
  };

  return (
    <>
      <div className="bg-secondary border-top p-4 text-white mb-3">
        <h1 className="display-6">Login</h1>
      </div>
      <div className="container mb-3">
        <form onSubmit={handleSubmit}>
          <table>
            <tbody>
              <tr>
                <td width={50}>
                  <label className="text-decoration-none" htmlFor="email">
                    Email:
                  </label>
                </td>
                <td width={300}>
                  <select type="email" id="email" value={email} onChange={handleEmailChange}>
                    <option value="">Select an email</option>
                    <option value="brie.larson@gmail.com">brie.larson@gmail.com</option>
                    <option value="scott.ryan@gmail.com">scott.ryan@gmail.com</option>
                    <option value="pedro.pascal@gmail.com">pedro.pascal@gmail.com</option>
                    <option value="ivy.george@gmail.com">ivy.george@gmail.com</option>
                  </select>
                </td>
                <td width={500}>
                  <button className="btn btn-primary" type="submit">
                    Login
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </>
  );
};

export default LoginView;
