export const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
};

export const sendingCookies = async (
  res,
  accessToken,
  refreshToken,
  message,
) => {
  res.cookie("refreshToken", refreshToken, cookieOptions);
  res.setHeader("access-token", accessToken);
  res.status(201).json({ message });
};
