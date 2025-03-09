export const getDetailedConnectionInfo = async () => {
  if (typeof window === "undefined") {
    return {
      success: false,
      message: "No disponible en el servidor",
    }
  }

  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    online: navigator.onLine,
    screenWidth: screen.width,
    screenHeight: screen.height,
    colorDepth: screen.colorDepth,
  }
}

