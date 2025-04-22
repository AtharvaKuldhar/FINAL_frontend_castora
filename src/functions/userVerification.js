const jwt = require('jsonwebtoken');
const secret = require("./secret"); // Ensure this path is correct

function UserVerification(token) {

    try {
        const decoded = jwt.verify(token, secret);
        return decoded; // Attach the decoded user information to the request objec
    } catch (error) {
        // Handle token verification errors
        console.error("Token verification error:", error);
        return false;
    }
}

module.exports = UserVerification;