const express = require('express');
const ctrl = require('../../controllers/auth');

const router = express.Router();

router.post('/login', (req, res) => {
    const { email, phone, password, googleToken, appleToken } = req.body;
    const loginMethods = {
        "Email and Password": ctrl.loginWithEmailAndPassword,
        "Phone and Password": ctrl.loginWithPhoneAndPassword,
        "Google Login": ctrl.loginWithGoogle,
        "Apple Login": ctrl.loginWithApple,
      };
      
      let login = null;
      
      for (const controller of Object.entries(loginMethods)) {
        const result = controller({ email, phone, password, googleToken, appleToken });
        if (result) {
          login = true;
          break; 
        }
      }
      
      if (login) {
        res.status(200).json(login);
      } else {
        res.status(400).json({ message: "Invalid login credentials" });
      }
})

module.exports = router;