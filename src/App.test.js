import React from 'react';
import { render, screen, fireEvent, shallow } from '@testing-library/react';
import App from './App';
import Board from './Board';
import BoardBox from './BoardBox';

test('login screen disappear, and board appears', () => {
  render(<App />);

  const loginButtonElement = screen.getByText('Log-In')
  const inputElement = document.getElementById('username')

  expect(loginButtonElement).toBeInTheDocument();
  expect(inputElement).toBeInTheDocument();

  fireEvent.change(inputElement, { target: { value: "Akash" } })
  fireEvent.click(loginButtonElement)

  expect(inputElement).not.toBeInTheDocument();
  expect(loginButtonElement).not.toBeInTheDocument();
});


test('leaderboard disappeas and appears', () => {
  const result = render(<Board currentUser="Akash" />);
  const leaderboardButtonElement = screen.getByText('Show Leaderboard')

  expect(leaderboardButtonElement).toHaveTextContent("Show Leaderboard");

  fireEvent.click(leaderboardButtonElement)
  const leaderboardTableElement = screen.getByText('Leaderboard')

  expect(leaderboardButtonElement).toHaveTextContent("Hide Leaderboard");
  expect(leaderboardTableElement).toBeInTheDocument();
});

test('board screen disappear, and logout appears', () => {
  render(<App />);

  let loginButtonElement = screen.getByText('Log-In')
  const inputElement = document.getElementById('username')

  fireEvent.change(inputElement, { target: { value: "Akash" } })
  fireEvent.click(loginButtonElement)

  const logoutButtonElement = screen.getByText('Log-out')
  expect(logoutButtonElement).toBeInTheDocument();

  fireEvent.click(logoutButtonElement)
  expect(logoutButtonElement).not.toBeInTheDocument();
});

test('boardbox click', () => {

  render(<BoardBox value={"X"} winner={false} currentUser="Akash"/>);
  const divClickButtonElement = screen.getByRole('button')
  fireEvent.click(divClickButtonElement)

  expect(divClickButtonElement).toBeDefined()
  expect(divClickButtonElement).toHaveTextContent("X");
  expect(document.getElementsByClassName("box")[1]).not.toBeDefined()
});