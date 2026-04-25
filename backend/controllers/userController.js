const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { isDBConnected, mockStore } = require('../utils/mockData');

/**
 * @desc    Standard Enterprise Login
 * @route   POST /api/users/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`🔐 Login Attempt: ${email} (DB Connected: ${isDBConnected()})`);

    if (!isDBConnected()) {
        console.log('⚠️ Running in Mock Security Mode');
        const mockUser = mockStore.users.find(u => u.email === email && u.password === password);
        if (mockUser) {
            console.log('✅ Mock Auth Success');
            return res.status(200).json({
                success: true,
                token: 'mock-jwt-token-pro-4455',
                user: { id: mockUser._id, name: mockUser.name, role: mockUser.role }
            });
        }
        console.log('❌ Mock Auth Failed');
        return res.status(401).json({ success: false, message: 'Invalid Mock Credentials' });
    }

    // 1. Check if user exists
    console.log('🌐 Checking Production DB...');
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid Credentials' });
    }

    // 2. Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid Credentials' });
    }

    // 3. Generate JWT
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '8h' }
    );

    res.status(200).json({
        success: true,
        token,
        user: { id: user._id, name: user.name, role: user.role }
    });
  } catch (err) {
    console.error('🔥 CRITICAL AUTH ERROR:', err);
    res.status(500).json({ success: false, message: `Auth Error: ${err.message}` });
  }
};
