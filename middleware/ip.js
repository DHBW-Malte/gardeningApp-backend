const ipWhitelist = ["127.0.0.1","172.20.0.1", "192.168.0.2", "192.168.0.126"];

const authenticateIP = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  if (!ipWhitelist.includes(clientIP)) {
    return res.status(403).json({ error: "Access denied. IP not allowed." });
  }
  next();
};

module.exports = authenticateIP;