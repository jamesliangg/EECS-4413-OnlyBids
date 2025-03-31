const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const validator = require("validator");

// Validates that a password only contains alphanumeric and specific special characters
const isValidPassword = (password) => {
  // Check if password contains only alphanumeric and allowed special characters
  // Regex that allows only ASCII alphanumeric and these specific special characters: !@#$%^&*()
  const validPasswordRegex = /^[A-Za-z0-9!@#$%^&*()]+$/;

  // Check for spaces
  if (password.includes(" ")) {
    return { valid: false, reason: "Password cannot contain spaces" };
  }

  // Check if password matches the valid pattern
  if (!validPasswordRegex.test(password)) {
    return {
      valid: false,
      reason:
        "Password can only contain alphanumeric characters and these special characters: !@#$%^&*()",
    };
  }

  return { valid: true };
};

const userController = {
  signup: async (req, res) => {
    try {
      // Get the request body
      const {
        email,
        password,
        username,
        security_question,
        security_answer,
        street,
        city,
        state,
        postal_code,
        country,
      } = req.body;

      // Validate required fields
      if (
        !email ||
        !password ||
        !username ||
        !security_question ||
        !security_answer
      ) {
        return res.status(400).json({
          error:
            "Email, password, username, security question, and security answer are required",
        });
      }

      // Validate email format
      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // Validate username is alphanumeric
      if (!validator.isAlphanumeric(username)) {
        return res
          .status(400)
          .json({ error: "Username must contain only letters and numbers" });
      }

      // Validate username length
      if (username.length > 50) {
        return res
          .status(400)
          .json({ error: "Username must be less than 50 characters" });
      }

      // Validate password format
      const passwordCheck = isValidPassword(password);
      if (!passwordCheck.valid) {
        return res.status(400).json({ error: passwordCheck.reason });
      }

      // Validate security question and answer
      if (security_question.trim() === "") {
        return res
          .status(400)
          .json({ error: "Security question cannot be empty" });
      }

      if (security_answer.trim() === "") {
        return res
          .status(400)
          .json({ error: "Security answer cannot be empty" });
      }

      // Validate postal code if provided
      if (postal_code && postal_code.length > 20) {
        return res
          .status(400)
          .json({ error: "Postal code must be less than 20 characters" });
      }

      // Check if user already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Hash security answer (for better security)
      const hashedSecurityAnswer = await bcrypt.hash(security_answer, 10);

      // Create user with all fields
      const user = await UserModel.create({
        email,
        password: hashedPassword,
        username,
        security_question,
        security_answer: hashedSecurityAnswer,
        street,
        city,
        state,
        postal_code,
        country,
      });

      // Send a response with a 201 status code
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#successful_responses
      res.status(201).json({
        message: "User created successfully",
        userId: user.insertId,
      });
    } catch (error) {
      // Error handling
      console.error("Signup error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  signin: async (req, res) => {
    try {
      // Get the request body
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      // Validate email format
      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // Validate password format
      const passwordCheck = isValidPassword(password);
      if (!passwordCheck.valid) {
        return res.status(400).json({ error: passwordCheck.reason });
      }

      // Find user by email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Compare password with hashed password in database
      const isValidPasswordMatch = await bcrypt.compare(
        password,
        user.password_hash
      );
      if (!isValidPasswordMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Send success response with user data (excluding password)
      const { password_hash, security_answer, ...userData } = user;
      res.status(200).json({
        message: "Sign in successful",
        user: userData,
      });
    } catch (error) {
      // Error handling
      console.error("Signin error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Request password reset using security question
  // Possibly disable this endpoint as reveals if email is registered or not
  requestReset: async (req, res) => {
    try {
      const { email } = req.body;

      // Validate required fields
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Validate email format
      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // Find user by email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        // Possibly disable this endpoint as reveals if email is registered or not
        return res.status(200).json({
          message:
            "If your email is registered, you will receive the security question",
        });
      }

      // Return the security question
      res.status(200).json({
        message: "Security question retrieved",
        security_question: user.security_question,
      });
    } catch (error) {
      console.error("Request reset error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Reset password using security answer
  resetPassword: async (req, res) => {
    try {
      const { email, security_answer, new_password } = req.body;

      // Validate required fields
      if (!email || !security_answer || !new_password) {
        return res.status(400).json({
          error: "Email, security answer, and new password are required",
        });
      }

      // Validate email format
      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // Validate new password format
      const passwordCheck = isValidPassword(new_password);
      if (!passwordCheck.valid) {
        return res.status(400).json({ error: passwordCheck.reason });
      }

      // Find user by email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        // For security reasons, don't reveal that the email doesn't exist
        return res
          .status(401)
          .json({ error: "Invalid email or security answer" });
      }

      // Verify security answer
      const isValidAnswer = await bcrypt.compare(
        security_answer,
        user.security_answer
      );
      if (!isValidAnswer) {
        return res
          .status(401)
          .json({ error: "Invalid email or security answer" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(new_password, 10);

      // Update user's password
      await UserModel.updatePassword(user.user_id, hashedPassword);

      res.status(200).json({
        message: "Password reset successful",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  findUserAddress: async (res, req) => {
    const { userId } = req.params;
    try {
      const result = await UserModel.findUserAddressById(userId);
      if (!result) return res.status(404).json({ error: "User not found" });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = userController;
