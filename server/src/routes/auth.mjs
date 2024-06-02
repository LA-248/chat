import express from 'express';
import passport from 'passport';
import { handleSignUp } from '../controllers/sign-up-controller.mjs';

const authRouter = express.Router();

// Sign up
authRouter.post('/register/password', handleSignUp);

// Login
authRouter.post('/login/password', passport.authenticate('local', {
  successRedirect: 'http://localhost:3000',
  failureRedirect: 'http://localhost:3000/login',
}));

// Logout
authRouter.post('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      console.error('Logout error:', err);
      res.status(500).json('Error logging out.');
      return;
    }
    console.log('Session destroyed');
    res.redirect('http://localhost:3000/login');
  });
});

export default authRouter;