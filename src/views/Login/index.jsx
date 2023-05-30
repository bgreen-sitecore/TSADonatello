import { ReactComponent as IconPersonBadgeFill } from 'bootstrap-icons/icons/person-badge-fill.svg';
import React, { useState } from 'react';
import { sendIdentityEvent } from '../../services/personalizeService';

const LoginView = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);

    switch (event.target.value) {
      case 'brie.larson@gmail.com':
        setFirstName('Brie');
        setLastName('Larson');
        break;
      case 'scott.ryan@gmail.com':
        setFirstName('Scott');
        setLastName('Ryan');
        break;
      case 'pedro.pascal@gmail.com':
        setFirstName('Pedro');
        setLastName('Pascal');
        break;
      case 'ivy.george@gmail.com':
        setFirstName('Ivy');
        setLastName('George');
        break;
      default:
        break;
    }
  };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform login logic here
    console.log('Login submitted!', email);
    sendIdentityEvent(email, 'login', firstName, lastName);
    setLoggedIn(true);
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
                <td width={0}>
                  <label
                    className="text-decoration-none"
                    htmlFor="email"
                    style={{
                      padding: '10px',
                    }}
                  >
                    Email:
                  </label>
                </td>
                <td width={10}>
                  <input
                    list="emailList"
                    type="email"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    style={{
                      width: '300px',
                    }}
                  />
                  <datalist type="email" id="emailList">
                    <option value="">Select an email</option>
                    <option value="brie.larson@gmail.com">brie.larson@gmail.com</option>
                    <option value="scott.ryan@gmail.com">scott.ryan@gmail.com</option>
                    <option value="pedro.pascal@gmail.com">pedro.pascal@gmail.com</option>
                    <option value="ivy.george@gmail.com">ivy.george@gmail.com</option>
                  </datalist>
                </td>
              </tr>
              <tr>
                <td width={0}>
                  <label
                    className="text-decoration-none"
                    style={{
                      padding: '10px',
                    }}
                  >
                    First Name:
                  </label>
                </td>
                <td width={10}>
                  <input
                    type="text"
                    id="name"
                    value={firstName}
                    onChange={handleFirstNameChange}
                    style={{
                      width: '300px',
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td width={0}>
                  <label
                    className="text-decoration-none"
                    style={{
                      padding: '10px',
                    }}
                  >
                    Last Name:
                  </label>
                </td>
                <td width={10}>
                  <input
                    type="text"
                    id="name"
                    value={lastName}
                    onChange={handleLastNameChange}
                    style={{
                      width: '300px',
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td width={0}>
                  <button
                    className="btn btn-primary"
                    type="submit"
                    style={{
                      width: '100px',
                    }}
                  >
                    Login
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
      {loggedIn && (
        <div className="alert alert-success mt-3">
          <p className="m-0">
            <IconPersonBadgeFill className="i-va me-2" /> Logged in as {firstName} {lastName}, {email}
          </p>
        </div>
      )}
    </>
  );
};

export default LoginView;
