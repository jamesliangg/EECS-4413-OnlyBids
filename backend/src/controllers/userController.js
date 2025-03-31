const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const xss = require("xss");

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

// Sanitize user input
const sanitizeUserInput = (input) => {
  if (typeof input !== "string") return input;
  return xss(input, {
    whiteList: {}, // Don't allow any HTML tags
    stripIgnoreTag: true, // Strip HTML tags
    stripIgnoreTagBody: ["script"], // Strip script tags and their content
  });
};

const userController = {
  signup: async (req, res) => {
    try {
      // Get the request body and sanitize all inputs
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

      // Sanitize all string inputs
      const sanitizedEmail = sanitizeUserInput(email);
      const sanitizedUsername = sanitizeUserInput(username);
      const sanitizedSecurityQuestion = sanitizeUserInput(security_question);
      const sanitizedSecurityAnswer = sanitizeUserInput(security_answer);
      const sanitizedStreet = sanitizeUserInput(street);
      const sanitizedCity = sanitizeUserInput(city);
      const sanitizedState = sanitizeUserInput(state);
      const sanitizedPostalCode = sanitizeUserInput(postal_code);
      const sanitizedCountry = sanitizeUserInput(country);

      // Validate required fields
      if (
        !sanitizedEmail ||
        !password ||
        !sanitizedUsername ||
        !sanitizedSecurityQuestion ||
        !sanitizedSecurityAnswer
      ) {
        return res.status(400).json({
          error:
            "Email, password, username, security question, and security answer are required",
        });
      }

      // Validate email format
      if (!validator.isEmail(sanitizedEmail)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // Validate username is alphanumeric
      if (!validator.isAlphanumeric(sanitizedUsername)) {
        return res
          .status(400)
          .json({ error: "Username must contain only letters and numbers" });
      }

      // Validate username length
      if (sanitizedUsername.length > 50) {
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
      if (sanitizedSecurityQuestion.trim() === "") {
        return res
          .status(400)
          .json({ error: "Security question cannot be empty" });
      }

      if (sanitizedSecurityAnswer.trim() === "") {
        return res
          .status(400)
          .json({ error: "Security answer cannot be empty" });
      }

      // Validate postal code if provided
      if (sanitizedPostalCode && sanitizedPostalCode.length > 20) {
        return res
          .status(400)
          .json({ error: "Postal code must be less than 20 characters" });
      }

      // Check if user already exists
      const existingUser = await UserModel.findByEmail(sanitizedEmail);
      if (existingUser) {
        return res.status(409).json({ error: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Hash security answer (for better security)
      const hashedSecurityAnswer = await bcrypt.hash(
        sanitizedSecurityAnswer,
        10
      );

      // Create user with all sanitized fields
      const user = await UserModel.create({
        email: sanitizedEmail,
        password: hashedPassword,
        username: sanitizedUsername,
        security_question: sanitizedSecurityQuestion,
        security_answer: hashedSecurityAnswer,
        street: sanitizedStreet,
        city: sanitizedCity,
        state: sanitizedState,
        postal_code: sanitizedPostalCode,
        country: sanitizedCountry,
      });

      res.status(201).json({
        message: "User created successfully",
        userId: user.insertId,
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  signin: async (req, res) => {
    try {
      // Get the request body and sanitize inputs
      const { email, password } = req.body;
      const sanitizedEmail = sanitizeUserInput(email);

      // Validate required fields
      if (!sanitizedEmail || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      // Validate email format
      if (!validator.isEmail(sanitizedEmail)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // Validate password format
      const passwordCheck = isValidPassword(password);
      if (!passwordCheck.valid) {
        return res.status(400).json({ error: passwordCheck.reason });
      }

      // Find user by email
      const user = await UserModel.findByEmail(sanitizedEmail);
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
      console.error("Signin error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Request password reset using security question
  // Possibly disable this endpoint as reveals if email is registered or not
  requestReset: async (req, res) => {
    try {
      const { email } = req.body;
      const sanitizedEmail = sanitizeUserInput(email);

      // Validate required fields
      if (!sanitizedEmail) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Validate email format
      if (!validator.isEmail(sanitizedEmail)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // Find user by email
      const user = await UserModel.findByEmail(sanitizedEmail);
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
      const sanitizedEmail = sanitizeUserInput(email);
      const sanitizedSecurityAnswer = sanitizeUserInput(security_answer);

      // Validate required fields
      if (!sanitizedEmail || !sanitizedSecurityAnswer || !new_password) {
        return res.status(400).json({
          error: "Email, security answer, and new password are required",
        });
      }

      // Validate email format
      if (!validator.isEmail(sanitizedEmail)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // Validate new password format
      const passwordCheck = isValidPassword(new_password);
      if (!passwordCheck.valid) {
        return res.status(400).json({ error: passwordCheck.reason });
      }

      // Find user by email
      const user = await UserModel.findByEmail(sanitizedEmail);
      if (!user) {
        // For security reasons, don't reveal that the email doesn't exist
        return res
          .status(401)
          .json({ error: "Invalid email or security answer" });
      }

      // Verify security answer
      const isValidAnswer = await bcrypt.compare(
        sanitizedSecurityAnswer,
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

  findUserData: async (req, res) => {
    const { userId } = req.params;
    const sanitizedUserId = sanitizeUserInput(userId);
    try {
      const result = await UserModel.findUserDataById(sanitizedUserId);
      if (!result) return res.status(404).json({ error: "User not found" });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = userController;
